import {ReactNode} from "react";

export type SidebarPlacement = "left" | "right";

export interface Widget {
    key: string;
    caption: string;
    slot: number;
    component: ReactNode;
}

export type WidgetsConfiguration = Partial<Widget> | Partial<Widget>[];
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
    widgets: Widget[];
    configureView: (config: ViewConfiguration) => void;
    configureWidgets: (config: WidgetsConfiguration) => void;
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
