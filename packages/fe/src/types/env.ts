import z from 'zod';
import { AxiosInstance } from 'axios';
import { createContext } from 'react';
import { ApplicationFacet } from '@/types/facet';
import { normalizeBasePath } from '@/utils/path';

export enum ApplicationEnvironment {
  Development = 'development',
  Production = 'production',
}

const envGlobalsSchema = z.object({
  ENV: z
    .nativeEnum(ApplicationEnvironment)
    .default(ApplicationEnvironment.Production),
  ENABLE_MOCKER: z.preprocess(
    (val) => String(val).localeCompare('true') === 0,
    z.boolean()
  ),
  API_HOST: z.string().default(''),
  API_ROOT: z.string().transform(normalizeBasePath).default('/api'),
  UI_ROOT: z.optional(z.string().transform(normalizeBasePath)),
  PUBLIC_URL: z.optional(z.string()),
  API_TIMEOUT: z.coerce.number().default(5000),
});

type EnvGlobals = z.infer<typeof envGlobalsSchema>;
export const envGlobals: EnvGlobals = parseEnvironmentGlobals();

export type BackendStatus =
  | 'unknown'
  | 'online'
  | 'offline' /*| "maintenance"*/;

export type EnvironmentApplicationFacet = Omit<
  ApplicationFacet,
  'routes' | 'basePath'
> & {
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
  availableFacets: EnvironmentApplicationFacet[];
}

export const EnvironmentContext = createContext<EnvironmentState | null>(null);
export type { ServerInfoResponse } from '@patchwork2/shared';

// Private

function parseEnvironmentGlobals(): EnvGlobals {
  const allowedNonAppVariables = ['PUBLIC_URL'];
  const processEnvVars = Object.entries(process.env).reduce<
    Record<string, string | undefined>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('REACT_APP_')) {
      acc[key.replace('REACT_APP_', '')] = value;
    } else if (allowedNonAppVariables.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const envParseResult = envGlobalsSchema.safeParse(processEnvVars);
  if (!envParseResult.success) {
    throw new Error('Failed to parse environment variables.', {
      cause: envParseResult.error,
    });
  }

  return envParseResult.data;
}
