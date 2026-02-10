// lib/api/thoughtChain.ts

import apiClient from "./client";

export type ThoughtType =
  | "observation"
  | "hypothesis"
  | "question"
  | "conclusion"
  | "correction";

export interface Thought {
  id: string;
  investigation: string;
  sequence_number: number;
  thought_type: ThoughtType;
  content: string;
  parent_thought: string | null;
  parent_thought_id: string | null;
  led_to_task: string | null;
  led_to_task_id: string | null;
  confidence_before: number;
  confidence_after: number;
  gemini_thought_signature: string | null;
  timestamp: string;
}

export interface TimelineThought {
  id: string;
  sequence: number;
  type: ThoughtType;
  content: string;
  confidence_before: number;
  confidence_after: number;
  timestamp: string;
  parent_id: string | null;
}

export interface ThoughtChainTimeline {
  investigation_id: string;
  total_thoughts: number;
  timeline: TimelineThought[];
}

export const thoughtChainAPI = {
  /**
   * Get all thoughts for an investigation
   */
  list: async (investigationId: string): Promise<Thought[]> => {
    const response = await apiClient.get<Thought[]>(`/agents/thoughts/`, {
      params: { investigation_id: investigationId },
    });
    return response.data;
  },

  /**
   * Get thought chain timeline
   */
  getTimeline: async (
    investigationId: string,
  ): Promise<ThoughtChainTimeline> => {
    const response = await apiClient.get<ThoughtChainTimeline>(
      `/agents/thoughts/timeline/`,
      {
        params: { investigation_id: investigationId },
      },
    );
    return response.data;
  },
};
