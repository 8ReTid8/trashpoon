"use server"

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json()
    const {capacity,status,deviceName} = data
    console.log(capacity)
    console.log(status)
    console.log(deviceName)


    const node = await prisma.node.findFirst({
        where: {
            name: deviceName
        }
    })

    if (!node) 
        return NextResponse.json({ message: "wow" }, { status: 400 })
    console.log(node.id)
    await prisma.log.create({
        data: {
            timestamp: new Date(),
            capacity: parseInt(capacity),
            status: status,
            node_id: node.id
        }
        // data: {
        //     timestamp: new Date(),
        //     capacity: 1,
        //     status: 1,
        //     node_id: node.id
        // }
    })

    return NextResponse.json({ message: "wow" }, { status: 200 })
}