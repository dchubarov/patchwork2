import React, {createContext, PropsWithChildren, useContext, useReducer} from "react";
import {EnvironmentState, environmentStateReducer} from "../lib/env";
import version from "../version.json";

export const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function useEnvironment(): EnvironmentState {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error("useEnvironment hook should be used within EnvironmentProvider.")
    }
    return context;
}

const initialEnvironmentState: EnvironmentState = {
    environment: (process.env.REACT_APP_ENV === "development" || process.env.REACT_APP_ENV === "production") ?
        process.env.REACT_APP_ENV : "production",
    versionInfo: "Version " + version.number,
    backendStatus: "unknown",
}

const EnvironmentProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state/*, dispatch*/] = useReducer(environmentStateReducer, initialEnvironmentState);
    return (
        <EnvironmentContext.Provider value={state}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;
