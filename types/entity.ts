// types/entity.ts

export type EntityType =
  | "person"
  | "company"
  | "location"
  | "event"
  | "document"
  | "financial_instrument";

export type RelationshipType =
  | "owns"
  | "works_for"
  | "connected_to"
  | "transacted_with"
  | "located_in"
  | "parent_of";

export interface Entity {
  id: string;
  investigation: string;
  entity_type: EntityType;
  name: string;
  aliases: string[];
  description: string;
  confidence: number;
  source_count: number;
  metadata: Record<string, unknown>;
  position_x: number | null;
  position_y: number | null;
  discovered_by_task: string | null;
  relationships_count: number;
  evidence_count: number;
  created_at: string;
}

export interface EntityListItem {
  id: string;
  entity_type: EntityType;
  name: string;
  confidence: number;
  source_count: number;
  position_x: number | null;
  position_y: number | null;
}

export interface Relationship {
  id: string;
  investigation: string;
  source_entity: string;
  target_entity: string;
  source_entity_name: string;
  target_entity_name: string;
  source_entity_type: EntityType;
  target_entity_type: EntityType;
  relationship_type: RelationshipType;
  description: string;
  confidence: number;
  strength: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  discovered_by_task: string | null;
  evidence_count: number;
  created_at: string;
}

export interface RelationshipListItem {
  id: string;
  source_entity: string;
  target_entity: string;
  relationship_type: RelationshipType;
  confidence: number;
  strength: number;
  is_active: boolean;
}

export interface EntityRelationshipsResponse {
  entity_id: string;
  entity_name: string;
  outgoing_relationships: RelationshipListItem[];
  incoming_relationships: RelationshipListItem[];
  total_relationships: number;
}

export interface EntityEvidenceLink {
  evidence: {
    id: string;
    title: string;
    source_type: string;
    url: string | null;
    content_preview: string;
    relevance_score: number;
    created_at: string;
  };
  relevance: number;
  quote: string | null;
}

export interface EntityEvidenceResponse {
  entity_id: string;
  entity_name: string;
  evidence: EntityEvidenceLink[];
  total_evidence: number;
}

// Evidence types
export type EvidenceType =
  | "web_page"
  | "document"
  | "api_response"
  | "database"
  | "manual_entry";

export type SourceCredibility = "high" | "medium" | "low";

export interface Evidence {
  id: string;
  investigation: string;
  evidence_type: EvidenceType;
  title: string;
  source_url: string | null;
  source_credibility: SourceCredibility;
  content: string;
  content_preview: string;
  metadata: Record<string, unknown>;
  discovered_by_task: string | null;
  created_at: string;
}

export interface EvidenceListItem {
  id: string;
  evidence_type: EvidenceType;
  title: string;
  source_url: string | null;
  source_credibility: SourceCredibility;
  created_at: string;
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
