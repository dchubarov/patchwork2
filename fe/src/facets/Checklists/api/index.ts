import {AxiosInstance} from "axios";
import {
    ChecklistItemData, ChecklistItemResponseData, checklistItemResponseSchema,
    ChecklistResponseData,
    checklistResponseSchema,
    checklistTemplateResponse
} from "../types/schema";

export const fetchChecklist = (client: AxiosInstance, checklistId: string | number | null) =>
    async (): Promise<ChecklistResponseData> => (checklistId === null ?
        Promise.resolve(checklistTemplateResponse) :
        client.get(`x/checklists/v2/checklist/${checklistId}`)
            .then(response => checklistResponseSchema.parse(response.data)));

export const addOrUpdateItem = (client: AxiosInstance, checklistId: string | number | null) =>
    async (updated: ChecklistItemData): Promise<ChecklistItemResponseData> =>
        client.request({
            url: `x/checklists/v2/checklist/${checklistId}/item`,
            method: updated.id === null ? "POST" : "PUT",
            data: {checklistItem: updated}
        }).then(response => checklistItemResponseSchema.parse(response.data));
