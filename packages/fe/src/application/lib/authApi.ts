import { AxiosInstance } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  loginResponseSchema,
} from '@patchwork2/shared';

const refreshRequest =
  (client: AxiosInstance) => async (): Promise<LoginResponse> =>
    client
      .get('auth/refresh', { withCredentials: true })
      .then((response) => loginResponseSchema.parse(response.data));

const loginRequest =
  (client: AxiosInstance) =>
  async (credentials: LoginRequest): Promise<LoginResponse> =>
    client
      .post('auth/login', credentials, { withCredentials: true })
      .then((response) => loginResponseSchema.parse(response.data));

const logoutRequest = (client: AxiosInstance) => async () =>
  client.get('auth/logout', { withCredentials: true });

const authApi = {
  refreshRequest,
  loginRequest,
  logoutRequest,
};

export default authApi;
