import React, {createContext, PropsWithChildren, useCallback, useContext, useReducer} from "react";

export interface ViewAddon {
    component: React.ReactNode;
    caption?: string;
    slot: number;
}

export type ViewAddonsConfiguration = Partial<ViewAddon> | Partial<ViewAddon>[];
export type ViewConfiguration = Pick<ViewParameters, "title" | "forceSidebar">;

export interface ViewParameters {
    title?: string;
    forceSidebar?: boolean;
    addons: ViewAddon[];
    configureView: (config: ViewConfiguration) => void;
    configureAddons: (addons: ViewAddonsConfiguration) => void;
    ejectView: () => void;
}

const initialViewParameters: ViewParameters = {
    addons: [],
    configureView: () => {
    },
    configureAddons: () => {
    },
    ejectView: () => {
    },
}

enum ViewParametersActionType {
    CONFIGURE_VIEW,
    CONFIGURE_ADDONS,
    EJECT_VIEW,
}

type ViewParametersAction =
    | { type: ViewParametersActionType.CONFIGURE_VIEW, config: ViewConfiguration }
    | { type: ViewParametersActionType.CONFIGURE_ADDONS, addons: ViewAddonsConfiguration }
    | { type: ViewParametersActionType.EJECT_VIEW }

function viewParametersReducer(state: ViewParameters, action: ViewParametersAction): ViewParameters {
    switch (action.type) {
        case ViewParametersActionType.CONFIGURE_VIEW:
            return {
                ...state,
                ...action.config
            }

        case ViewParametersActionType.CONFIGURE_ADDONS:
            const configs = Array.isArray(action.addons) ? action.addons : [action.addons];
            const updatedAddons = [
                ...state.addons.filter((item) => !configs.find((config) => item.slot === (config.slot || 0))),
                ...configs.map((config) => ({
                    component: config.component,
                    slot: config.slot || 0,
                    caption: config.caption
                }))
            ].sort((a, b) => a.slot - b.slot);
            return {...state, addons: updatedAddons}

        case ViewParametersActionType.EJECT_VIEW:
            return initialViewParameters;
    }
}

const ViewParametersContext = createContext<ViewParameters | null>(null);

export function useViewParameters(): ViewParameters {
    const context = useContext(ViewParametersContext);
    if (!context) {
        throw new Error("useViewParameters() hook must be used within ViewParametersProvider.")
    }
    return context;
}

const ViewParametersProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(viewParametersReducer, initialViewParameters);

    const configureView = useCallback((config: ViewConfiguration) => {
        dispatch({type: ViewParametersActionType.CONFIGURE_VIEW, config: config});
    }, [dispatch]);

    const configureAddons = useCallback((addons: ViewAddonsConfiguration) => {
        dispatch({type: ViewParametersActionType.CONFIGURE_ADDONS, addons: addons});
    }, [dispatch]);

    const ejectView = useCallback(() => {
        dispatch({type: ViewParametersActionType.EJECT_VIEW})
    }, [dispatch]);

    const contextValue: ViewParameters = {
        ...state,
        configureView,
        configureAddons,
        ejectView,
    }

    return (
        <ViewParametersContext.Provider value={contextValue}>
            {children}
        </ViewParametersContext.Provider>
    );
}

export default ViewParametersProvider;
