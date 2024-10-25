import {AxiosInstance} from "axios";
import {createContext} from "react";
import {AppFeature} from "@/types/appFeatureTypes";

export type ApplicationEnvironment = "development" | "production";
export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export type EnvironmentAppFeature = Omit<AppFeature, "routes" | "basePath"> & {
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
    availableFeatures: EnvironmentAppFeature[];
}

export const EnvironmentContext = createContext<EnvironmentState | null>(null);
