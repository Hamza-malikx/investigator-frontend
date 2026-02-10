// lib/hooks/useDashboard.ts

import { useState, useEffect, useCallback } from "react";
import {
  dashboardAPI,
  DashboardStats,
  RecentActivityResponse,
  SystemStatus,
  TimeRange,
} from "@/lib/api/dashboard";
import { handleApiError } from "@/lib/api/client";

interface UseDashboardReturn {
  stats: DashboardStats | null;
  activities: RecentActivityResponse | null;
  systemStatus: SystemStatus | null;
  isLoadingStats: boolean;
  isLoadingActivities: boolean;
  isLoadingSystemStatus: boolean;
  error: string | null;
  fetchStats: (timeRange?: TimeRange) => Promise<void>;
  fetchActivities: (limit?: number) => Promise<void>;
  fetchSystemStatus: () => Promise<void>;
  refreshAll: (timeRange?: TimeRange) => Promise<void>;
  clearError: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivityResponse | null>(
    null,
  );
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoadingSystemStatus, setIsLoadingSystemStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = useCallback(async (timeRange: TimeRange = "7d") => {
    setIsLoadingStats(true);
    setError(null);

    try {
      const data = await dashboardAPI.getStats(timeRange);
      setStats(data);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to fetch dashboard stats:", errorMessage);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  /**
   * Fetch recent activity
   */
  const fetchActivities = useCallback(async (limit: number = 10) => {
    setIsLoadingActivities(true);
    setError(null);

    try {
      const data = await dashboardAPI.getRecentActivity(limit);
      setActivities(data);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to fetch recent activities:", errorMessage);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  /**
   * Fetch system status
   */
  const fetchSystemStatus = useCallback(async () => {
    setIsLoadingSystemStatus(true);
    setError(null);

    try {
      const data = await dashboardAPI.getSystemStatus();
      setSystemStatus(data);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to fetch system status:", errorMessage);
    } finally {
      setIsLoadingSystemStatus(false);
    }
  }, []);

  /**
   * Refresh all dashboard data
   */
  const refreshAll = useCallback(
    async (timeRange: TimeRange = "7d") => {
      await Promise.all([
        fetchStats(timeRange),
        fetchActivities(),
        fetchSystemStatus(),
      ]);
    },
    [fetchStats, fetchActivities, fetchSystemStatus],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  return {
    stats,
    activities,
    systemStatus,
    isLoadingStats,
    isLoadingActivities,
    isLoadingSystemStatus,
    error,
    fetchStats,
    fetchActivities,
    fetchSystemStatus,
    refreshAll,
    clearError,
  };
};
