"use client";

import { Area } from "@prisma/client";
import { useManagementContext } from "@/utils/context/managementContext";
import { useActionState } from "react";
import { useState } from "react";
import { delete_area } from "@/utils/delete_area";
import { update_area } from "@/utils/update_area";

export default function AreaTable() {
    const data = useManagementContext();
    const [editingNode, setEditingNode] = useState<Area | null>(null);

    // State for error handling
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // DELETE FUNCTION
    const handleDelete = async (id: number) => {
        const confirmed = confirm("Are you sure you want to delete this area?");
        if (!confirmed) return;

        try {
            const result = await delete_area(id);
            if (result.success) {
                setSuccessMessage("Area deleted successfully!");
                setErrorMessage(null); // Clear previous errors
            } else {
                setErrorMessage(result.message || "Failed to delete area.");
                setSuccessMessage(null); // Clear previous success message
            }
        } catch (error) {
            setErrorMessage("An error occurred while deleting the area.");
            setSuccessMessage(null); // Clear previous success message
        }
    };

    // EDIT FUNCTION
    const saveEdit = async (prevState: any, formData: FormData) => {
        const areaId = editingNode?.id;
        const areaName = formData.get("name") as string;
        
        if (!areaName || !areaId) {
            return { success: false, message: "Fill all fields" };
        }

        try {
            await update_area(areaId, areaName);
            setEditingNode(null); // Close modal
            setSuccessMessage("Area updated successfully!");
            setErrorMessage(null); // Clear previous errors
            return { success: true, message: "Area updated successfully!" };
        } catch (error) {
            setErrorMessage("Failed to update area.");
            setSuccessMessage(null); // Clear previous success message
            return { success: false, message: "Failed to update area." };
        }
    };

    const [editState, editAction] = useActionState(saveEdit, null);

    return (
        <div className="p-4">
            {/* Card container using DaisyUI card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0 sm:p-4">
                    <h2 className="card-title px-4 pt-4 md:px-6 md:pt-6">Areas Management</h2>
                    
                    {/* Responsive table with DaisyUI */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th className="hidden md:table-cell">Id</th>
                                    <th>Name</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.Area.map((n) => (
                                    <tr key={n.id} className="hover">
                                        <td className="hidden md:table-cell">{n.id}</td>
                                        <td className="font-medium">{n.name}</td>
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
                    {data.Area.length === 0 && (
                        <div className="alert alert-info m-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No areas found. Add a new area to get started.</span>
                        </div>
                    )}

                    {/* Success or Error Message using DaisyUI alerts */}
                    {errorMessage && (
                        <div className="alert alert-error m-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success m-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{successMessage}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL using DaisyUI modal */}
            {editingNode && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Area</h3>
                        <form className="space-y-4" action={editAction}>
                            <input type="hidden" name="id" value={editingNode.id} />

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Area Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingNode.name}
                                    className="input input-bordered w-full"
                                    required
                                />
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