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

export enum ChecklistStateActionType {
    SET_DATA,
    SET_GROUP_EXPANDED,
    SET_UPDATING_ITEM,
    CLEAR_UPDATING_ITEM,
}

export type ChecklistStateAction =
    | { type: ChecklistStateActionType.SET_DATA, data: ChecklistData | null, isLoading: boolean }
    | { type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId: string, expanded: boolean }
    | { type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: string }
    | { type: ChecklistStateActionType.CLEAR_UPDATING_ITEM }
    ;

export function checklistStateReducer(state: ChecklistState, action: ChecklistStateAction): ChecklistState {
    switch (action.type) {
        case ChecklistStateActionType.SET_DATA:
            return {
                ...state,
                data: action.data,
                isLoading: action.isLoading,
                groups: rebuildGroups(action.data, state.groups),
            };

        case ChecklistStateActionType.SET_GROUP_EXPANDED:
            const group = state.groups.get(action.itemId);
            if (!group || group.expanded === action.expanded) break;
            return {
                ...state,
                groups: new Map(state.groups).set(action.itemId, {...group, expanded: action.expanded}),
            }

        case ChecklistStateActionType.SET_UPDATING_ITEM:
            return {
                ...state,
                isUpdatingItem: true,
                updatingItemId: action.itemId
            }

        case ChecklistStateActionType.CLEAR_UPDATING_ITEM:
            return {
                ...state,
                isUpdatingItem: false,
                updatingItemId: undefined,
            }
    }

    return state;
}

function rebuildGroups(
    data: ChecklistData | null,
    currentGroups: Map<string | null, ChecklistGroupState>
): Map<string | null, ChecklistGroupState> {
    const groups = new Map<string | null, ChecklistGroupState>();
    if (!data) {
        return groups;
    }

    data.items.forEach((item) => {
        const groupId = item.parent || null;
        const currentGroup = currentGroups.get(groupId);
        const group: ChecklistGroupState = groups.get(groupId) || {
            expanded: currentGroup?.expanded ?? true,
            doneCount: 0,
            items: [],
        }

        group.items.push(item);

        if (item.subitems.length === 0) {
            if (item.done) ++group.doneCount;
        }

        groups.set(groupId, group);
    });

    return groups;
}
