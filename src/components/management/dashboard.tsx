"use client";

import { ManagementContext, managementType } from "@/utils/managementContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Using `useRouter` from Next.js
import NodeManager from "./node_manager";
import AreaManager from "./area_manager";

export default function Dashboard({ data }: { data: managementType }) {
    const router = useRouter(); // Use the router to access query parameters
    const [activeTab, setActiveTab] = useState(0);

    // Update active tab based on the query parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get("tab");

        // If the `tab` parameter is provided and is a valid number, set the active tab
        if (tabParam && !isNaN(Number(tabParam))) {
            setActiveTab(Number(tabParam));
        }
    }, []); // Empty dependency array to run this once when the component mounts

    const handleTabDisplay = () => {
        switch (activeTab) {
            case 0:
                return <NodeManager />;
            case 1:
                return <AreaManager />;
            default:
                return <NodeManager />; // Default to Node tab if invalid tab number
        }
    };

    const handleTabChange = (tabIndex: number) => {
        // Update the URL query parameter when a tab is changed
        setActiveTab(tabIndex);
        router.push(`?tab=${tabIndex}`, undefined);
    };

    return (
        <div>
            <ManagementContext.Provider value={data}>
                <div role="tablist" className="tabs tabs-boxed">
                    <button
                        onClick={() => handleTabChange(0)}
                        role="tab"
                        className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
                    >
                        Node
                    </button>
                    <button
                        onClick={() => handleTabChange(1)}
                        role="tab"
                        className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
                    >
                        Area
                    </button>
                </div>
                {handleTabDisplay()}
            </ManagementContext.Provider>
        </div>
    );
}
