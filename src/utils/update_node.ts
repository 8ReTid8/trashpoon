"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function update_node(id?: number, name?: string, clientId?: string, token?: string) {
    try {
        if (!id || !name || !clientId || !token) {
            throw new Error("All fields are required.");
        }

        // Example: Using Prisma to update the database
        await prisma.node.update({
            where: { id },
            data: {
                name,
                client: clientId,
                token
            },
        });

        // Revalidate cache to refresh UI
        revalidatePath("/management?tab=0"); // Adjust the path to match your page

        return { success: true, message: "Node updated successfully!" };
    } catch (error) {
        console.error("Error updating node:", error);
        return { success: false, message: "Failed to update node." };
    }
}
