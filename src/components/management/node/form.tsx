"use client";
import { add_node } from "@/utils/add_node";
import { useManagementContext } from "@/utils/context/managementContext";
import { useActionState } from "react";
import { useState } from "react";

export default function NodeForm() {
    const data = useManagementContext();
    const [isLoading, setIsLoading] = useState(false);

    const saveNode = async (prevState: any, formData: FormData) => {
        setIsLoading(true);
        const nodeName = formData.get("name") as string;
        const areaId = formData.get("areaId") as string;

        if (!nodeName || !areaId) {
            setIsLoading(false);
            return { success: false, message: "Please fill all required fields" };
        }

        try {
            await add_node(nodeName, parseInt(areaId));
            setIsLoading(false);
            return { success: true, message: "Node saved successfully!" };
        } catch (error) {
            setIsLoading(false);
            return { success: false, message: "Failed to save node." };
        }
    };

    const [state, formAction] = useActionState(saveNode, null);

    return (
        <div className="p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-lg sm:text-xl font-bold mb-4">Add New Node</h2>

                    <form className="w-full space-y-4" action={formAction}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Node Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter node name"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Area</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                name="areaId"
                                required
                            >
                                <option value="" disabled>Select an area</option>
                                {data.Area.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status message */}
                        {state && (
                            <div className={`alert ${state.success ? "alert-success" : "alert-error"} py-2`}>
                                <div className="flex items-center">
                                    {state.success ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <span>{state.message}</span>
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-6">
                            <button type="reset" className="btn btn-ghost">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Node"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}