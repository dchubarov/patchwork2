import React, {PropsWithChildren, useEffect, useReducer} from "react";
import {useQuery} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {ChecklistContext, ChecklistGroupState, ChecklistState} from "../types/context";
import * as checklistApi from "../api";
import {ChecklistData} from "../types/schema";

enum ChecklistStateActionType {
    SET_DATA,
    SET_GROUP_EXPANDED,
}

type ChecklistStateAction =
    | { type: ChecklistStateActionType.SET_DATA, data: ChecklistData | null }
    | { type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId: string, expanded: boolean }
    ;

interface ChecklistProviderProps {
    checklistId: string | number | null;
}

const ChecklistProvider: React.FC<PropsWithChildren<ChecklistProviderProps>> = ({checklistId, children}) => {
    const [context, dispatch] = useReducer(checklistStateReducer, null, createInitialState);

    function createInitialState(): ChecklistState {
        return {
            data: null,
            groups: new Map(),
            setGroupExpanded: (itemId: string, expanded: boolean) =>
                dispatch({type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId, expanded})
        }
    }

    const apiClient = useApiClient();
    const {data: fetchResult} = useQuery({
        queryKey: ["x/checklists/checklist", {checklistId}],
        queryFn: checklistApi.fetchChecklistRequest(apiClient, checklistId),
        staleTime: Infinity
    });

    useEffect(() => {
        dispatch({type: ChecklistStateActionType.SET_DATA, data: fetchResult?.checklist || null});
    }, [fetchResult]);

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
            const groups = new Map<string, ChecklistGroupState>();
            if (action.data) {
                action.data.items.forEach(item => {
                    if (item.subitems.length > 0) {
                        groups.set(item.id, state.groups.get(item.id) || {expanded: true});
                    }
                });
            }
            return {
                ...state,
                data: action.data,
                groups
            };

        case ChecklistStateActionType.SET_GROUP_EXPANDED:
            const g = state.groups.get(action.itemId);
            if (!g || g.expanded === action.expanded) break;
            return {
                ...state,
                groups: new Map(state.groups).set(action.itemId, {...g, expanded: action.expanded}),
            }
    }

    return state;
}
