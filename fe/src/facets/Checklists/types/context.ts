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
    data: ChecklistData | null;
    groups: Map<string | null, ChecklistGroupState>;
    setGroupExpanded: (itemId: string, expanded: boolean) => void;
    addOrUpdateItem: (item: ChecklistItemData) => void;
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

export const useChecklistReducer = () =>
    useReducer(checklistStateReducer, {
        isLoading: false,
        isUpdatingItem: false,
        data: null,
        groups: new Map(),
        setGroupExpanded: () => {
        },
        addOrUpdateItem: () => {
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
            }
            else {
                if (item.done) doneCount++;
                doableCount++;
            }
        });

        const group: ChecklistGroupState = {
            items: items || [],
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
