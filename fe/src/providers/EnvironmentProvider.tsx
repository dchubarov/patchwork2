import React, {createContext, PropsWithChildren, useContext, useEffect, useReducer} from "react";
import {useQuery} from "@tanstack/react-query";
import {EnvironmentState, EnvironmentStateActionType, environmentStateReducer} from "../lib/env";
import {createApiClient, apiUrl} from "../lib/apiClient";
import version from "../version.json";

export const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function useEnvironment(): EnvironmentState {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error("useEnvironment() hook should be used within EnvironmentProvider.")
    }
    return context;
}

const SERVER_MONITORING_INTERVAL_MILLIS = 30_000;
const apiClient = createApiClient();

const EnvironmentProvider: React.FC<PropsWithChildren> = ({children}) => {
    // Backend monitoring
    const {status: serverInfoStatus, data: serverInfo} = useQuery({
        queryKey: ["/server-info"],
        queryFn: async () => {
            return apiClient
                .get(apiUrl("/server-info"))
                .then((response => response.data))
        },
        refetchInterval: SERVER_MONITORING_INTERVAL_MILLIS,
        staleTime: SERVER_MONITORING_INTERVAL_MILLIS
    });

    useEffect(() => {
        if (serverInfoStatus === "success") {
            dispatch({
                type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                backendInfo: serverInfo.server,
                backendStatus: "online"
            });
        } else if (serverInfoStatus === "error") {
            dispatch({
                type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                backendStatus: "offline"
            });
        }
    }, [serverInfoStatus, serverInfo]);

    const createInitialState = () => ({
        environment: process.env.REACT_APP_ENV === "development" ? "development" : "production",
        apiClient,
        backendStatus: "unknown",
        versionInfo: "Version " + version.number,
    } as EnvironmentState);

    const [environment, dispatch] = useReducer(environmentStateReducer, null, createInitialState);
    return (
        <EnvironmentContext.Provider value={environment}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;
