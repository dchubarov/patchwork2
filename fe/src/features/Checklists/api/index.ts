import {AvailableChecklistsResponse, ChecklistItemResponse, ChecklistItemsResponse, ChecklistItemState} from "../types";
import {QueryFunctionContext} from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";

const basename = "/x/checklists/v1";

export const ChecklistsEndpoints = {
    fetchChecklistNames: () =>
        async ({signal}: QueryFunctionContext) => apiClient
            .get<AvailableChecklistsResponse>(basename, {signal})
            .then(response => response.data.availableChecklists),

    fetchChecklistItems: (checklistName: string) =>
        async ({signal}: QueryFunctionContext) => apiClient
            .get<ChecklistItemsResponse>(`${basename}/checklist/${checklistName}`, {signal})
            .then(response => response.data.checklistItems),

    addChecklistItem: (checklistName: string) =>
        async (addedItem: ChecklistItemState) => apiClient
            .post<ChecklistItemResponse>(`${basename}/${checklistName}`, addedItem)
            .then(response => response.data.checklistItem),

    updateChecklistItem: (checklistName: string) =>
        async (updatedItem: ChecklistItemState) => apiClient
            .put<ChecklistItemResponse>(`${basename}/checklist/${checklistName}`, updatedItem)
            .then(response => response.data.checklistItem),

    deleteChecklistItem: (checklistName: string) =>
        async (deletedItemId?: number) => apiClient
            .delete<ChecklistItemResponse>(`${basename}/checklist/${checklistName}?id=${deletedItemId}`)
            .then(response => response.data.checklistItem),
}
