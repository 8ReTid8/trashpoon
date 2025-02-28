"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function add_node(name: string, clientId: string, token: string, areaId: number) {
    try {
        // Ensure data is valid before interacting with the database
        if (!name || !clientId || !token || !areaId) {
            throw new Error("All fields are required.");
        }

        // Create the new node in the database
        const newNode = await prisma.node.create({
            data: {
                name,
                client: clientId,
                token,
                areaId,
            },
        });

        // Trigger revalidation after adding a new node
        revalidatePath("/management?tab=0");  // Adjust the path as needed (e.g., the page that lists all nodes)

        // Return a success response
        return { success: true, message: "Node added successfully!" };
    } catch (error) {
        // Handle any errors that occur during node creation
        console.error("Error adding node:", error);
        return { success: false, message: "Failed to add node." };
    }
}
