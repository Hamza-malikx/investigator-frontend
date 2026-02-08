// lib/store/investigationStore.ts

import { create } from "zustand";
import { investigationAPI } from "@/lib/api/investigations";
import { handleApiError } from "@/lib/api/client";
import {
  Investigation,
  CreateInvestigationData,
  InvestigationStats,
} from "@/types/investigation";

interface InvestigationState {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  stats: InvestigationStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInvestigations: (params?: { status?: string }) => Promise<void>;
  fetchInvestigation: (id: string) => Promise<void>;
  createInvestigation: (
    data: CreateInvestigationData,
  ) => Promise<Investigation>;
  updateInvestigation: (
    id: string,
    data: Partial<Investigation>,
  ) => Promise<void>;
  deleteInvestigation: (id: string) => Promise<void>;
  pauseInvestigation: (id: string) => Promise<void>;
  resumeInvestigation: (id: string) => Promise<void>;
  cancelInvestigation: (id: string) => Promise<void>;
  redirectInvestigation: (
    id: string,
    focus: string,
    priority?: "low" | "medium" | "high",
  ) => Promise<void>;
  fetchStats: () => Promise<void>;
  setCurrentInvestigation: (investigation: Investigation | null) => void;
  clearError: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigations: [],
  currentInvestigation: null,
  stats: null,
  isLoading: false,
  error: null,

  /**
   * Fetch all investigations
   */
  fetchInvestigations: async (params) => {
    set({ isLoading: true, error: null });

    try {
      const response = await investigationAPI.list(params);
      const investigations = response.results || (response as unknown);
      set({
        investigations: Array.isArray(investigations)
          ? investigations
          : [investigations],
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetch single investigation
   */
  fetchInvestigation: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const investigation = await investigationAPI.get(id);
      set({
        currentInvestigation: investigation,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Create new investigation
   */
  createInvestigation: async (data: CreateInvestigationData) => {
    set({ isLoading: true, error: null });

    try {
      const investigation = await investigationAPI.create(data);

      // Add to investigations list
      set((state) => ({
        investigations: [investigation, ...state.investigations],
        currentInvestigation: investigation,
        isLoading: false,
      }));

      return investigation;
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Update investigation
   */
  updateInvestigation: async (id: string, data: Partial<Investigation>) => {
    set({ isLoading: true, error: null });

    try {
      const updated = await investigationAPI.update(id, data);

      // Update in list
      set((state) => ({
        investigations: state.investigations.map((inv) =>
          inv.id === id ? updated : inv,
        ),
        currentInvestigation:
          state.currentInvestigation?.id === id
            ? updated
            : state.currentInvestigation,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete investigation
   */
  deleteInvestigation: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await investigationAPI.delete(id);

      // Remove from list
      set((state) => ({
        investigations: state.investigations.filter((inv) => inv.id !== id),
        currentInvestigation:
          state.currentInvestigation?.id === id
            ? null
            : state.currentInvestigation,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Pause investigation
   */
  pauseInvestigation: async (id: string) => {
    try {
      await investigationAPI.pause(id);

      // Refresh investigation
      await get().fetchInvestigation(id);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Resume investigation
   */
  resumeInvestigation: async (id: string) => {
    try {
      await investigationAPI.resume(id);

      // Refresh investigation
      await get().fetchInvestigation(id);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Cancel investigation
   */
  cancelInvestigation: async (id: string) => {
    try {
      await investigationAPI.cancel(id);

      // Refresh investigation
      await get().fetchInvestigation(id);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Redirect investigation focus
   */
  redirectInvestigation: async (
    id: string,
    focus: string,
    priority: "low" | "medium" | "high" = "medium",
  ) => {
    try {
      await investigationAPI.redirect(id, focus, priority);

      // Refresh investigation
      await get().fetchInvestigation(id);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetch investigation statistics
   */
  fetchStats: async () => {
    try {
      const stats = await investigationAPI.getStats();
      set({ stats });
    } catch (error: unknown) {
      console.error("Failed to fetch stats:", error);
    }
  },

  /**
   * Set current investigation
   */
  setCurrentInvestigation: (investigation: Investigation | null) => {
    set({ currentInvestigation: investigation });
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));
