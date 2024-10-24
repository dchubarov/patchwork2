import {AvailableChecklistsResponse, ChecklistItemResponse, ChecklistItemsResponse, ChecklistItemState} from "../types";
import {QueryFunctionContext} from "@tanstack/react-query";
import {apiExtensionUrl} from "../../../lib/apiClient";
import {AxiosInstance} from "axios";

const basename = apiExtensionUrl("checklists", "v1");

export const ChecklistsApi = {
    fetchChecklistNames: (apiClient: AxiosInstance) =>
        async ({signal}: QueryFunctionContext) => apiClient
            .get<AvailableChecklistsResponse>(basename, {signal})
            .then(response => response.data.availableChecklists),

    fetchChecklistItems: (apiClient: AxiosInstance, checklistName: string) =>
        async ({signal}: QueryFunctionContext) => apiClient
            .get<ChecklistItemsResponse>(`${basename}/checklist/${checklistName}`, {signal})
            .then(response => response.data.checklistItems),

    addChecklistItem: (apiClient: AxiosInstance, checklistName: string) =>
        async (addedItem: ChecklistItemState) => apiClient
            .post<ChecklistItemResponse>(`${basename}/checklist/${checklistName}`, addedItem)
            .then(response => response.data.checklistItem),

    updateChecklistItem: (apiClient: AxiosInstance, checklistName: string) =>
        async (updatedItem: ChecklistItemState) => apiClient
            .put<ChecklistItemResponse>(`${basename}/checklist/${checklistName}`, updatedItem)
            .then(response => response.data.checklistItem),

    deleteChecklistItem: (apiClient: AxiosInstance, checklistName: string) =>
        async (deletedItemId?: number) => apiClient
            .delete<ChecklistItemResponse>(`${basename}/checklist/${checklistName}?id=${deletedItemId}`)
            .then(response => response.data.checklistItem),
}
