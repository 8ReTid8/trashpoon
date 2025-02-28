"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function delete_area(areaId: number) {
    try {
        // Check if any nodes are associated with this area
        const areaWithNodes = await prisma.area.findUnique({
            where: { id: areaId },
            include: { Node: true },  // Include the associated nodes
        });

        // If there are associated nodes, return a message preventing deletion
        if (areaWithNodes && areaWithNodes.Node.length > 0) {
            return {
                success: false,
                message: "This area cannot be deleted because it is associated with nodes. Please update or move the nodes before deleting the area.",
            };
        }

        // Proceed to delete the area if no nodes are associated
        await prisma.area.delete({
            where: { id: areaId },
        });
        revalidatePath("/management?tab=1");
        // Return success message if deletion is successful
        return { success: true, message: "Area deleted successfully!" };
    } catch (error) {
        console.error("Error deleting area:", error);
        return { success: false, message: "An error occurred while deleting the area." };
    }
}
