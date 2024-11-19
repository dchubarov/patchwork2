import React, { PropsWithChildren, useCallback, useEffect } from 'react';
import {
  ChecklistContext,
  ChecklistState,
  ChecklistStateActionType,
  useChecklistReducer,
} from '../lib/context';
import {
  useChecklistQuery,
  useDeleteChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useUpdateChecklistMutation,
} from '../lib/queries';

export interface ChecklistProviderProps {
  checklistId?: string | number | null;
  onMaterialize?: (checklistId: string) => void;
}

const ChecklistProvider: React.FC<
  PropsWithChildren<ChecklistProviderProps>
> = ({ checklistId = null, onMaterialize, children }) => {
  const [state, dispatch] = useChecklistReducer();

  const {
    isFetching,
    status: fetchStatus,
    data: fetchResult,
  } = useChecklistQuery(checklistId);

  const { mutate: doUpdateChecklist } =
    useUpdateChecklistMutation(onMaterialize);

  const { mutate: doUpdateItem } = useUpdateChecklistItemMutation(
    checklistId,
    dispatch
  );

  const { mutate: doDeleteItem } = useDeleteChecklistItemMutation(
    checklistId,
    dispatch
  );

  useEffect(() => {
    dispatch({
      type: ChecklistStateActionType.SET_DATA,
      data: fetchResult?.checklist || null,
      isLoading: isFetching,
    });
  }, [isFetching, fetchResult, dispatch]);

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
    updateChecklist: useCallback(
      (data) => doUpdateChecklist(data),
      [doUpdateChecklist]
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
