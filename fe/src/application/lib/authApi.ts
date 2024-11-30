import z from 'zod';
import { AxiosInstance } from 'axios';

/** User credentials */
export interface UserCredentials {
  /** Login name (username or password) */
  login: string;
  /** Password value */
  password: string;
}

const userSchema = z.object({
  username: z.string().trim().min(1),
  email: z.string().email(),
  firstname: z.optional(z.string()),
  lastname: z.optional(z.string()),
  id: z.coerce.number().min(1),
});

export type User = z.infer<typeof userSchema>;

export const loginResponseSchema = z
  .object({
    user: userSchema,
    accessToken: z.string(),
  })
  .strict();

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Requests

const refreshRequest =
  (client: AxiosInstance) => async (): Promise<LoginResponse> =>
    client
      .get('auth/refresh', { withCredentials: true })
      .then((response) => loginResponseSchema.parse(response.data));

const loginRequest =
  (client: AxiosInstance) =>
  async (credentials: UserCredentials): Promise<LoginResponse> =>
    client
      .post('auth/login', credentials)
      .then((response) => loginResponseSchema.parse(response.data));

const logoutRequest = (client: AxiosInstance) => async () =>
  client.get('auth/logout');

const authApi = {
  refreshRequest,
  loginRequest,
  logoutRequest,
};

export default authApi;
