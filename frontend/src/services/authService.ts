import { api } from "../lib/axios";
import type { AuthResponse, UserDto } from "../types/auth";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", payload);
    if (res.data.token) {
      localStorage.setItem("techxpress_token", res.data.token);
      localStorage.setItem("techxpress_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", payload);
    if (res.data.token) {
      localStorage.setItem("techxpress_token", res.data.token);
      localStorage.setItem("techxpress_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe(): Promise<UserDto | null> {
    try {
      const res = await api.get<UserDto>("/auth/me");
      if (res.data) {
        localStorage.setItem("techxpress_user", JSON.stringify(res.data));
        return res.data;
      }
    } catch {
      // not logged in
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem("techxpress_token");
    localStorage.removeItem("techxpress_user");
  },

  getStoredUser(): UserDto | null {
    try {
      const raw = localStorage.getItem("techxpress_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("techxpress_token"));
  }
};
