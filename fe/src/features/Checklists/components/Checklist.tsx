import React from "react";
import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ChecklistsApi} from "../api";
import {Stack} from "@mui/joy";
import ChecklistItem from "./ChecklistItem";
import {useApiClient} from "../../../providers/EnvironmentProvider";

interface ChecklistProps {
    checklistName?: string;
}

const Checklist: React.FC<ChecklistProps> = ({checklistName = "default"}) => {
    const apiClient = useApiClient();
    const queryClient = useQueryClient();
    const opts = queryOptions({
        queryKey: ["x/checklists/v1/checklist", checklistName],
        queryFn: ChecklistsApi.fetchChecklistItems(apiClient, checklistName),
    });

    const fetchItemsQuery = useQuery(opts);

    const addItemMutation = useMutation({
        mutationFn: ChecklistsApi.addChecklistItem(apiClient, checklistName),
        onSuccess: (addedItem) => {
            queryClient.setQueryData(
                opts.queryKey,
                (prev) =>
                    Array.isArray(prev) ? [addedItem, ...prev] : [addedItem]);

            queryClient.invalidateQueries({queryKey: ["availableChecklists"]}).then();
        }
    });

    const updateItemMutation = useMutation({
        mutationFn: ChecklistsApi.updateChecklistItem(apiClient, checklistName),
        onSuccess: (updatedItem) => {
            queryClient.setQueryData(
                opts.queryKey,
                (prev) => Array.isArray(prev) ?
                    prev.map((item) => item.id === updatedItem.id ? updatedItem : item) :
                    prev);
        }
    });

    const deleteItemMutation = useMutation({
        mutationFn: ChecklistsApi.deleteChecklistItem(apiClient, checklistName),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(
                opts.queryKey,
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
