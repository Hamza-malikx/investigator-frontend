// lib/hooks/useBoard.ts

import { useBoardStore } from "@/lib/store/boardStore";

export const useBoard = () => {
  const {
    boardState,
    boardStats,
    isLoading,
    error,
    fetchBoardState,
    fetchBoardStats,
    updateNodePositions,
    clearError,
    reset,
  } = useBoardStore();

  return {
    boardState,
    boardStats,
    isLoading,
    error,
    fetchBoardState,
    fetchBoardStats,
    updateNodePositions,
    clearError,
    reset,
  };
};
