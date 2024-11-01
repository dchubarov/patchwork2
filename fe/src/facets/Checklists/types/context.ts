import {createContext} from "react";
import {ChecklistData} from "../types/schema";

export interface ChecklistGroupState {
    expanded: boolean;
}

export interface ChecklistState {
    data: ChecklistData | null;
    groups: Map<string, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);
