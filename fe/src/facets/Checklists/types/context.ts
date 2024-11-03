import {createContext} from "react";
import {ChecklistData, ChecklistItemData} from "./schema";

export interface ChecklistGroupState {
    items: ChecklistItemData[];
    doneCount: number;
    expanded: boolean;
}

export interface ChecklistState {
    isLoading?: boolean;
    data: ChecklistData | null;
    groups: Map<string | null, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
    updateItem: (item: ChecklistItemData) => void;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);
