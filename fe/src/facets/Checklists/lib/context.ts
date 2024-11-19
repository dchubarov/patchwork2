import { createContext, useContext, useReducer } from 'react';
import { ChecklistData, ChecklistItemData } from './schema';

export interface ChecklistGroupState {
  items: ChecklistItemData[];
  doableCount: number;
  doneCount: number;
  expanded: boolean;
  forceExpandParent?: boolean;
  targetWithin: boolean;
}

export interface ChecklistState {
  isFetching: boolean;
  isMutating: boolean;
  isUpdatingItem?: boolean;
  updatingItemId?: string | null;
  targetItem: ChecklistItemData | null;
  data: ChecklistData | null;
  groups: Map<string | null, ChecklistGroupState>;
  setGroupExpanded: (itemId: string, expanded: boolean) => void;
  setTargetItem: (item: ChecklistItemData | null) => void;
  updateChecklist: (data: ChecklistData) => void;
  updateItem: (item: ChecklistItemData) => void;
  deleteItem: (itemId: string) => void;
}

export const ChecklistContext = createContext<ChecklistState | null>(null);

export enum ChecklistStateActionType {
  SET_DATA,
  SET_GROUP_EXPANDED,
  SET_UPDATING_ITEM,
  SET_TARGET_ITEM,
}

export type ChecklistStateAction =
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

const initialState: ChecklistState = {
  isFetching: false,
  isMutating: false,
  isUpdatingItem: false,
  targetItem: null,
  data: null,
  groups: new Map(),
  setGroupExpanded: () => {},
  setTargetItem: () => {},
  updateChecklist: () => {},
  updateItem: () => {},
  deleteItem: () => {},
};

export const useChecklist = () => {
  const ctx = useContext(ChecklistContext);
  if (!ctx) {
    throw new Error('Checklist data is not available.');
  }
  return ctx;
};

export const useChecklistReducer = () =>
  useReducer(checklistReducer, initialState);

function checklistReducer(
  state: ChecklistState,
  action: ChecklistStateAction
): ChecklistState {
  switch (action.type) {
    case ChecklistStateActionType.SET_DATA:
      return {
        ...state,
        data: action.data,
        isFetching: action.isLoading,
        isUpdatingItem: false,
        updatingItemId: null,
        ...rebuildGroups(action.data, state),
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
        isUpdatingItem: action.itemId != null,
        updatingItemId: action.itemId,
      };

    case ChecklistStateActionType.SET_TARGET_ITEM:
      return {
        ...state,
        ...rebuildGroups(state.data, {
          ...state,
          targetItem: action.item,
        }),
      };
  }

  return state;
}

function rebuildGroups(
  data: ChecklistData | null,
  state: ChecklistState
): {
  groups: Map<string | null, ChecklistGroupState>;
  targetItem: ChecklistItemData | null;
} {
  const groups = new Map<string | null, ChecklistGroupState>();
  let targetItem: ChecklistItemData | null = null;
  if (!data) return { groups, targetItem };

  const roots = data.items.reduce((acc, item) => {
    const items = acc.get(item.parent);
    return acc.set(
      item.parent,
      Array.isArray(items) ? [...items, item] : [item]
    );
  }, new Map<string | null, ChecklistItemData[]>());

  const visited = new Set<string | null>();

  function dfs(id: string | null) {
    if (visited.has(id)) return;
    visited.add(id);

    let expanded = state.groups.get(id)?.expanded ?? true,
      forceExpandParent: boolean | undefined = undefined,
      targetWithin = id === state.targetItem?.id,
      doableCount = 0,
      doneCount = 0;

    const items = roots.get(id);
    items?.forEach((item) => {
      if (roots.has(item.id)) {
        const childGroup = dfs(item.id);
        if (childGroup) {
          if (childGroup.targetWithin) targetWithin = true;
          if (childGroup.forceExpandParent) {
            forceExpandParent = true;
            expanded = true;
          }
          doableCount += childGroup.doableCount;
          doneCount += childGroup.doneCount;
        }
      } else {
        if (item.id === state.targetItem?.id) targetWithin = true;
        if (item.id === state.updatingItemId) {
          forceExpandParent = true;
          expanded = true;
        }
        if (item.done) doneCount++;
        doableCount++;
      }
      if (item.id === state.targetItem?.id) {
        targetItem = item !== targetItem ? item : targetItem;
      }
    });

    const group: ChecklistGroupState = {
      items:
        items?.sort((a, b) =>
          data?.config?.reverseOrder
            ? b.sequenceCode - a.sequenceCode
            : a.sequenceCode - b.sequenceCode
        ) ?? [],
      expanded,
      forceExpandParent,
      targetWithin,
      doableCount,
      doneCount,
    };

    groups.set(id, group);
    return group;
  }

  dfs(null);
  return { groups, targetItem };
}
