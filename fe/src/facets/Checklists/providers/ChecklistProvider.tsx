import React, {PropsWithChildren, useEffect, useReducer} from "react";
import {queryOptions, useQuery} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {ChecklistContext, ChecklistGroupState, ChecklistState} from "../types/context";
import {ChecklistData, ChecklistItemData} from "../types/schema";
import * as checklistApi from "../api";

enum ChecklistStateActionType {
    SET_DATA,
    SET_GROUP_EXPANDED,
}

type ChecklistStateAction =
    | { type: ChecklistStateActionType.SET_DATA, data: ChecklistData | null, isLoading: boolean }
    | { type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId: string, expanded: boolean }
    ;

export interface ChecklistProviderProps {
    checklistId?: string | number | null;
}

const ChecklistProvider: React.FC<PropsWithChildren<ChecklistProviderProps>> = ({checklistId = null, children}) => {
    const apiClient = useApiClient();

    const fetchOpts = queryOptions({
        queryKey: ["x/checklists/checklist", {checklistId}],
        queryFn: checklistApi.fetchChecklistRequest(apiClient, checklistId),
        staleTime: 0,
    });

    const [context, dispatch] = useReducer(checklistStateReducer, null, (): ChecklistState => ({
        data: null,
        groups: new Map(),
        setGroupExpanded: (itemId: string, expanded: boolean) =>
            dispatch({type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId, expanded}),
        updateItem: (_: ChecklistItemData) => {},
    }));

    const {isFetching, status: fetchStatus, data: fetchResult} = useQuery(fetchOpts);
    useEffect(() => {
        dispatch({
            type: ChecklistStateActionType.SET_DATA,
            data: fetchResult?.checklist || null,
            isLoading: isFetching
        });
    }, [isFetching, fetchResult]);

    // TODO refetch on user logout / user change

    if (fetchStatus === "error") {
        // TODO need universal way to redirect to resource error page
        throw new Error("Error loading checklist");
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
            expanded: currentGroup?.expanded || true,
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
