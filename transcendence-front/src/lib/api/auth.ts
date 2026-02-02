import { api } from "./client";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string; email: string; displayName: string };

export type RegisterRequest = { email: string; password: string; displayName?: string };
export type RegisterResponse = { accessToken: string; email: string; displayName: string };

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", req);
  return data;
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", req);
  return data;
}
