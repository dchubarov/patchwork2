import { AxiosInstance } from 'axios';
import {
  allChecklistsResponseSchema,
  ChecklistItemData,
  ChecklistItemResponseData,
  checklistItemResponseSchema,
  ChecklistResponseData,
  checklistResponseSchema,
  checklistTemplateResponse,
} from '../types/schema';
import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchAllChecklists =
  (client: AxiosInstance) =>
  async ({ signal }: QueryFunctionContext) =>
    client
      .get(`x/checklists/v2/checklist`, { signal })
      .then((response) => allChecklistsResponseSchema.parse(response.data));

export const fetchChecklist =
  (client: AxiosInstance, checklistId: string | number | null) =>
  async ({ signal }: QueryFunctionContext): Promise<ChecklistResponseData> =>
    checklistId === null
      ? Promise.resolve(checklistTemplateResponse)
      : client
          .get(`x/checklists/v2/checklist/${checklistId}`, { signal })
          .then((response) => checklistResponseSchema.parse(response.data));

export const addOrUpdateItem =
  (client: AxiosInstance, checklistId: string | number | null) =>
  async (updated: ChecklistItemData): Promise<ChecklistItemResponseData> =>
    client
      .request({
        url: `x/checklists/v2/checklist/${checklistId}/item`,
        method: updated.id === '' ? 'POST' : 'PUT',
        data: { checklistItem: updated },
      })
      .then((response) => checklistItemResponseSchema.parse(response.data));

export const deleteItem =
  (client: AxiosInstance, checklistId: string | number | null) =>
  async (checklistItemId: string) =>
    client.delete(
      `x/checklists/v2/checklist/${checklistId}/item/${checklistItemId}`
    );
