import { api } from "./client";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string; email: string; displayName: string };

export type RegisterRequest = { email: string; password: string; displayName?: string };
export type RegisterResponse = { accessToken: string; email: string; displayName: string };

export const authApi = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/api/auth/login", req);
    return data;
  },

  register: async (req: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/api/auth/register", req);
    return data;
  },
};

// Legacy exports for backwards compatibility
export const login = authApi.login;
export const register = authApi.register;
