// types/investigation.ts

export type InvestigationStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type InvestigationDepth = "shallow" | "moderate" | "comprehensive";

export interface Investigation {
  id: string;
  title: string;
  query: string;
  status: InvestigationStatus;
  depth_level: InvestigationDepth;
  focus_areas: string[];
  time_range_start?: string;
  time_range_end?: string;
  progress_percentage: number;
  entities_count: number;
  relationships_count: number;
  evidence_count: number;
  thoughts_count: number;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface CreateInvestigationData {
  title?: string;
  query: string;
  depth_level?: InvestigationDepth;
  focus_areas?: string[];
  time_range_start?: string;
  time_range_end?: string;
}

export interface InvestigationProgress {
  status: InvestigationStatus;
  progress_percentage: number;
  current_phase: string;
  entities_discovered: number;
  relationships_discovered: number;
  evidence_gathered: number;
  estimated_completion_time?: string;
}

export interface InvestigationStats {
  total_investigations: number;
  active_investigations: number;
  completed_investigations: number;
  failed_investigations: number;
}
