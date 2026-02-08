// src/lib/api/investigations.ts

import apiClient from "./client";
import {
  Investigation,
  CreateInvestigationData,
  InvestigationProgress,
  InvestigationStats,
} from "@/types/investigation";

export const investigationAPI = {
  /**
   * List all investigations for the current user
   */
  list: async (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ results: Investigation[]; count: number }> => {
    const response = await apiClient.get<{
      results: Investigation[];
      count: number;
    }>("/investigations/", { params });
    return response.data;
  },

  /**
   * Get a single investigation by ID
   */
  get: async (id: string): Promise<Investigation> => {
    const response = await apiClient.get<Investigation>(
      `/investigations/${id}/`,
    );
    return response.data;
  },

  /**
   * Create a new investigation
   */
  create: async (data: CreateInvestigationData): Promise<Investigation> => {
    const response = await apiClient.post<Investigation>(
      "/investigations/",
      data,
    );
    return response.data;
  },

  /**
   * Update investigation status/phase
   */
  update: async (
    id: string,
    data: Partial<Investigation>,
  ): Promise<Investigation> => {
    const response = await apiClient.patch<Investigation>(
      `/investigations/${id}/`,
      data,
    );
    return response.data;
  },

  /**
   * Delete an investigation
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/investigations/${id}/`);
  },

  /**
   * Get investigation status
   */
  getStatus: async (
    id: string,
  ): Promise<{
    id: string;
    status: string;
    current_phase: string;
    progress_percentage: number;
    confidence_score: number;
    estimated_completion: string | null;
    entities_count: number;
    relationships_count: number;
    evidence_count: number;
  }> => {
    const response = await apiClient.get(`/investigations/${id}/status/`);
    return response.data;
  },

  /**
   * Get detailed progress information
   */
  getProgress: async (id: string): Promise<InvestigationProgress> => {
    const response = await apiClient.get<InvestigationProgress>(
      `/investigations/${id}/progress/`,
    );
    return response.data;
  },

  /**
   * Pause a running investigation
   */
  pause: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/investigations/${id}/pause/`,
    );
    return response.data;
  },

  /**
   * Resume a paused investigation
   */
  resume: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/investigations/${id}/resume/`,
    );
    return response.data;
  },

  /**
   * Cancel an investigation
   */
  cancel: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/investigations/${id}/cancel/`,
    );
    return response.data;
  },

  /**
   * Redirect investigation focus
   */
  redirect: async (
    id: string,
    focus: string,
    priority: "low" | "medium" | "high" = "medium",
  ): Promise<{ message: string; new_focus: string; priority: string }> => {
    const response = await apiClient.post(`/investigations/${id}/redirect/`, {
      focus,
      priority,
    });
    return response.data;
  },

  /**
   * Get investigation statistics for dashboard
   */
  getStats: async (): Promise<InvestigationStats> => {
    const response = await apiClient.get<{ results: Investigation[] }>(
      "/investigations/",
    );
    const investigations = response.data.results || response.data;

    return {
      total_investigations: investigations.length,
      active_investigations: investigations.filter(
        (i) => i.status === "running",
      ).length,
      completed_investigations: investigations.filter(
        (i) => i.status === "completed",
      ).length,
      failed_investigations: investigations.filter((i) => i.status === "failed")
        .length,
    };
  },
};
