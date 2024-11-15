import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { showNotification } from '@/utils/notification';
import { useApiClient } from '@/hooks';
import {
  ChecklistContext,
  ChecklistGroupState,
  ChecklistState,
} from '../types/context';
import { ChecklistData, ChecklistItemData } from '../types/schema';
import * as checklistApi from '../api';

enum ChecklistStateActionType {
  SET_DATA,
  SET_GROUP_EXPANDED,
  SET_UPDATING_ITEM,
  SET_TARGET_ITEM,
}

type ChecklistStateAction =
  | {
      type: ChecklistStateActionType.SET_DATA;
      data: ChecklistData | null;
      isLoading: boolean;
    }
  | {
      type: ChecklistStateActionType.SET_GROUP_EXPANDED;
      itemId: string;
      expanded: boolean;
    }
  | { type: ChecklistStateActionType.SET_UPDATING_ITEM; itemId: string | null }
  | {
      type: ChecklistStateActionType.SET_TARGET_ITEM;
      item: ChecklistItemData | null;
    };

export interface ChecklistProviderProps {
  checklistId?: string | number | null;
}

const ChecklistProvider: React.FC<
  PropsWithChildren<ChecklistProviderProps>
> = ({ checklistId = null, children }) => {
  const [state, dispatch] = useReducer(checklistReducer, initialState);
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const fetchOpts = queryOptions({
    queryKey: ['checklists/checklist', { checklistId }],
    queryFn: checklistApi.fetchChecklist(apiClient, checklistId),
    staleTime: 0,
  });

  const {
    isFetching,
    status: fetchStatus,
    data: fetchResult,
  } = useQuery(fetchOpts);
  useEffect(() => {
    dispatch({
      type: ChecklistStateActionType.SET_DATA,
      data: fetchResult?.checklist || null,
      isLoading: isFetching,
    });
  }, [isFetching, fetchResult, dispatch]);

  const { mutate: doUpdateItem } = useMutation({
    mutationKey: ['checklists/item/update', { checklistId }],
    mutationFn: checklistApi.addOrUpdateItem(apiClient, checklistId),
    onMutate: (data) => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: data.id,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
        if (!prev) return prev;
        let found = false;
        let items = prev.checklist.items.map((item) => {
          if (item.id === data.checklistItem.id) {
            found = true;
            return data.checklistItem;
          }
          return item;
        });
        if (!found) items = [...items, data.checklistItem];
        return {
          checklist: {
            ...prev.checklist,
            items,
          },
        };
      });
    },
    onError: (error, data: ChecklistItemData) => {
      showNotification(
        data.id === ''
          ? 'Failed to add checklist item'
          : `Failed to update checklist item #${data.id}`,
        {
          type: 'error',
          subtitle: error.message,
        }
      );

      // refresh item so re-render happens
      queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
        if (!prev) return prev;
        return {
          checklist: {
            ...prev.checklist,
            items: prev.checklist.items.map((item) =>
              item.id === data.id ? { ...item } : item
            ),
          },
        };
      });
    },
    onSettled: () => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: null,
      });
    },
  });

  const { mutate: doDeleteItem } = useMutation({
    mutationKey: ['checklists/item/delete', { checklistId }],
    mutationFn: checklistApi.deleteItem(apiClient, checklistId),
    onMutate: (deleteItemId) => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: deleteItemId,
      });
    },
    onSuccess: (_, deletedItemId) => {
      queryClient.setQueryData(fetchOpts.queryKey, (prev) => {
        if (!prev) return prev;
        return {
          checklist: {
            ...prev.checklist,
            items: prev.checklist.items.filter(
              (item) => item.id !== deletedItemId
            ),
          },
        };
      });
    },
    onError: (error, deleteItemId) => {
      showNotification(`Failed to delete checklist item #${deleteItemId}`, {
        type: 'error',
        subtitle: error.message,
      });
    },
    onSettled: () => {
      dispatch({
        type: ChecklistStateActionType.SET_UPDATING_ITEM,
        itemId: null,
      });
    },
  });

  if (fetchStatus === 'error') {
    // TODO need universal way to redirect to resource error page
    throw new Error('Error loading checklist');
  }

  // TODO refetch on user logout / user change

  const context: ChecklistState = {
    ...state,
    isLoading: isFetching,
    setGroupExpanded: useCallback(
      (itemId, expanded) =>
        dispatch({
          type: ChecklistStateActionType.SET_GROUP_EXPANDED,
          itemId,
          expanded,
        }),
      [dispatch]
    ),
    setTargetItem: useCallback(
      (item) =>
        dispatch({ type: ChecklistStateActionType.SET_TARGET_ITEM, item }),
      [dispatch]
    ),
    updateItem: useCallback((updated) => doUpdateItem(updated), [doUpdateItem]),
    deleteItem: useCallback((itemId) => doDeleteItem(itemId), [doDeleteItem]),
  };

  return (
    <ChecklistContext.Provider value={context}>
      {children}
    </ChecklistContext.Provider>
  );
};

