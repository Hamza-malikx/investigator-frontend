// src/types/investigation.ts

export type InvestigationStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export type InvestigationPhase =
  | "planning"
  | "researching"
  | "analyzing"
  | "reporting";

export type InvestigationDepth = "shallow" | "moderate" | "comprehensive";

export interface InvestigationPlan {
  id: string;
  investigation: string;
  research_strategy: Array<{
    depth?: string;
    time_range?: Record<string, unknown>;
    created_at?: string;
  }>;
  hypothesis: string;
  priority_areas:
    | Array<{
        focus?: string;
        priority?: string;
        timestamp?: string;
      }>
    | string[];
  avoided_paths: string[];
  created_at: string;
  updated_at: string;
}

export interface SubTask {
  id: string;
  investigation: string;
  parent_task: string | null;
  task_type:
    | "web_search"
    | "document_analysis"
    | "entity_extraction"
    | "relationship_mapping";
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  result: Record<string, unknown> | null;
  confidence: number;
  order: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface Investigation {
  id: string;
  user: string;
  user_email: string;
  title: string;
  initial_query: string;
  status: InvestigationStatus;
  current_phase: InvestigationPhase;
  progress_percentage: number;
  confidence_score: number;
  started_at: string | null;
  completed_at: string | null;
  estimated_completion: string | null;
  total_api_calls: number;
  total_cost_usd: string;
  plan?: InvestigationPlan;
  subtasks?: SubTask[];
  entities_count: number;
  relationships_count: number;
  evidence_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateInvestigationData {
  title: string;
  initial_query: string;
  focus_areas?: string[];
  depth_level?: InvestigationDepth;
  time_range?: {
    start?: string;
    end?: string;
  };
}

export interface InvestigationProgress {
  id: string;
  status: InvestigationStatus;
  current_phase: InvestigationPhase;
  progress_percentage: number;
  total_subtasks: number;
  completed_subtasks: number;
  in_progress_subtasks: number;
  pending_subtasks: number;
  failed_subtasks: number;
  total_api_calls: number;
  total_cost_usd: string;
}

export interface InvestigationStats {
  total_investigations: number;
  active_investigations: number;
  completed_investigations: number;
  failed_investigations: number;
}
