import {AxiosInstance} from "axios";
import {ChecklistResponseData, checklistResponseSchema, checklistTemplateResponse} from "../types/schema";

export const fetchChecklistRequest = (client: AxiosInstance, checklistId: string | number | null) =>
    async (): Promise<ChecklistResponseData> => (checklistId === null ?
        Promise.resolve(checklistTemplateResponse) :
        client.get(`x/checklists/v2/checklist/${checklistId}`)
            .then(response => checklistResponseSchema.parse(response.data)));
