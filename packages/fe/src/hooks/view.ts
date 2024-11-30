import { useContext } from 'react';
import { useSafeContext } from '@/utils/context';
import {
  ActiveViewContext,
  DrawerContext,
  FacetContext,
  SidebarWidgetsContext,
} from '@/types/view';

export const useFacetOrNull = () => useContext(FacetContext);
export const useFacet = () => useSafeContext(FacetContext);
export const useActiveViewOrNull = () => useContext(ActiveViewContext);
export const useActiveView = () => useSafeContext(ActiveViewContext);
export const useSidebarWidgets = () => useSafeContext(SidebarWidgetsContext);
export const useDrawer = () => useSafeContext(DrawerContext);
