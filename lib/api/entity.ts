// lib/api/entity.ts

import apiClient from "./client";
import type {
  Entity,
  EntityListItem,
  EntityRelationshipsResponse,
  EntityEvidenceResponse,
  Evidence,
  EvidenceListItem,
} from "@/types/entity";

export const entityAPI = {
  // List all entities for an investigation
  list: async (investigationId: string): Promise<EntityListItem[]> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/entities/`,
    );
    return response.data.results || response.data;
  },

  // Get single entity details
  get: async (investigationId: string, entityId: string): Promise<Entity> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/entities/${entityId}/`,
    );
    return response.data;
  },

  // Get entity relationships
  getRelationships: async (
    investigationId: string,
    entityId: string,
  ): Promise<EntityRelationshipsResponse> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/entities/${entityId}/relationships/`,
    );
    return response.data;
  },

  // Get entity evidence
  getEvidence: async (
    investigationId: string,
    entityId: string,
  ): Promise<EntityEvidenceResponse> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/entities/${entityId}/evidence/`,
    );
    return response.data;
  },
};

export const evidenceAPI = {
  // List all evidence for an investigation
  list: async (investigationId: string): Promise<EvidenceListItem[]> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/evidence/`,
    );
    return response.data.results || response.data;
  },

  // Get single evidence details
  get: async (
    investigationId: string,
    evidenceId: string,
  ): Promise<Evidence> => {
    const response = await apiClient.get(
      `/investigations/${investigationId}/evidence/${evidenceId}/`,
    );
    return response.data;
  },
};
