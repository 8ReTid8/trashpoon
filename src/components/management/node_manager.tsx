"use client"
import NodeForm from "./node/form";
import NodeTable from "./node/table";

export default function NodeManager() {
    return (
        <div className="space-y-2">
            <NodeForm />
            <NodeTable />
        </div>
    )
}
