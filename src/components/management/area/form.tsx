"use client";

import { add_area } from "@/utils/add_area";
import { useState } from "react";

export default function AreaForm() {
    const [state, setState] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const saveArea = async (formData: FormData) => {
        const areaName = formData.get("name") as string;
        
        // Input Validation
        if (!areaName) {
            setState({ success: false, message: "Area name is required." });
            return;
        }

        setIsLoading(true);

        try {
            // Call to your API function for adding the area
            const response = await add_area(areaName);
           
            if (response.success) {
                setState({ success: true, message: "Area saved successfully!" });
                // Reset the form on success
                const form = document.getElementById("areaForm") as HTMLFormElement;
                if (form) form.reset();
            } else {
                setState({ success: false, message: response.message || "Failed to save area." });
            }
        } catch (error) {
            console.error("Error saving area:", error);
            setState({ success: false, message: "An error occurred while saving the area." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        saveArea(formData);
    };

    return (
        <div className="p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Add New Area</h2>
                    
                    <form id="areaForm" className="space-y-4" onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Area Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter area name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        
                        <div className="flex gap-2 justify-end mt-4">
                            <button 
                                type="reset" 
                                className="btn btn-outline"
                                onClick={() => setState(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Area'}
                            </button>
                        </div>
                    </form>
                    
                    {/* Displaying response messages using DaisyUI alert */}
                    {state && (
                        <div className={`alert ${state.success ? 'alert-success' : 'alert-error'} mt-4`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={state.success ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                            </svg>
                            <span>{state.message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}