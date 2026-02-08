// lib/api/client.ts

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refresh_token")
            : null;

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Refresh the token
        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh-token/`,
          {
            refresh: refreshToken,
          },
        );

        const { access } = response.data;

        // Save new token
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", access);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as unknown;

      if (typeof data === "string") return data;

      if (typeof data === "object" && data !== null) {
        const errorData = data as Record<string, unknown>;

        if (typeof errorData.detail === "string") return errorData.detail;
        if (typeof errorData.message === "string") return errorData.message;
        if (typeof errorData.error === "string") return errorData.error;

        const firstKey = Object.keys(errorData)[0];
        const firstValue = errorData[firstKey];

        if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
          return firstValue[0];
        }
      }

      return "An error occurred";
    }

    if (error.request) {
      return "No response from server. Please check your connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
