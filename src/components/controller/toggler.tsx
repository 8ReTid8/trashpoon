// pages/index.js
import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Trash2 } from 'lucide-react';
import { useDashboardContext } from '@/utils/context/dashboardContext';
import { AreaBinDashboard } from '@/types/type';

export default function Toggler() {
    // Sample initial data for trash bins
    const data = useDashboardContext();
    const [areas, setAreas] = useState<AreaBinDashboard[]>([]);

    useEffect(() => {
        if (!data) return;
        console.log(data);
        const newArea = data.map((area) => ({
            id: area.id,
            name: area.name,
            bins: area.Node?.map((bin) => ({
                id: bin.id,
                name: bin.name,
                capacity: 0,
                locked: false
            })) || []
        }));

        setAreas(newArea);
    }, [data]); // Runs every time `data` changes

    // Function to toggle the lock status of a bin
    const toggleLock = (areaId: number, binId: number) => {
        setAreas(areas.map(area => {
            if (area.id === areaId) {
                return {
                    ...area,
                    bins: area.bins.map(bin => {
                        if (bin.id === binId) {
                            return { ...bin, locked: !bin.locked };
                        }
                        return bin;
                    })
                };
            }
            return area;
        }));
    };

    // Function to get progress class based on capacity
    const getProgressClass = (capacity: number) => {
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
                                    <div
                                        key={bin.id}
                                        className="mb-4 p-4 border border-base-300 rounded-box hover:bg-base-200 transition"
                                    >
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