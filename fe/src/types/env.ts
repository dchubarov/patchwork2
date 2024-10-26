import _ from "lodash";
import z from "zod";
import {AxiosInstance} from "axios";
import {createContext} from "react";
import {ApplicationFacet} from "@/types/facet";

export enum ApplicationEnvironment {
    Development = "development",
    Production = "production"
}

const envGlobalsSchema = z.object({
    ENV: z.nativeEnum(ApplicationEnvironment).default(ApplicationEnvironment.Production),
    ENABLE_MOCKER: z.coerce.boolean().default(false),
    API_ROOT: z.string().transform((val => _.trim(val, "/"))).default(""),
    UI_ROOT: z.string().transform((val) => _.trim(val, "/")).default(""),
    PUBLIC_URL: z.string().default(""),
});

type EnvGlobals = z.infer<typeof envGlobalsSchema>;
export const envGlobals: EnvGlobals = parseEnvironmentGlobals();

export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export type EnvironmentFacet = Omit<ApplicationFacet, "routes" | "basePath"> & {
    basePath: string;
    localizedDisplayName: string;
    localizedCategory?: string;
};

export interface EnvironmentState {
    environment: ApplicationEnvironment;
    globals: EnvGlobals;
    apiClient: AxiosInstance;
    versionInfo: string;
    backendInfo?: string;
    backendStatus: BackendStatus;
    availableFacets: EnvironmentFacet[];
}

export const EnvironmentContext = createContext<EnvironmentState | null>(null);
export type {ServerInfoResponse} from "@/application/api/monitoring";

// Private

function parseEnvironmentGlobals(): EnvGlobals {
    const allowedNonAppVariables = ["PUBLIC_URL"];
    const processEnvVars = Object.entries(process.env)
        .reduce<Record<string, string | undefined>>((acc, curr) => {
            const [key, value] = curr;
            if (key.startsWith("REACT_APP_")) {
                acc[key.replace("REACT_APP_", "")] = value;
            } else if (allowedNonAppVariables.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {})

    const envParseResult = envGlobalsSchema.safeParse(processEnvVars);
    if (!envParseResult.success) {
        throw new Error("Failed to parse environment variables.", {cause: envParseResult.error});
    }

    return envParseResult.data;
}
