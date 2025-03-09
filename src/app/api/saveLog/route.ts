"use server"

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json()

    const node = await prisma.node.findFirst({
        where: {
            name: data.deviceName
        }
    })

    if (!node) 
        return NextResponse.json({ message: "wow" }, { status: 500 })

    await prisma.log.create({
        data: {
            timestamp: new Date(),
            capacity: data.capacity,
            status: data.status,
            node_id: node.id
        }
    })

    return NextResponse.json({ message: "wow" }, { status: 200 })
}