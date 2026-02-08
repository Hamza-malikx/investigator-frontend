// lib/store/authStore.ts

import { create } from "zustand";
import { authAPI } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/client";
import { User, LoginCredentials, RegisterData, AuthState } from "@/types/auth";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // start as loading
  error: null,

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authAPI.login(credentials);

      const accessToken = response.tokens?.access || response.access;
      const refreshToken = response.tokens?.refresh || response.refresh;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      set({
        user: response.user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw new Error(errorMessage);
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authAPI.register(data);

      const accessToken = response.tokens?.access || response.access;
      const refreshToken = response.tokens?.refresh || response.refresh;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      set({
        user: response.user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    const refreshToken = get().refreshToken;

    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Load user from localStorage on app init
   */
  loadUserFromStorage: () => {
    if (typeof window === "undefined") return;

    set({ isLoading: true }); // start loading

    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const userStr = localStorage.getItem("user");

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Set user (for profile updates)
   */
  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user });
  },
}));
