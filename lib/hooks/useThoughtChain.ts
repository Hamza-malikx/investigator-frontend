// lib/hooks/useThoughtChain.ts

import { useState, useCallback } from "react";
import {
  thoughtChainAPI,
  Thought,
  ThoughtChainTimeline,
} from "@/lib/api/thoughtChain";
import { handleApiError } from "@/lib/api/client";

interface UseThoughtChainReturn {
  thoughts: Thought[];
  timeline: ThoughtChainTimeline | null;
  isLoadingThoughts: boolean;
  isLoadingTimeline: boolean;
  error: string | null;
  fetchThoughts: (investigationId: string) => Promise<void>;
  fetchTimeline: (investigationId: string) => Promise<void>;
  clearError: () => void;
}

export const useThoughtChain = (): UseThoughtChainReturn => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [timeline, setTimeline] = useState<ThoughtChainTimeline | null>(null);
  const [isLoadingThoughts, setIsLoadingThoughts] = useState(false);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all thoughts for an investigation
   */
  const fetchThoughts = useCallback(async (investigationId: string) => {
    setIsLoadingThoughts(true);
    setError(null);

    try {
      const data = await thoughtChainAPI.list(investigationId);
      setThoughts(data);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to fetch thoughts:", errorMessage);
    } finally {
      setIsLoadingThoughts(false);
    }
  }, []);

  /**
   * Fetch thought chain timeline
   */
  const fetchTimeline = useCallback(async (investigationId: string) => {
    setIsLoadingTimeline(true);
    setError(null);

    try {
      const data = await thoughtChainAPI.getTimeline(investigationId);
      setTimeline(data);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Failed to fetch timeline:", errorMessage);
    } finally {
      setIsLoadingTimeline(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    thoughts,
    timeline,
    isLoadingThoughts,
    isLoadingTimeline,
    error,
    fetchThoughts,
    fetchTimeline,
    clearError,
  };
};
