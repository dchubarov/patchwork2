import { EnvironmentState, EnvironmentContext } from '@/types/env';
import { useContext } from 'react';
import { AxiosInstance } from 'axios';

export function useEnvironment(): EnvironmentState {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error(
      'useEnvironment() hook should be used within EnvironmentProvider.'
    );
  }
  return context;
}

export function useApiClient(): AxiosInstance {
  const { apiClient } = useEnvironment();
  return apiClient;
}
