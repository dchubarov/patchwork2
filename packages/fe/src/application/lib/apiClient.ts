import axios from 'axios';
import { envGlobals } from '@/types/env';
import {
  ApiError,
  ResourceAccessError,
  ResourceNotFoundError,
} from '@/types/error';
import { developmentLogger } from '@/utils/logging';

export const createApiClient = () => {
  const client = axios.create({
    baseURL: envGlobals.API_HOST + envGlobals.API_ROOT,
    timeout: envGlobals.API_TIMEOUT,
  });

  client.interceptors.response.use(null, function (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return Promise.reject(new ResourceAccessError('Not authenticated'));
          case 403:
            return Promise.reject(
              new ResourceAccessError(
                'User has no access to the specified resource'
              )
            );
          case 404:
            return Promise.reject(
              new ResourceNotFoundError('Resource not found')
            );
          default:
            return Promise.reject(
              new ApiError(`API request failed: ${error.message}`, error)
            );
        }
      }
    }
    return Promise.reject(error);
  });

  if (!envGlobals.ENABLE_MOCKER) {
    client.interceptors.request.use((request) => {
      developmentLogger.log(
        `[API Client] ${request.method?.toUpperCase()} ${request.baseURL}/${request.url}`,
        { request }
      );
      return request;
    });
  }

  developmentLogger.log(
    'Configured Axios API client with defaults:',
    client.defaults
  );

  return client;
};
