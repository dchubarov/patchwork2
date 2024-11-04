import {createContext} from "react";
import {ChecklistData, ChecklistItemData} from "./schema";

export interface ChecklistGroupState {
    items: ChecklistItemData[];
    doneCount: number;
    expanded: boolean;
}

export interface ChecklistState {
    isLoading?: boolean;
    isUpdatingItem?: boolean;
    updatingItemId?: string;
    data: ChecklistData | null;
    groups: Map<string | null, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
    addOrUpdateItem: (item: ChecklistItemData) => void;
}

export const initialChecklistState: ChecklistState = {
    isLoading: false,
    isUpdatingItem: false,
    data: null,
    groups: new Map(),
    setGroupExpanded: () => {},
    addOrUpdateItem: () => {},
}

export const ChecklistContext = createContext<ChecklistState | null>(null);
