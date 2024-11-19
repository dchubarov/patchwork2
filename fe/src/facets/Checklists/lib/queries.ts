import React from 'react';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiClient } from '@/hooks';
import * as Api from './api';
import { ChecklistStateAction, ChecklistStateActionType } from './context';
import { showNotification } from '@/utils/notification';
import { ChecklistResponseData, checklistTemplateResponse } from './schema';
import * as checklistApi from './api';

const baseChecklistsQueryKey: QueryKey = ['checklists'];

export const allChecklistsQueryKey: QueryKey = [
  ...baseChecklistsQueryKey,
  'all',
];

export const checklistQueryKey = (
  checklistId: string | number | null
): QueryKey => [...baseChecklistsQueryKey, 'checklist', { checklistId }];

export const useAllChecklistsQuery = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: allChecklistsQueryKey,
    queryFn: checklistApi.fetchAllChecklists(apiClient),
  });
};

export const useChecklistQuery = (checklistId: string | number | null) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: checklistQueryKey(checklistId),
    queryFn: Api.fetchChecklist(apiClient, checklistId),
    placeholderData: checklistTemplateResponse,
    enabled: !!checklistId,
  });
};

export const useUpdateChecklistMutation = (
  dispatch: React.Dispatch<ChecklistStateAction>,
  onMaterialize?: (checklistId: string) => void
) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: Api.addOrUpdateChecklist(apiClient),
    onSuccess: ({ checklist: receivedData }, mutationData) => {
      if (!receivedData.id) throw new Error('Unexpected null id received');
      if (mutationData.id == null) {
        queryClient.setQueryData<ChecklistResponseData>(
          checklistQueryKey(receivedData.id),
          (prev) => {
            if (prev)
              throw new Error(
                `Cached data is available for newly created checklist ${receivedData.id}`
              );
            return {
              checklist: receivedData,
            };
          }
        );
        onMaterialize?.(receivedData.id);
      }

      queryClient
        .invalidateQueries({ queryKey: allChecklistsQueryKey })
        .catch();
    },
  });
};

export const useUpdateChecklistItemMutation = (
  checklistId: string | number | null,
  dispatch: React.Dispatch<ChecklistStateAction>
) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: Api.addOrUpdateItem(apiClient, checklistId),
    onMutate: (mutationData) => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: mutationData.id,
      });
    },
    onSuccess: ({ checklistItem: receivedData }, _mutationData) => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: receivedData.id,
      });

      queryClient.setQueryData<ChecklistResponseData>(
        checklistQueryKey(checklistId),
        (prev) => {
          if (!prev) return prev;
          let found = false;
          let items = prev.checklist.items.map((item) => {
            if (item.id === receivedData.id) {
              found = true;
              return receivedData;
            }
            return item;
          });
          if (!found) items = [...items, receivedData];
          return {
            checklist: {
              ...prev.checklist,
              items,
            },
          };
        }
      );

      queryClient
        .invalidateQueries({ queryKey: allChecklistsQueryKey })
        .catch();
    },
    onError: (error, mutationData) => {
      showNotification(
        mutationData.id === ''
          ? 'Failed to add item'
          : `Failed to update item #${mutationData.id}`,
        { subtitle: error.message, type: 'error' }
      );

      queryClient.setQueryData<ChecklistResponseData>(
        checklistQueryKey(checklistId),
        (prev) => {
          if (!prev) return prev;
          return {
            checklist: {
              ...prev.checklist,
              items: prev.checklist.items.map((item) =>
                item.id === mutationData.id ? { ...item } : item
              ),
            },
          };
        }
      );

      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: null,
      });
    },
  });
};

export const useDeleteChecklistItemMutation = (
  checklistId: string | number | null,
  dispatch: React.Dispatch<ChecklistStateAction>
) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: Api.deleteItem(apiClient, checklistId),
    onMutate: (toDeleteId) => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: toDeleteId,
      });
    },
    onSuccess: (_, toDeleteId) => {
      queryClient.setQueryData<ChecklistResponseData>(
        checklistQueryKey(checklistId),
        (prev) => {
          if (!prev) return prev;
          return {
            checklist: {
              ...prev.checklist,
              items: prev.checklist.items.filter(
                (item) => item.id !== toDeleteId
              ),
            },
          };
        }
      );
      queryClient
        .invalidateQueries({ queryKey: allChecklistsQueryKey })
        .catch();
    },
    onError: (error, toDeleteId) => {
      showNotification(`Failed to delete item #${toDeleteId}`, {
        subtitle: error.message,
        type: 'error',
      });
    },
    onSettled: () => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: null,
      });
    },
  });
};
