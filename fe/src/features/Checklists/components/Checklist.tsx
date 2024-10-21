import React from "react";
import {QueryKey, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ChecklistsEndpoints} from "../api";
import {Stack} from "@mui/joy";
import ChecklistItem from "./ChecklistItem";
import {ChecklistItemState} from "../types";

interface ChecklistProps {
    checklistName?: string;
}

const Checklist: React.FC<ChecklistProps> = ({checklistName = "default"}) => {
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ["checklist", checklistName];

    const fetchItemsQuery = useQuery({
        queryKey,
        queryFn: ChecklistsEndpoints.fetchChecklistItems(checklistName),
    });

    const addItemMutation = useMutation({
        mutationFn: ChecklistsEndpoints.addChecklistItem(checklistName),
        onSuccess: (addedItem) => {
            queryClient.setQueryData<ChecklistItemState[]>(
                queryKey,
                (prev) =>
                    Array.isArray(prev) ? [addedItem, ...prev] : [addedItem]);

            queryClient.invalidateQueries({queryKey: ["availableChecklists"]}).then();
        }
    });

    const updateItemMutation = useMutation({
        mutationFn: ChecklistsEndpoints.updateChecklistItem(checklistName),
        onSuccess: (updatedItem) => {
            queryClient.setQueryData<ChecklistItemState[]>(
                queryKey,
                (prev) => Array.isArray(prev) ?
                    prev.map((item) => item.id === updatedItem.id ? updatedItem : item) :
                    prev);
        }
    });

    const deleteItemMutation = useMutation({
        mutationFn: ChecklistsEndpoints.deleteChecklistItem(checklistName),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<ChecklistItemState[]>(
                queryKey,
                (prev) => Array.isArray(prev) ?
                    prev.filter((item) => item.id !== variables) :
                    prev);
        }
    });

    return (
        <Stack gap={1}>
            <ChecklistItem
                defaultEdit
                placeholder="Click here to add a new item"
                busy={addItemMutation.isPending}
                onUpdate={(addedItem) => addItemMutation.mutate(addedItem)}/>

            {fetchItemsQuery.isSuccess && fetchItemsQuery.data.map(item => (
                <ChecklistItem
                    key={item.id}
                    checklistItem={item}
                    placeholder="No content"
                    busy={(updateItemMutation.isPending && updateItemMutation.variables.id === item.id) ||
                        (deleteItemMutation.isPending && deleteItemMutation.variables === item.id)}
                    onUpdate={(updatedItem) => updatedItem.note !== "" ?
                        updateItemMutation.mutate(updatedItem) :
                        deleteItemMutation.mutate(item.id)}/>
            ))}
        </Stack>
    );
}

export default Checklist;
