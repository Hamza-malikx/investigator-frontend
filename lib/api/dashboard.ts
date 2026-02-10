// lib/api/dashboard.ts

import apiClient from "./client";

export interface DashboardStat {
  value: number | string;
  total?: number;
  change: string;
  trend: "up" | "down";
}

export interface DashboardStats {
  active_investigations: DashboardStat;
  entities_mapped: DashboardStat;
  documents_analyzed: DashboardStat;
  team_members: DashboardStat;
  time_range: string;
  period_start: string;
  period_end: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  timestamp: string;
  type: string;
  icon: string;
  color: string;
}

export interface RecentActivityResponse {
  activities: Activity[];
  total: number;
}

export interface SystemStatus {
  status: string;
  api_response_time: string;
  processing_queue: number;
  uptime: string;
  last_updated: string;
}

export type TimeRange = "24h" | "7d" | "30d" | "90d";

export const dashboardAPI = {
  /**
   * Get dashboard statistics with period comparison
   */
  getStats: async (timeRange: TimeRange = "7d"): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>(
      `/auth/dashboard/stats/`,
      {
        params: { time_range: timeRange },
      },
    );
    return response.data;
  },

  /**
   * Get recent activity feed
   */
  getRecentActivity: async (
    limit: number = 10,
  ): Promise<RecentActivityResponse> => {
    const response = await apiClient.get<RecentActivityResponse>(
      `/auth/dashboard/activity/`,
      {
        params: { limit },
      },
    );
    return response.data;
  },

  /**
   * Get system status
   */
  getSystemStatus: async (): Promise<SystemStatus> => {
    const response = await apiClient.get<SystemStatus>(
      `/auth/dashboard/system-status/`,
    );
    return response.data;
  },
};
