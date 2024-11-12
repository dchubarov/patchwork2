import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {showNotification} from "@/utils/notification";
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
        onError: (error, data: ChecklistItemData) => {
            showNotification(`Failed to update checklist item #${data.id}`,
                {type: "error", subtitle: error.message});

            // refresh item so re-render happens
            queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
                if (!prev) return prev;
                return {
                    checklist: {
                        ...prev.checklist,
                        items: prev.checklist.items.map((item) =>
                            item.id === data.id ? {...item} : item),
                    }
                }
            });
        },
        onSettled: () => {
            dispatch({type: ChecklistStateActionType.CLEAR_UPDATING_ITEM});
        }
    });

    const {mutate: doDeleteItem} = useMutation({
        mutationKey: ["checklists/item/delete", {checklistId}],
        mutationFn: checklistApi.deleteItem(apiClient, checklistId),
        onMutate: (deleteItemId) => {
            dispatch({type: ChecklistStateActionType.SET_UPDATING_ITEM, itemId: deleteItemId});
        },
        onSuccess: (_, deletedItemId) => {
            queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
                if (!prev) return prev;
                return {
                    checklist: {
                        ...prev.checklist,
                        items: prev.checklist.items.filter((item) =>
                            item.id !== deletedItemId),
                    }
                }
            });
        },
        onError: (error, deleteItemId) => {
            showNotification(`Failed to delete checklist item #${deleteItemId}`,
                {type: "error", subtitle: error.message});
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
        setGroupExpanded: useCallback((itemId, expanded) =>
            dispatch({type: ChecklistStateActionType.SET_GROUP_EXPANDED, itemId, expanded}), [dispatch]),
        setTargetItem: useCallback((itemId) =>
            dispatch({type: ChecklistStateActionType.SET_TARGET_ITEM, itemId}), [dispatch]),
        updateItem: useCallback((updated) =>
            doUpdateItem(updated), [doUpdateItem]),
        deleteItem: useCallback((itemId) =>
            doDeleteItem(itemId), [doDeleteItem])
    }

    return (
        <ChecklistContext.Provider value={context}>
            {children}
        </ChecklistContext.Provider>
    );
}

export default ChecklistProvider;
