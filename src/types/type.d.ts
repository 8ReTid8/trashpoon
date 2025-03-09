import { Prisma } from "@prisma/client"

export type AreaWithNode = Prisma.AreaGetPayload<{
    include: { Node: true }
}>

export type AreaBinDashboard = {
    id: number;
    name: string;
    bins: {
        id: number;
        name: string;
        capacity: number;
        locked: boolean;
    }[]
}

export type LogWithNodeArea = Prisma.LogGetPayload<{
    include: { 
        node: {
            include: {
                area: true
            }
        }
    
    }
}>