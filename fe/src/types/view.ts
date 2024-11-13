import { createContext, ReactNode } from 'react';
import { EnvironmentApplicationFacet } from '@/types/env';

export type SidebarPlacement = 'left' | 'right';

export interface SidebarWidget {
  key: string;
  caption: string;
  slot: number;
  component: ReactNode;
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
