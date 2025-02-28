import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Trash2 } from 'lucide-react';
import { useDashboardContext } from '@/utils/context/dashboardContext';
import { AreaBinDashboard } from '@/types/type';
import { subscribeToMqtt } from '@/utils/mqtt/subscribe';

export default function Toggler() {
    const data = useDashboardContext();
    const [areas, setAreas] = useState<AreaBinDashboard[]>([]);

    useEffect(() => {
        if (!data) return;

        const newAreas: AreaBinDashboard[] = data.map(area => ({
            id: area.id,
            name: area.name,
            bins: area.Node?.map(bin => ({
                id: bin.id,
                name: bin.name,
                capacity: 0,
                locked: false
            })) || []
        }));

        setAreas(newAreas);

        // Subscribe and fetch initial data
        newAreas.forEach(area => {
            area.bins.forEach(bin => {
                subscribeToMqtt(area.id, bin.id);
                fetchLatestMessage(area.id, bin.id);
            });
        });

        // Start interval to fetch data every second
        const interval = setInterval(() => {
            newAreas.forEach(area => {
                area.bins.forEach(bin => {
                    fetchLatestMessage(area.id, bin.id);
                });
            });
        }, 1000); // Fetch every 1 second

        return () => clearInterval(interval); // Cleanup on unmount

    }, [data]);

    const fetchLatestMessage = async (areaId: number, deviceId: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:5175/latest-message?areaId=${areaId}&deviceId=${deviceId}`);
            const result = await response.json();

            if (result.message !== "No messages received yet") {
                const { capacity, locked } = JSON.parse(result.message);
                updateBinData(areaId, deviceId, capacity, locked);
            }
        } catch (error) {
            console.error('Error fetching bin data:', error);
        }
    };

    const updateBinData = (areaId: number, deviceId: number, capacity: number, locked: boolean): void => {
        setAreas(prevAreas =>
            prevAreas.map(area =>
                area.id === areaId
                    ? {
                        ...area,
                        bins: area.bins.map(bin =>
                            bin.id === deviceId
                                ? bin.capacity !== capacity || bin.locked !== locked // Update only if data changes
                                    ? { ...bin, capacity, locked }
                                    : bin
                                : bin
                        )
                    }
                    : area
            )
        );
    };

    const toggleLock = (areaId: number, binId: number): void => {
        setAreas(prevAreas =>
            prevAreas.map(area =>
                area.id === areaId
                    ? {
                        ...area,
                        bins: area.bins.map(bin =>
                            bin.id === binId ? { ...bin, locked: !bin.locked } : bin
                        )
                    }
                    : area
            )
        );
    };

    const getProgressClass = (capacity: number): string => {
        if (capacity < 40) return "progress-success";
        if (capacity < 75) return "progress-warning";
        return "progress-error";
    };

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Trash Bin Management Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areas.map((area) => (
                        <div key={area.id} className="card bg-base-100 shadow-xl">
                            <div className="card-title p-4 bg-primary text-primary-content">
                                <h2 className="text-xl">{area.name}</h2>
                            </div>

                            <div className="card-body p-4">
                                {area.bins.map((bin) => (
                                    <div key={bin.id} className="mb-4 p-4 border border-base-300 rounded-box hover:bg-base-200 transition">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <Trash2 className="mr-2" size={18} />
                                                <span className="font-medium">{bin.name}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleLock(area.id, bin.id)}
                                                className={`btn btn-circle btn-sm ${bin.locked ? 'btn-error' : 'btn-success'}`}
                                            >
                                                {bin.locked ? <Lock size={16} /> : <Unlock size={16} />}
                                            </button>
                                        </div>

                                        <div className="mb-1 flex justify-between items-center">
                                            <span className="text-sm opacity-70">Capacity:</span>
                                            <span className="text-sm font-medium">{bin.capacity}%</span>
                                        </div>

                                        <progress
                                            className={`progress w-full ${getProgressClass(bin.capacity)}`}
                                            value={bin.capacity}
                                            max="100"
                                        ></progress>

                                        <div className="mt-2 badge badge-sm">
                                            {bin.locked ? 'Locked' : 'Unlocked'}
                                        </div>
                                        <div className="mt-2 text-xs opacity-70">
                                            {bin.capacity >= 75 ? 'Needs emptying soon' :
                                                bin.capacity >= 40 ? 'Moderate fill level' : 'Low fill level'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
