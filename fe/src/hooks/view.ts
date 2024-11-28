import {
  ViewState,
  ActiveViewContext,
  FacetContext,
  DrawerState,
  DrawerContext,
} from '@/types/view';
import { useContext } from 'react';
import { EnvironmentApplicationFacet } from '@/types/env';

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

export function useFacet(): EnvironmentApplicationFacet | null {
  return useContext(FacetContext);
}

export function useDrawer(): DrawerState {
  const context = useContext(DrawerContext);
  if (!context)
    throw new Error('useDrawer() hook must be used withing DrawerProvider.');
  return context;
}
