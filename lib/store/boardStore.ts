// lib/store/boardStore.ts

import { create } from "zustand";
import { boardAPI, BoardState, BoardStats, BoardNode } from "@/lib/api/board";
import { handleApiError } from "@/lib/api/client";

interface BoardStoreState {
  boardState: BoardState | null;
  boardStats: BoardStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoardState: (investigationId: string) => Promise<void>;
  fetchBoardStats: (investigationId: string) => Promise<void>;
  updateNodePositions: (
    investigationId: string,
    nodes: Array<{ id: string; x: number; y: number }>,
  ) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  boardState: null,
  boardStats: null,
  isLoading: false,
  error: null,
};

export const useBoardStore = create<BoardStoreState>((set, get) => ({
  ...initialState,

  /**
   * Fetch board state
   */
  fetchBoardState: async (investigationId: string) => {
    set({ isLoading: true, error: null });

    try {
      const boardState = await boardAPI.getState(investigationId);
      set({
        boardState,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetch board statistics
   */
  fetchBoardStats: async (investigationId: string) => {
    try {
      const boardStats = await boardAPI.getStats(investigationId);
      set({ boardStats });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      console.error("Failed to fetch board stats:", errorMessage);
      // Don't set error state for stats as it's not critical
    }
  },

  /**
   * Update node positions for layout persistence
   */
  updateNodePositions: async (
    investigationId: string,
    nodes: Array<{ id: string; x: number; y: number }>,
  ) => {
    try {
      await boardAPI.updatePositions(investigationId, { nodes });

      // Optimistically update local state
      const currentState = get().boardState;
      if (currentState) {
        const updatedNodes = currentState.nodes.map((node) => {
          const update = nodes.find((n) => n.id === node.id);
          if (update) {
            return {
              ...node,
              position: { x: update.x, y: update.y },
            };
          }
          return node;
        });

        set({
          boardState: {
            ...currentState,
            nodes: updatedNodes,
          },
        });
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      console.error("Failed to update positions:", errorMessage);
      // Don't throw error as this is not critical
    }
  },

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),

  /**
   * Reset store to initial state
   */
  reset: () => set(initialState),
}));
