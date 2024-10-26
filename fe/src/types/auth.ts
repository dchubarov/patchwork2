import {createContext} from "react";
import z from "zod";

export const UserSchema = z.object({
    username: z.string().trim().min(1),
    email: z.string().email(),
    firstname: z.optional(z.string()),
    lastname: z.optional(z.string()),
    id: z.coerce.number().min(1)
});

export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
    user: UserSchema,
    accessToken: z.string()
}).strict();

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

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

export const AuthContext = createContext<AuthState | null>(null);