export default ChecklistProvider;

// Private

const initialState: ChecklistState = {
  isLoading: false,
  isUpdatingItem: false,
  targetItem: null,
  data: null,
  groups: new Map(),
  setGroupExpanded: () => {},
  setTargetItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
};

function checklistReducer(
  state: ChecklistState,
  action: ChecklistStateAction
): ChecklistState {
  switch (action.type) {
    case ChecklistStateActionType.SET_DATA:
      const groups = rebuildGroups(action.data, state);
      return {
        ...state,
        data: action.data,
        isLoading: action.isLoading,
        targetItem: groups.get(null)?.targetWithin ? state.targetItem : null,
        groups,
      };

    case ChecklistStateActionType.SET_GROUP_EXPANDED:
      const group = state.groups.get(action.itemId);
      if (!group || group.expanded === action.expanded) break;
      return {
        ...state,
        groups: new Map(state.groups).set(action.itemId, {
          ...group,
          expanded: action.expanded,
        }),
      };

    case ChecklistStateActionType.SET_UPDATING_ITEM:
      return {
        ...state,
        isUpdatingItem: true,
        updatingItemId: action.itemId ?? null,
      };

    case ChecklistStateActionType.SET_TARGET_ITEM:
      return {
        ...state,
        groups: rebuildGroups(state.data, {
          ...state,
          targetItem: action.item,
        }),
        targetItem: action.item,
      };
  }

  return state;
}

function rebuildGroups(
  data: ChecklistData | null,
  state: ChecklistState
): Map<string | null, ChecklistGroupState> {
  const groups = new Map<string | null, ChecklistGroupState>();
  if (!data) return groups;

  const roots = data.items.reduce((acc, item) => {
    const items = acc.get(item.parent);
    return acc.set(
      item.parent,
      Array.isArray(items) ? [...items, item] : [item]
    );
  }, new Map<string | null, ChecklistItemData[]>());

  const visited = new Set<string | null>();

  function dfs(id: string | null): ChecklistGroupState | undefined {
    if (visited.has(id)) return;
    visited.add(id);

    let doableCount = 0,
      doneCount = 0,
      targetWithin = id === state.targetItem?.id;

    const items = roots.get(id);
    items?.forEach((item) => {
      if (roots.has(item.id)) {
        const childGroup = dfs(item.id);
        if (childGroup) {
          if (childGroup.targetWithin) targetWithin = true;
          doneCount += childGroup.doneCount;
          doableCount += childGroup.doableCount;
        }
      } else {
        if (item.id === state.targetItem?.id) targetWithin = true;
        if (item.done) doneCount++;
        doableCount++;
      }
    });

    const group: ChecklistGroupState = {
      items: items?.sort((a, b) => a.sequenceCode - b.sequenceCode) ?? [],
      expanded: state.groups.get(id)?.expanded ?? true,
      targetWithin,
      doableCount,
      doneCount,
    };

    groups.set(id, group);
    return group;
  }

  dfs(null);
  return groups;
}
