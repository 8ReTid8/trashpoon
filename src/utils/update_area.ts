"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function update_area(id?: number, name?: string) {
    try {
        if (!id || !name) {
            throw new Error("All fields are required.");
        }

        // Example: Using Prisma to update the database
        await prisma.area.update({
            where: { id },
            data: {
                name,
            },
        });

        // Revalidate cache to refresh UI
        revalidatePath("/management?tab=1"); // Adjust the path to match your page

        return { success: true, message: "Area updated successfully!" };
    } catch (error) {
        console.error("Error updating area:", error);
        return { success: false, message: "Failed to update area." };
    }
}
