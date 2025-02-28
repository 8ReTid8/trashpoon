"use server"

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function add_area(name: string) {
    try {
        const newArea = await prisma.area.create({
            data: {
                name,
            },
        });
        
        revalidatePath("/management?tab=1");
        return { success: true, message: "Area added successfully!", area: newArea };
    } catch (error) {
        console.error("Error adding area:", error);
        return { success: false, message: "Failed to add area." };
    }
}
