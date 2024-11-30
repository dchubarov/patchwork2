import { EnvironmentContext } from '@/types/env';
import { AxiosInstance } from 'axios';
import { useSafeContext } from '@/utils/context';

export const useEnvironment = () => useSafeContext(EnvironmentContext);

export const useApiClient = (client?: AxiosInstance): AxiosInstance => {
  const { apiClient } = useEnvironment();
  if (client) return client;
  else return apiClient;
};
