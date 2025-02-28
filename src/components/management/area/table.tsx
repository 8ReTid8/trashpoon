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
        <div className="overflow-x-auto">
            <table className="table bg-base-100">
                {/* head */}
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Area.map((n) => (
                        <tr key={n.id}>
                            <td>{n.id}</td>
                            <td>{n.name}</td>
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

            {/* Success or Error Message */}
            {errorMessage && (
                <div className="mt-4 text-sm text-red-600">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="mt-4 text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            {/* EDIT MODAL */}
            {editingNode && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold mb-4">Edit Area</h2>
                        <form className="space-y-2" action={editAction}>
                            <input type="hidden" name="id" value={editingNode.id} />

                            <label className="form-control">
                                <span className="label-text">Area Name</span>
                                <input 
                                    type="text"
                                    name="name"
                                    defaultValue={editingNode.name}
                                    className="input input-bordered w-full"
                                    required
                                />
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
