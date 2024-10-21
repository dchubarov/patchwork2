import axios, {AxiosResponse} from "axios";
import {AvailableChecklistsResponse, ChecklistItemResponse, ChecklistItemsResponse, ChecklistItemState} from "../types";

export const ChecklistsEndpoints = {
    fetchChecklistNames: () =>
        async () => axios
            .get<AvailableChecklistsResponse>(`/api/x/checklists/v1`)
            .then(response => response.data.availableChecklists),

    fetchChecklistItems: (checklistName: string) =>
        async () => axios
            .get<ChecklistItemsResponse>(`/api/x/checklists/v1/checklist/${checklistName}`)
            .then(response => response.data.checklistItems),

    addChecklistItem: (checklistName: string) =>
        async (addedItem: ChecklistItemState) => axios
            .post<ChecklistItemResponse, AxiosResponse<ChecklistItemResponse>, ChecklistItemState>(`/api/x/checklists/v1/checklist/${checklistName}`, addedItem)
            .then(response => response.data.checklistItem),

    updateChecklistItem: (checklistName: string) =>
        async (updatedItem: ChecklistItemState) => axios
            .put<ChecklistItemResponse, AxiosResponse<ChecklistItemResponse>, ChecklistItemState>(`/api/x/checklists/v1/checklist/${checklistName}`, updatedItem)
            .then(response => response.data.checklistItem),

    deleteChecklistItem: (checklistName: string) =>
        async (deletedItemId?: number) => axios
            .delete<ChecklistItemResponse>(`/api/x/checklists/v1/checklist/${checklistName}?id=${deletedItemId}`)
            .then(response => response.data.checklistItem),
}
