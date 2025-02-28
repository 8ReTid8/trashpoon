"use client";

import { Node } from "@prisma/client";
import { useManagementContext } from "@/utils/context/managementContext";
import { useActionState } from "react";
import { useState } from "react";
import { update_node } from "@/utils/update_node";
import { delete_node } from "@/utils/delete_node";

export default function NodeTable() {
    const data = useManagementContext();
    const [editingNode, setEditingNode] = useState<Node | null>(null);

    // DELETE FUNCTION
    const handleDelete = async (id: number) => {
        const confirmed = confirm("Are you sure you want to delete this node?");
        if (!confirmed) return;

        try {
            await delete_node(id);
            alert("Node deleted successfully!");
        } catch (error) {
            alert("Failed to delete node.");
        }
    };

    // EDIT FUNCTION
    const saveEdit = async (prevState: any, formData: FormData) => {
        const nodeId = editingNode?.id;
        const nodeName = formData.get("name") as string;
        const areaId = formData.get("areaId") as string;

        if (!nodeName || !areaId) {
            return { success: false, message: "Fill all fields" };
        }

        try {
            await update_node(nodeId, nodeName, parseInt(areaId));
            setEditingNode(null); // Close modal
            return { success: true, message: "Node updated successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to update node." };
        }
    };

    const [editState, editAction] = useActionState(saveEdit, null);

    return (
        <div className="p-4">
            {/* Card container using DaisyUI card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0 sm:p-4">
                    <h2 className="card-title px-4 pt-4 md:px-6 md:pt-6">Nodes Management</h2>
                    
                    {/* Responsive table with DaisyUI */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th className="hidden md:table-cell">Id</th>
                                    <th>Name</th>
                                    <th>Area</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.Node.map((n) => (
                                    <tr key={n.id} className="hover">
                                        <td className="hidden md:table-cell">{n.id}</td>
                                        <td>{n.name}</td>
                                        <td>
                                            <div className="badge badge-primary badge-outline">
                                                {data.Area.find(a => a.id === n.areaId)?.name || n.areaId}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary btn-outline"
                                                    onClick={() => setEditingNode(n)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-error btn-outline"
                                                    onClick={() => handleDelete(n.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state using DaisyUI alert */}
                    {data.Node.length === 0 && (
                        <div className="alert alert-info m-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No nodes found. Add a new node to get started.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL using DaisyUI modal */}
            {editingNode && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Node</h3>
                        <form className="space-y-4" action={editAction}>
                            <input type="hidden" name="id" value={editingNode.id} />

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Node Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingNode.name}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Area</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full"
                                    name="areaId" 
                                    defaultValue={editingNode.areaId}
                                >
                                    {data.Area.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>

                            {editState && (
                                <div className={`alert ${editState.success ? "alert-success" : "alert-error"} my-2`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{editState.message}</span>
                                </div>
                            )}

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setEditingNode(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setEditingNode(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}