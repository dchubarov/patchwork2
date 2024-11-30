import { createContext, ReactNode } from 'react';
import { EnvironmentApplicationFacet } from '@/types/env';
import { normalizeBasePath } from '@/utils/path';

export type SidebarPlacement = 'left' | 'right';

export interface SidebarWidget {
  /** Slot number, zero represents pinned widget */
  slot: number;
  /** Widget caption, not used for pinned widget */
  caption: string;
  /**
   * Widget UI component, passing `null` value to `configureWidget`
   * causes removal of the widget
   */
  component: ReactNode;
  /**
   * Represents a scope in which the widget does exist. Widget whose scope
   * does not match current conditions are automatically ejected. Scope
   * matching involves location and whether application has authenticated
   * user. If scope is `undefined` widget is not ejected automatically and
   * needs to be removed using `configureWidgets`.
   *
   * #### Examples:
   *  - `/some/path` - matches exact location withing application.
   *  - `/some/path/*` - matches location and its sub-location.
   *  - `!/some/path` - matches authenticated user and exact location.
   *  - `!/*` - matches any location within application if there is an authenticated user.
   */
  scope?: string;
}

export type SidebarWidgetsConfiguration =
  | Partial<SidebarWidget>
  | Partial<SidebarWidget>[];
export type ViewConfiguration = Partial<
  Pick<ViewState, 'key' | 'title' | 'sidebarPlacement'>
>;

export interface ViewState {
  key: string | null;
  title: string | null;
  sidebarPlacement: SidebarPlacement;
  configureView: (config: ViewConfiguration) => void;
  ejectView: () => void;
}

export interface DrawerState {
  isOpen: boolean;
  element: ReactNode;
  title?: string;
  openDrawer: (element: ReactNode, title?: string) => void;
  closeDrawer: () => void;
}

export interface SidebarWidgetsState {
  widgets: SidebarWidget[];
  configureWidgets: (config: SidebarWidgetsConfiguration) => void;
  removeWidgets: (...slots: number[]) => void;
  removeAllWidgets: () => void;
}

export const ActiveViewContext = createContext<ViewState | null>(null);

export const FacetContext = createContext<EnvironmentApplicationFacet | null>(
  null
);

export const DrawerContext = createContext<DrawerState | null>(null);

export const SidebarWidgetsContext = createContext<SidebarWidgetsState | null>(
  null
);

export function scopeMatches(
  scope: string | undefined,
  pathname: string,
  isAuthenticated: boolean
): boolean {
  if (typeof scope === 'undefined' || scope.length < 1) return true;

  let exactMatch = true,
    l = 0,
    r = scope.length;

  if (scope.startsWith('!')) {
    if (!isAuthenticated) return false;
    l++;
  }
  if (scope.endsWith('*')) {
    exactMatch = false;
    r--;
  }

  const normalizedPath = normalizeBasePath(scope.substring(l, r)) || '/';
  return exactMatch
    ? pathname === normalizedPath
    : pathname.startsWith(normalizedPath);
}
