import {createContext} from "react";
import {ChecklistData} from "@/facets/Checklists/types/schema";

export interface ChecklistState {
    data: ChecklistData | null;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);
