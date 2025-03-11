"use client";

import { LogWithNodeArea } from "@/types/type"

export default function LogTable({ data }: { data: LogWithNodeArea[] }) {
    return (
        <div className="overflow-x-auto bg-zinc-300">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>timestamp</th>
                        <th>node</th>
                        <th>area</th>
                        <th>capacity</th>
                        <th>status</th>
                    </tr>
                </thead>
                {data.length > 0 && (
                    <tbody>
                        {data.map((row, index) => {
                            console.log(row)
                            return (
                                <tr key={index}>
                                    <td>{row.timestamp.toDateString()}</td>
                                    <td>{row.node.name}</td>
                                    <td>{row.node.area.name}</td>
                                    <td>{row.capacity}</td>
                                    <td>{row.status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </table>
        </div>
    )
}
