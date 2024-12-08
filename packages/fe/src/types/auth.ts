import { createContext } from 'react';
import { JwtPayload } from '@/utils/jwt';
import { User, LoginRequest } from '@patchwork2/schema';

interface IAuthState {
  /** Indicates whether any authentication request is in progress */
  isPending: boolean;
  /** Function that performs login with passed credentials */
  login(credentials: LoginRequest): void;
  /** Function that performs logout */
  logout(): void;
}

export type AuthState = IAuthState &
  (
    | { isAuthenticated: true; user: User; sessionClaims: JwtPayload }
    | { isAuthenticated: false; user: null; sessionClaims: null }
  );

export const AuthContext = createContext<AuthState | null>(null);
