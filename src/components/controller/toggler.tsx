"use client"

import { useManagementContext } from "@/utils/managementContext"

export default function Toggler() {
    const data = useManagementContext();
    return (
        <div className="card">
            {data.Node.map((n) => (
                <div className="card bg-base-100 w-fit" key={n.id}>
                    <div className="card-body">
                        <div className="radial-progress text-primary" style={{ "--value": 70 }} role="progressbar">
                            70%
                        </div>
                        {n.name}
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                </div>
            ))}
        </div>
    )
}
