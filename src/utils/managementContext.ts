import { Area, Node } from "@prisma/client";
import { createContext, useContext } from "react";

export interface managementType {
    Node: Node[],
    Area: Area[]
}

export const ManagementContext = createContext<managementType | undefined>(undefined);

export const useManagementContext = ()=> {
    const data = useContext(ManagementContext);
    if (!data) throw new Error("useMangementContext must be use under managementContext");

    return data;
}