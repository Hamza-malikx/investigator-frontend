// lib/api/board.ts

import apiClient from "./client";

export interface BoardNode {
  id: string;
  name: string;
  type:
    | "person"
    | "company"
    | "location"
    | "event"
    | "document"
    | "financial_instrument";
  description: string;
  confidence: number;
  source_count: number;
  relationships_count: number;
  aliases: string[];
  position: { x: number; y: number };
  color: string;
  size: number;
}

export interface BoardEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  confidence: number;
  strength: number;
  is_active: boolean;
  style: "solid" | "dashed";
  width: number;
}

export interface BoardState {
  investigation_id: string;
  status: string;
  nodes: BoardNode[];
  edges: BoardEdge[];
  total_nodes: number;
  total_edges: number;
  layout_type: string;
}

export interface BoardStats {
  investigation_id: string;
  total_entities: number;
  total_relationships: number;
  total_evidence: number;
  average_confidence: number;
  entity_breakdown: Record<string, number>;
  relationship_breakdown: Record<string, number>;
  avg_entity_confidence: number;
  avg_relationship_confidence: number;
}

export interface UpdatePositionsPayload {
  nodes: Array<{ id: string; x: number; y: number }>;
}

export const boardAPI = {
  /**
   * Get board state for an investigation
   */
  getState: async (investigationId: string): Promise<BoardState> => {
    const response = await apiClient.get<BoardState>(
      `/investigations/${investigationId}/board/`,
    );
    return response.data;
  },

  /**
   * Get board statistics
   */
  getStats: async (investigationId: string): Promise<BoardStats> => {
    const response = await apiClient.get<BoardStats>(
      `/investigations/${investigationId}/board/stats/`,
    );
    return response.data;
  },

  /**
   * Update node positions (for layout persistence)
   */
  updatePositions: async (
    investigationId: string,
    payload: UpdatePositionsPayload,
  ): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.patch(
      `/investigations/${investigationId}/board/update_positions/`,
      payload,
    );
    return response.data;
  },
};
