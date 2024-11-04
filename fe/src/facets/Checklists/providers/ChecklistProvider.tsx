import React, {PropsWithChildren, useCallback, useEffect, useReducer} from "react";
import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {ChecklistContext, ChecklistGroupState, ChecklistState, initialChecklistState} from "../types/context";
import {ChecklistData, ChecklistItemData} from "../types/schema";
import * as checklistApi from "../api";

enum ChecklistStateActionType {
    SET_DATA,
    SET_GROUP_EXPANDED,
    SET_UPDATING_ITEM,
    CLEAR_UPDATING_ITEM,
}

type ChecklistStateAction =
    | { type: ChecklistStateActionType.SET_DATA, data: ChecklistData | null, isLoading: boolean }
    | { type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId: string, expanded: boolean }
    | { type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: string }
    | { type: ChecklistStateActionType.CLEAR_UPDATING_ITEM }
    ;

export interface ChecklistProviderProps {
    checklistId?: string | number | null;
}

const ChecklistProvider: React.FC<PropsWithChildren<ChecklistProviderProps>> = ({checklistId = null, children}) => {
    const [state, dispatch] = useReducer(checklistStateReducer, initialChecklistState);
    const queryClient = useQueryClient();
    const apiClient = useApiClient();

    const fetchOpts = queryOptions({
        queryKey: ["checklists/checklist", {checklistId}],
        queryFn: checklistApi.fetchChecklist(apiClient, checklistId),
        staleTime: 0,
    });

    const {isFetching, status: fetchStatus, data: fetchResult} = useQuery(fetchOpts);
    useEffect(() => {
        dispatch({
            type: ChecklistStateActionType.SET_DATA,
            data: fetchResult?.checklist || null,
            isLoading: isFetching
        });
    }, [isFetching, fetchResult]);

    if (fetchStatus === "error") {
        // TODO need universal way to redirect to resource error page
        throw new Error("Error loading checklist");
    }

    const {mutate: doAddOrUpdateItem} = useMutation({
        mutationKey: ["checklists/updateItem", {checklistId}],
        mutationFn: checklistApi.addOrUpdateItem(apiClient, checklistId),
        onMutate: (data) => {
            dispatch({type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: data.id});
        },
        onSuccess: (data) => {
            queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
                return prev ? {
                    checklist: {
                        ...prev.checklist,
                        items: prev.checklist.items.map((item) =>
                            item.id === data.checklistItem.id ? data.checklistItem : item)
                    }
                } : prev;
            });
        },
        onSettled: () => {
            dispatch({type: ChecklistStateActionType.CLEAR_UPDATING_ITEM});
        }
    });

    // TODO refetch on user logout / user change

    const context: ChecklistState = {
        ...state,
        isLoading: isFetching,
        setGroupExpanded: useCallback((itemId: string, expanded: boolean) =>
            dispatch({type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId, expanded}), [dispatch]),
        addOrUpdateItem: useCallback((updated: ChecklistItemData) =>
            doAddOrUpdateItem(updated), [doAddOrUpdateItem]),
    }

    return (
        <ChecklistContext.Provider value={context}>
            {children}
        </ChecklistContext.Provider>
    );
}

export default ChecklistProvider;

// Private

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
