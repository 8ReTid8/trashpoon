"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function delete_node(id: number) {
    console.log("id", id);
    try {
        if (!id) {
            throw new Error("Node ID is required.");
        }

        // Example: Using Prisma to delete a node
        await prisma.node.delete({
            where: { id },
        });

        // Revalidate cache to refresh UI
        revalidatePath("/management?tab=0"); // Adjust path to match your page

        return { success: true, message: "Node deleted successfully!" };
    } catch (error) {
        console.error("Error deleting node:", error);
        return { success: false, message: "Failed to delete node." };
    }
}
