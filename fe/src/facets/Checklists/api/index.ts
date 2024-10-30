import {AxiosInstance} from "axios";
import {ChecklistResponseData, checklistResponseSchema, checklistTemplateResponse} from "@/facets/Checklists/types";

export const fetchChecklistRequest = (client: AxiosInstance, checklistId: string | null) =>
    async (): Promise<ChecklistResponseData> => (checklistId === null ?
        Promise.resolve(checklistTemplateResponse) :
        client.get(`x/checklists/v2/checklist/${checklistId}`)
            .then(response => checklistResponseSchema.parse(response.data)));
