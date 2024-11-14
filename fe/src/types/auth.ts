import { createContext } from 'react';
import { JwtPayload } from '@/utils/jwt';
import { User, UserCredentials } from '../application/api/auth';

interface IAuthState {
  /** Indicates whether any authentication request is in progress */
  isPending: boolean;
  /** Function that performs login with passed credentials */
  login(credentials: UserCredentials): void;
  /** Function that performs logout */
  logout(): void;
}

export type AuthState = IAuthState &
  (
    | { isAuthenticated: true; user: User; sessionClaims: JwtPayload }
    | { isAuthenticated: false; user: null; sessionClaims: null }
  );

export const AuthContext = createContext<AuthState | null>(null);

export type {
  UserCredentials,
  User,
  LoginResponse,
} from '../application/api/auth';
