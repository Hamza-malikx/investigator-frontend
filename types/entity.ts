// types/entity.ts

export type EntityType =
  | "person"
  | "organization"
  | "location"
  | "event"
  | "document"
  | "concept"
  | "other";

export interface Entity {
  id: string;
  investigation_id: string;
  name: string;
  entity_type: EntityType;
  description?: string;
  confidence: number;
  attributes: Record<string, unknown>;
  source_count: number;
  first_seen: string;
  last_updated: string;
  metadata?: Record<string, unknown>;
}

export interface Relationship {
  id: string;
  investigation_id: string;
  source_entity_id: string;
  target_entity_id: string;
  relationship_type: string;
  description?: string;
  confidence: number;
  strength: number;
  evidence_count: number;
  attributes: Record<string, unknown>;
  discovered_at: string;
  metadata?: Record<string, unknown>;
}

export interface Evidence {
  id: string;
  investigation_id: string;
  content_type: "document" | "web_page" | "image" | "video" | "other";
  title: string;
  content_snippet?: string;
  source_url?: string;
  file_path?: string;
  credibility_score: number;
  relevance_score: number;
  extracted_at: string;
  metadata?: Record<string, unknown>;
}

// Board types
export interface BoardNode {
  id: string;
  type: "entityNode";
  data: {
    label: string;
    entityType: EntityType;
    confidence: number;
    color: string;
    entity: Entity;
  };
  position: { x: number; y: number };
}

export interface BoardEdge {
  id: string;
  source: string;
  target: string;
  type: "default";
  data: {
    label: string;
    confidence: number;
    strength: number;
    relationship: Relationship;
  };
  animated?: boolean;
  style?: Record<string, unknown>;
}

export interface BoardState {
  nodes: BoardNode[];
  edges: BoardEdge[];
  stats: BoardStats | null;
}

export interface BoardStats {
  total_entities: number;
  total_relationships: number;
  total_evidence: number;
  entity_breakdown: Record<EntityType, number>;
  average_confidence: number;
  most_connected_entities: Array<{
    entity_id: string;
    name: string;
    connection_count: number;
  }>;
}
