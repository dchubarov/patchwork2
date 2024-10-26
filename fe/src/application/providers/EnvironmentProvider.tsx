import _ from "lodash";
import React, {PropsWithChildren, useEffect, useReducer} from "react";
import {useQuery} from "@tanstack/react-query";
import {BackendStatus, EnvironmentFacet, EnvironmentContext, EnvironmentState} from "@/types/env";
import {apiUrl} from "@/utils/api";
import {createApiClient} from "../utils/apiClient";
import version from "@/version.json";
import AppFacets from "src/facets";

enum EnvironmentStateActionType {
    UPDATE_BACKEND_STATUS,
}

type EnvironmentStateAction =
    | { type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS, backendStatus: BackendStatus, backendInfo?: string }
    ;

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
        availableFacets: createFacetList(),
    } as EnvironmentState);

    const [environment, dispatch] = useReducer(environmentStateReducer, null, createInitialState);
    return (
        <EnvironmentContext.Provider value={environment}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;

// Private

function environmentStateReducer(state: EnvironmentState, action: EnvironmentStateAction): EnvironmentState {
    switch (action.type) {
        case EnvironmentStateActionType.UPDATE_BACKEND_STATUS:
            return {
                ...state,
                backendStatus: action.backendStatus,
                backendInfo: action.backendInfo
            };
    }
}

function createFacetList(): EnvironmentFacet[] {
    return AppFacets.map(value => ({
        name: value.name,
        basePath: value.basePath || value.name,
        category: value.category,
        defaultDisplayName: _.capitalize(value.defaultDisplayName || value.name),
        localizedDisplayName: _.capitalize(value.defaultDisplayName || value.name),
        localizedCategory: value.category ? _.capitalize(value.category) : undefined,
    } as EnvironmentFacet))
}
