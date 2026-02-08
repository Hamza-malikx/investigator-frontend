// lib/api/auth.ts

import apiClient from "./client";
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  User,
  ChangePasswordData,
} from "@/types/auth";

export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login/",
      credentials,
    );
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/register/",
      data,
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>(
      "/auth/refresh-token/",
      {
        refresh: refreshToken,
      },
    );
    return response.data;
  },

  /**
   * Logout (blacklist refresh token)
   */
  logout: async (refreshToken: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/logout/",
      {
        refresh: refreshToken,
      },
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/profile/");
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>("/auth/profile/", data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    data: ChangePasswordData,
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/change-password/",
      data,
    );
    return response.data;
  },
};
