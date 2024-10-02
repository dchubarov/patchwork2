import {ReactNode} from "react";

export type SidebarPlacement = "left" | "right";

export interface SidebarWidget {
    key: string;
    caption: string;
    slot: number;
    component: ReactNode;
}

export type SidebarWidgetsConfiguration = Partial<SidebarWidget> | Partial<SidebarWidget>[];
export type ViewConfiguration = Partial<Pick<ViewState,
    | "key"
    | "title"
    | "sidebarPlacement"
>>;

export interface ViewState {
    key: string | null;
    title: string | null;
    sidebarPlacement: SidebarPlacement;
    sectionKey: string | null;
    sectionTitle: string | null;
    widgets: SidebarWidget[];
    configureView: (config: ViewConfiguration) => void;
    configureWidgets: (config: SidebarWidgetsConfiguration) => void;
    ejectView: () => void;
}

export const initialViewState: ViewState = {
    key: null,
    title: null,
    sidebarPlacement: "left",
    sectionKey: null,
    sectionTitle: null,
    widgets: [],
    configureView: () => {
    },
    configureWidgets: () => {
    },
    ejectView: () => {
    }
}
