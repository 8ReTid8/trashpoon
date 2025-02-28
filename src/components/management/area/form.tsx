"use client";

import { add_area } from "@/utils/add_area";
import { useActionState } from "react";
import { useState } from "react";

export default function AreaForm() {
    const [state, setState] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const saveArea = async (formData: FormData) => {
        const areaName = formData.get("name") as string;

        // Input Validation
        if (!areaName) {
            setState({ success: false, message: "Area name is required." });
            return;
        }

        try {
            // Call to your API function for adding the area
            const response = await add_area(areaName);
            
            if (response.success) {
                setState({ success: true, message: "Area saved successfully!" });
            } else {
                setState({ success: false, message: "Failed to save area." });
            }
        } catch (error) {
            console.error("Error saving area:", error);
            setState({ success: false, message: "An error occurred while saving the area." });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        saveArea(formData);
    };

    return (
        <div className="card bg-base-100 shadow-xl p-6">
            <div className="card-body">
                <h2 className="card-title">Add New Area</h2>
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Area Name</span>
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
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
