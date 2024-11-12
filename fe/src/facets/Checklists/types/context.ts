import {createContext} from "react";
import {ChecklistData, ChecklistItemData} from "./schema";

export interface ChecklistGroupState {
    items: ChecklistItemData[];
    doableCount: number;
    doneCount: number;
    expanded: boolean;
}

export interface ChecklistState {
    isLoading?: boolean;
    isUpdatingItem?: boolean;
    updatingItemId?: string | null;
    targetItemId?: string | null;
    data: ChecklistData | null;
    groups: Map<string | null, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
    setTargetItem: (itemId: string | null) => void;
    updateItem: (item: ChecklistItemData) => void;
    deleteItem: (itemId: string) => void;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);
