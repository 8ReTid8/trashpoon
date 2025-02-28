"use client";

import { Node } from "@prisma/client";
import { useManagementContext } from "@/utils/context/managementContext";
import { useActionState } from "react";
import { useState } from "react";
import Link from "next/link";
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
        const clientId = formData.get("clientId") as string;
        const token = formData.get("token") as string;

        if (!nodeName || !clientId || !token) {
            return { success: false, message: "Fill all fields" };
        }

        try {
            await update_node(nodeId, nodeName, clientId, token);
            setEditingNode(null); // Close modal
            return { success: true, message: "Node updated successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to update node." };
        }
    };

    const [editState, editAction] = useActionState(saveEdit, null);

    return (
        <div className="overflow-x-auto">
            <table className="table bg-base-100">
                {/* head */}
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Area</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Node.map((n) => (
                        <tr key={n.id}>
                            <td>{n.id}</td>
                            <td>{n.name}</td>
                            <td>{n.areaId}</td>
                            <td className="space-x-2">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setEditingNode(n)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleDelete(n.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* EDIT MODAL */}
            {editingNode && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold mb-4">Edit Node</h2>
                        <form className="space-y-2" action={editAction}>
                            <input type="hidden" name="id" value={editingNode.id} />

                            <label className="form-control">
                                <span className="label-text">Node Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingNode.name}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>

                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Area</span>
                                </div>
                                <select className="select select-bordered" name="areaId" defaultValue={editingNode.areaId}>
                                    <option aria-disabled>Pick one</option>
                                    {data.Area.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </label>

                            <div className="flex justify-end space-x-2">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setEditingNode(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                        {editState && (
                            <div className={`mt-4 text-sm ${editState.success ? "text-green-600" : "text-red-600"}`}>
                                {editState.message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
