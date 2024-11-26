import { ViewState, ActiveViewContext } from '@/types/view';
import { useContext } from 'react';

export function useActiveViewSafe(): ViewState | null {
  return useContext(ActiveViewContext);
}

export function useActiveView(): ViewState {
  const context = useContext(ActiveViewContext);
  if (!context) {
    throw new Error(
      'useActiveView hook must be used within ActiveViewProvider.'
    );
  }
  return context;
}
