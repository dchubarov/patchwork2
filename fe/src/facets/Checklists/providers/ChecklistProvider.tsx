import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
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
  loadingElement?: ReactNode;
}

const ChecklistProvider: React.FC<
  PropsWithChildren<ChecklistProviderProps>
> = ({ checklistId = null, onMaterialize, loadingElement, children }) => {
  const [state, dispatch] = useChecklistReducer();

  const {
    isFetching,
    isPlaceholderData,
    status: fetchStatus,
    data: fetchResult,
  } = useChecklistQuery(checklistId);

  const { mutate: doUpdateChecklist, isPending: isMutating } =
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

  const context: ChecklistState = {
    ...state,
    isFetching,
    isMutating,
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

  // TODO refetch on user logout / user change
  if (fetchStatus === 'error') {
    // TODO need universal way to redirect to resource error page
    throw new Error('Error loading checklist');
  }

  return (
    <ChecklistContext.Provider value={context}>
      {checklistId == null || !isPlaceholderData ? children : loadingElement}
    </ChecklistContext.Provider>
  );
};

export default ChecklistProvider;
