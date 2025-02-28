"use client";

import { add_node } from "@/utils/add_node";
import { useManagementContext } from "@/utils/managementContext";
import { useActionState } from "react";

export default function NodeForm() {
    const data = useManagementContext();
    const saveNode = async (prevState: any, formData: FormData) => {
        const nodeName = formData.get("name") as string;
        const clientId = formData.get("clientId") as string;
        const token = formData.get("token") as string;
        const areaId = formData.get("areaId") as string;

        if (!nodeName || !clientId || !token || !areaId)
            return { success: false, message: "Fill all data" };
        
        // Simulating an API request (replace with actual API call)
        try {
            // Simulated API response
            await add_node(nodeName, clientId, token, parseInt(areaId));

            return { success: true, message: "Node saved successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to save node." };
        }
    };

    const [state, formAction] = useActionState(saveNode, null);

    return (
        <div className="card bg-base-100 shadow-xl p-6">
            <div className="card-body">
                <h2 className="card-title">Add New Node</h2>
                <form className="space-y-2" action={formAction}>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Node Name</span>
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Client ID</span>
                        </div>
                        <input
                            type="text"
                            name="clientId"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Token</span>
                        </div>
                        <input
                            type="text"
                            name="token"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Pick the best fantasy franchise</span>
                        </div>
                        <select className="select select-bordered" name="areaId">
                            <option aria-disabled>Pick one</option>
                            {data.Area.map((a)=> (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                        <div className="label">
                            <span className="label-text-alt">create area</span>
                        </div>
                    </label>
                    <div className="space-x-2">
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                        <button type="reset" className="btn btn-error btn-outline btn-sm">Cancel</button>
                    </div>
                </form>

                {/* Displaying response messages */}
                {state && (
                    <div className={`mt-4 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
                        {state.message}
                    </div>
                )}
            </div>
        </div>
    );
}
