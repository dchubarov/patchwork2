
export interface User {
    username: string;
    email: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface UserCredentials {
    login: string;
    password: string;
}

interface IAuthState {
    isPending: boolean;
    login(credentials: UserCredentials): void;
    logout(): void;
}

export type AuthState = IAuthState & (
    | { isAuthenticated: true, user: User }
    | { isAuthenticated: false, user: null });
