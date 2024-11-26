import { createContext, ReactNode } from 'react';
import { EnvironmentApplicationFacet } from '@/types/env';

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
  widgets: SidebarWidget[];
  drawerOpen: boolean;
  drawerTitle?: string;
  drawerComponent: ReactNode | null;
  facet: EnvironmentApplicationFacet | null;
  configureView: (config: ViewConfiguration) => void;
  configureWidgets: (config: SidebarWidgetsConfiguration) => void;
  ejectView: () => void;
  openDrawer: (component: ReactNode, title?: string) => void;
  closeDrawer: () => void;
}

export const ActiveViewContext = createContext<ViewState | null>(null);
