import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {ChecklistContext, ChecklistState, ChecklistStateActionType, useChecklistReducer} from "../types/context";
import {ChecklistItemData} from "../types/schema";
import * as checklistApi from "../api";

export interface ChecklistProviderProps {
    checklistId?: string | number | null;
}

const ChecklistProvider: React.FC<PropsWithChildren<ChecklistProviderProps>> = ({checklistId = null, children}) => {
    const [state, dispatch] = useChecklistReducer();
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
    }, [isFetching, fetchResult, dispatch]);

    const {mutate: doUpdateItem} = useMutation({
        mutationKey: ["checklists/item/update", {checklistId}],
        mutationFn: checklistApi.addOrUpdateItem(apiClient, checklistId),
        onMutate: (data) => {
            dispatch({type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: data.id});
        },
        onSuccess: (data) => {
            queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
                if (!prev) return prev;
                let found = false;
                let items = prev.checklist.items.map((item) => {
                    if (item.id === data.checklistItem.id) {
                        found = true;
                        return data.checklistItem;
                    }
                    return item;
                });
                if (!found) items = [...items, data.checklistItem];
                return {
                    checklist: {
                        ...prev.checklist,
                        items
                    }
                };
            });
        },
        onSettled: () => {
            dispatch({type: ChecklistStateActionType.CLEAR_UPDATING_ITEM});
        }
    });

    if (fetchStatus === "error") {
        // TODO need universal way to redirect to resource error page
        throw new Error("Error loading checklist");
    }

    // TODO refetch on user logout / user change

    const context: ChecklistState = {
        ...state,
        isLoading: isFetching,
        setGroupExpanded: useCallback((itemId: string, expanded: boolean) =>
            dispatch({type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId, expanded}), [dispatch]),
        addOrUpdateItem: useCallback((updated: ChecklistItemData) =>
            doUpdateItem(updated), [doUpdateItem]),
    }

    return (
        <ChecklistContext.Provider value={context}>
            {children}
        </ChecklistContext.Provider>
    );
}

export default ChecklistProvider;
