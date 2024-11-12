import {createContext, useReducer} from "react";
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
    updatingItemId?: string;
    targetItemId?: string | null;
    data: ChecklistData | null;
    groups: Map<string | null, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
    setTargetItem: (itemId: string | null) => void;
    updateItem: (item: ChecklistItemData) => void;
    deleteItem: (itemId: string) => void;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);

export enum ChecklistStateActionType {
    SET_DATA,
    SET_GROUP_EXPANDED,
    SET_UPDATING_ITEM,
    CLEAR_UPDATING_ITEM,
    SET_TARGET_ITEM,
}

export type ChecklistStateAction =
    | { type: ChecklistStateActionType.SET_DATA, data: ChecklistData | null, isLoading: boolean }
    | { type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId: string, expanded: boolean }
    | { type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: string }
    | { type: ChecklistStateActionType.CLEAR_UPDATING_ITEM }
    | { type: ChecklistStateActionType.SET_TARGET_ITEM, itemId?: string | null }
    ;

export const useChecklistReducer = () =>
    useReducer(checklistStateReducer, {
        isLoading: false,
        isUpdatingItem: false,
        targetItemId: null,
        data: null,
        groups: new Map(),
        setGroupExpanded: () => {
        },
        setTargetItem: () => {
        },
        updateItem: () => {
        },
        deleteItem: () => {
        },
    } as ChecklistState);

// Private: reducer logic

function checklistStateReducer(state: ChecklistState, action: ChecklistStateAction): ChecklistState {
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

        case ChecklistStateActionType.SET_TARGET_ITEM:
            return {
                ...state,
                targetItemId: action.itemId ?? null,
            }
    }

    return state;
}

function rebuildGroups(
    data: ChecklistData | null,
    currentGroups: Map<string | null, ChecklistGroupState>
): Map<string | null, ChecklistGroupState> {
    const groups = new Map<string | null, ChecklistGroupState>();
    if (!data) return groups;

    const roots = data.items.reduce(
        (acc, item) => {
            const items = acc.get(item.parent);
            return acc.set(item.parent, Array.isArray(items) ? [...items, item] : [item]);
        }, new Map<string | null, ChecklistItemData[]>());

    const visited = new Set<string | null>();

    function dfs(id: string | null): ChecklistGroupState | undefined {
        if (visited.has(id)) return;
        visited.add(id);

        let doableCount = 0, doneCount = 0;
        const items = roots.get(id);
        items?.forEach((item) => {
            if (roots.has(item.id)) {
                const childGroup = dfs(item.id);
                if (childGroup) {
                    doneCount += childGroup.doneCount;
                    doableCount += childGroup.doableCount;
                }
            } else {
                if (item.done) doneCount++;
                doableCount++;
            }
        });

        const group: ChecklistGroupState = {
            items: items?.sort((a, b) =>
                a.sequenceCode - b.sequenceCode) ?? [],
            doableCount: doableCount,
            doneCount: doneCount,
            expanded: currentGroups.get(id)?.expanded ?? true,
        }

        groups.set(id, group);
        return group;
    }

    dfs(null);
    return groups;
}
