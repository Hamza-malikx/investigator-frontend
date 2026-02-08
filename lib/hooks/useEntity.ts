// lib/hooks/useEntity.ts

import { useState, useCallback } from "react";
import { entityAPI, evidenceAPI } from "../api/entity";
import type {
  Entity,
  EntityListItem,
  EntityRelationshipsResponse,
  EntityEvidenceResponse,
  Evidence,
  EvidenceListItem,
} from "@/types/entity";
import { handleApiError } from "../api/client";

export function useEntity() {
  const [entities, setEntities] = useState<EntityListItem[]>([]);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityRelationships, setEntityRelationships] =
    useState<EntityRelationshipsResponse | null>(null);
  const [entityEvidence, setEntityEvidence] =
    useState<EntityEvidenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = useCallback(async (investigationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await entityAPI.list(investigationId);
      setEntities(data);
      return data;
    } catch (err: unknown) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEntity = useCallback(
    async (investigationId: string, entityId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await entityAPI.get(investigationId, entityId);
        setCurrentEntity(data);
        return data;
      } catch (err: unknown) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchEntityRelationships = useCallback(
    async (investigationId: string, entityId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await entityAPI.getRelationships(
          investigationId,
          entityId,
        );
        setEntityRelationships(data);
        return data;
      } catch (err: unknown) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchEntityEvidence = useCallback(
    async (investigationId: string, entityId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await entityAPI.getEvidence(investigationId, entityId);
        setEntityEvidence(data);
        return data;
      } catch (err: unknown) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    entities,
    currentEntity,
    entityRelationships,
    entityEvidence,
    isLoading,
    error,
    fetchEntities,
    fetchEntity,
    fetchEntityRelationships,
    fetchEntityEvidence,
    clearError,
  };
}

export function useEvidence() {
  const [evidence, setEvidence] = useState<EvidenceListItem[]>([]);
  const [currentEvidence, setCurrentEvidence] = useState<Evidence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async (investigationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await evidenceAPI.list(investigationId);
      setEvidence(data);
      return data;
    } catch (err: unknown) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEvidenceItem = useCallback(
    async (investigationId: string, evidenceId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await evidenceAPI.get(investigationId, evidenceId);
        setCurrentEvidence(data);
        return data;
      } catch (err: unknown) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    evidence,
    currentEvidence,
    isLoading,
    error,
    fetchEvidence,
    fetchEvidenceItem,
    clearError,
  };
}
