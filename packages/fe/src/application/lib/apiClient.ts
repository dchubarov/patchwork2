import axios, { AxiosResponse } from 'axios';
import { envGlobals } from '@/types/env';
import {
  ApiError,
  ResourceAccessError,
  ResourceNotFoundError,
} from '@/types/error';
import { ConsoleLogger, developmentLogger, logger } from '@/utils/logging';

const REQUEST_TIMESTAMP_HEADER = 'X-Request-Timestamp';

export const createApiClient = () => {
  const client = axios.create({
    baseURL: envGlobals.API_HOST + envGlobals.API_ROOT,
    timeout: envGlobals.API_TIMEOUT,
  });

  client.interceptors.request.use((config) => {
    config.headers.set(REQUEST_TIMESTAMP_HEADER, Date.now());
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      if (envGlobals.ENV === 'development' && !envGlobals.ENABLE_MOCKER) {
        logAxiosResponse(response, developmentLogger);
      }
      return response;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // TODO Logging seems redundant here because errors are logged by system
          // if (envGlobals.ENV === 'development' && !envGlobals.ENABLE_MOCKER) {
          //   logAxiosResponse(error.response, developmentLogger);
          // }

          switch (error.response.status) {
            case 401:
              return Promise.reject(
                new ResourceAccessError('Not authenticated')
              );
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
    }
  );

  developmentLogger.log(
    'Configured Axios API client with defaults:',
    client.defaults
  );

  return client;
};

function logAxiosResponse(
  response: AxiosResponse,
  loggerInstance?: ConsoleLogger
) {
  const statusColors = () => {
    if (response.status >= 200 && response.status < 300)
      return 'color:mediumseagreen';
    else if (response.status >= 300 && response.status < 400)
      return 'color:deepskyblue';
    else return 'color:tomato';
  };

  const styledMsg = [
    'API',
    'font-weight:bold;background-color:skyblue;padding:2px;border:1px solid deepskyblue;border-radius:4px',
  ];

  styledMsg.push(
    `${response.config.method?.toUpperCase()}`,
    'font-weight:bold'
  );
  styledMsg.push(`${response.config.baseURL}/${response.config.url}`, '');
  styledMsg.push(
    `>>> ${response.statusText} (${response.status})`,
    `font-weight:bold;${statusColors()}`
  );

  const t = response.config.headers.get(REQUEST_TIMESTAMP_HEADER);
  if (typeof t === 'string') {
    const duration = Date.now() - parseInt(t);
    styledMsg.push(`${duration}ms`, 'color:darkgrey');
  }

  let msg = '';
  const params: string[] = [];
  styledMsg.forEach((value, index) => {
    if (index % 2 == 0) msg += `%c${index > 0 ? ' ' : ''}${value}`;
    else params.push(value);
  });

  if (response.status < 0 || response.status >= 400)
    (loggerInstance ?? logger).warn(msg, ...params);
  else (loggerInstance ?? logger).log(msg, ...params);
}
