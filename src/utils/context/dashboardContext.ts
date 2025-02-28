import { AreaWithNode } from "@/types/type";
import { createContext, useContext } from "react";

export const DashboardContext = createContext<AreaWithNode[] | undefined>(undefined);

export const useDashboardContext = ()=> {
    const data = useContext(DashboardContext);
    if (!data) throw new Error("useDashboardContext must be use under DashboardContext");

    return data;
}