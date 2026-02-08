// lib/hooks/useAuth.ts

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUserFromStorage,
    clearError,
  } = useAuthStore();

  // Load user from storage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
