import {AxiosInstance} from "axios";
import {createContext} from "react";
import {ApplicationFacet} from "@/types/facet";

export type ApplicationEnvironment = "development" | "production";
export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export type EnvironmentFacet = Omit<ApplicationFacet, "routes" | "basePath"> & {
    basePath: string;
    localizedDisplayName: string;
    localizedCategory?: string;
};

export interface EnvironmentState {
    environment: ApplicationEnvironment;
    apiClient: AxiosInstance;
    versionInfo: string;
    backendInfo?: string;
    backendStatus: BackendStatus;
    availableFacets: EnvironmentFacet[];
}

export const EnvironmentContext = createContext<EnvironmentState | null>(null);
export type {ServerInfoResponse} from "@/application/api/monitoring";
