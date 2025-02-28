"use client";

import { ManagementContext, managementType } from "@/utils/context/managementContext";
import NodeManager from "./node_manager";
import AreaManager from "./area_manager";

export default function Dashboard({ data }: { data: managementType }) {
    return (
        <div>
            <ManagementContext.Provider value={data}>
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 pb-20">
                    <NodeManager />
                    <AreaManager />
                </div>
            </ManagementContext.Provider>
        </div>
    );
}
