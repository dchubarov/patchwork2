import React, {createContext, PropsWithChildren, ReactNode, useCallback, useContext, useReducer} from "react";

// Types

export type SidebarPosition = "left" | "right";

export interface Widget {
    key: string;
    caption: string;
    slot: number;
    component: ReactNode;
}

export type WidgetsConfiguration = Partial<Widget> | Partial<Widget>[];
export type ViewConfiguration = Partial<Pick<ViewState,
    | "title"
    | "sidebarPosition"
>>;

export interface ViewState {
    key: string | null;
    title: string | null;
    sidebarPosition: SidebarPosition;
    widgets: Widget[];
    configureView: (config: ViewConfiguration) => void;
    configureWidgets: (config: WidgetsConfiguration) => void;
    ejectView: () => void;
}

const initialViewState: ViewState = {
    key: null,
    title: null,
    sidebarPosition: "left",
    widgets: [],
    configureView: () => {
    },
    configureWidgets: () => {
    },
    ejectView: () => {
    }
}

// Reducer

enum ViewStateActionType {
    CONFIGURE_VIEW,
    CONFIGURE_WIDGETS,
    EJECT_VIEW
}

type ViewStateAction =
    | { type: ViewStateActionType.CONFIGURE_VIEW, config: ViewConfiguration }
    | { type: ViewStateActionType.CONFIGURE_WIDGETS, config: WidgetsConfiguration }
    | { type: ViewStateActionType.EJECT_VIEW };

function viewStateReducer(state: ViewState, action: ViewStateAction): ViewState {
    switch (action.type) {
        case ViewStateActionType.CONFIGURE_VIEW:
            return {
                ...state,
                ...action.config
            };
        case ViewStateActionType.EJECT_VIEW:
            return initialViewState;
    }
    return state;
}

// Context

const ViewContext = createContext<ViewState | null>(null);

const ViewProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(viewStateReducer, initialViewState);

    const contextValue = {
        ...state,
        configureView: useCallback((config: ViewConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_VIEW, config});
        }, [dispatch]),
        configureWidgets: useCallback((config: WidgetsConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_WIDGETS, config});
        }, [dispatch]),
        ejectView: useCallback(() => {
            dispatch({type: ViewStateActionType.EJECT_VIEW});
        }, [dispatch])
    }

    return (
        <ViewContext.Provider value={contextValue}>
            {children}
        </ViewContext.Provider>
    );
}

export default ViewProvider;

// Hooks

export function useMainView(): ViewState {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView hook must be used within ViewProvider.");
    }
    return context;
}
