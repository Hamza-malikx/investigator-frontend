// app/(dashboard)/investigations/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  BarChart3,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock data matching backend structure
const investigations = [
  {
    id: "inv_001",
    title: "Financial Fraud Analysis - Q4 2024",
    initial_query:
      "Analyze cross-border transaction patterns for suspicious activity",
    status: "running",
    current_phase: "analyzing",
    progress_percentage: 78,
    confidence_score: 0.89,
    entities_count: 47,
    relationships_count: 128,
    evidence_count: 234,
    started_at: "2024-01-15T10:30:00Z",
    estimated_completion: "2024-01-16T14:00:00Z",
    created_at: "2024-01-15T10:30:00Z",
    total_api_calls: 1247,
    total_cost_usd: "12.45",
  },
  {
    id: "inv_002",
    title: "Corporate Due Diligence - TechCorp Acquisition",
    initial_query:
      "Comprehensive background check on TechCorp executives and subsidiaries",
    status: "running",
    current_phase: "researching",
    progress_percentage: 45,
    confidence_score: 0.72,
    entities_count: 23,
    relationships_count: 67,
    evidence_count: 89,
    started_at: "2024-01-14T09:00:00Z",
    estimated_completion: "2024-01-17T18:00:00Z",
    created_at: "2024-01-14T09:00:00Z",
    total_api_calls: 534,
    total_cost_usd: "5.34",
  },
  {
    id: "inv_003",
    title: "IP Theft Investigation - Source Code Leak",
    initial_query:
      "Trace the source of proprietary code appearing on public repositories",
    status: "completed",
    current_phase: "reporting",
    progress_percentage: 100,
    confidence_score: 0.94,
    entities_count: 12,
    relationships_count: 34,
    evidence_count: 156,
    started_at: "2024-01-10T14:00:00Z",
    completed_at: "2024-01-13T16:30:00Z",
    created_at: "2024-01-10T14:00:00Z",
    total_api_calls: 2890,
    total_cost_usd: "28.90",
  },
  {
    id: "inv_004",
    title: "Supply Chain Risk Assessment",
    initial_query:
      "Map vendor relationships and identify single points of failure",
    status: "paused",
    current_phase: "researching",
    progress_percentage: 32,
    confidence_score: 0.61,
    entities_count: 89,
    relationships_count: 234,
    evidence_count: 45,
    started_at: "2024-01-12T11:00:00Z",
    estimated_completion: "2024-01-18T12:00:00Z",
    created_at: "2024-01-12T11:00:00Z",
    total_api_calls: 892,
    total_cost_usd: "8.92",
  },
  {
    id: "inv_005",
    title: "Political Influence Network Analysis",
    initial_query:
      "Identify lobbying connections and campaign finance patterns",
    status: "pending",
    current_phase: "planning",
    progress_percentage: 0,
    confidence_score: 0.0,
    entities_count: 0,
    relationships_count: 0,
    evidence_count: 0,
    created_at: "2024-01-15T16:45:00Z",
    total_api_calls: 0,
    total_cost_usd: "0.00",
  },
  {
    id: "inv_006",
    title: "Cryptocurrency Wallet Tracing",
    initial_query: "Follow Bitcoin transactions from flagged exchange accounts",
    status: "failed",
    current_phase: "analyzing",
    progress_percentage: 67,
    confidence_score: 0.45,
    entities_count: 156,
    relationships_count: 423,
    evidence_count: 0,
    started_at: "2024-01-08T09:30:00Z",
    completed_at: "2024-01-10T11:20:00Z",
    created_at: "2024-01-08T09:30:00Z",
    total_api_calls: 3421,
    total_cost_usd: "34.21",
  },
];

const statusConfig = {
  pending: { icon: Clock, color: "#6b7280", bg: "#374151", label: "Pending" },
  running: { icon: Play, color: "#6366f1", bg: "#6366f1", label: "Running" },
  paused: { icon: Pause, color: "#f59e0b", bg: "#f59e0b", label: "Paused" },
  completed: {
    icon: CheckCircle2,
    color: "#10b981",
    bg: "#10b981",
    label: "Completed",
  },
  failed: { icon: XCircle, color: "#ef4444", bg: "#ef4444", label: "Failed" },
};

const phaseConfig = {
  planning: { label: "Planning", color: "#6b7280" },
  researching: { label: "Researching", color: "#6366f1" },
  analyzing: { label: "Analyzing", color: "#8b5cf6" },
  reporting: { label: "Reporting", color: "#10b981" },
};

export default function InvestigationsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    const matchesSearch =
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.initial_query.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const runningCount = investigations.filter(
    (i) => i.status === "running",
  ).length;
  const completedCount = investigations.filter(
    (i) => i.status === "completed",
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
            Investigations
          </h1>
          <p className="text-[#9ca3af] mt-1">
            Manage and monitor your active research projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] border border-[#1f2937]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
              <span className="text-sm text-[#9ca3af]">
                {runningCount} running
              </span>
            </div>
            <div className="w-px h-4 bg-[#374151]" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span className="text-sm text-[#9ca3af]">
                {completedCount} completed
              </span>
            </div>
          </div>
          <Link href="/investigations/new">
            <Button className="h-11">
              <Plus className="w-4 h-4 mr-2" />
              New Investigation
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search investigations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1]"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111827] border border-[#1f2937]">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[#1f2937] text-[#f9fafb]"
                  : "text-[#6b7280] hover:text-[#9ca3af]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[#1f2937] text-[#f9fafb]"
                  : "text-[#6b7280] hover:text-[#9ca3af]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Investigations list */}
      <div
        className={
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredInvestigations.map((investigation) => {
          const StatusIcon =
            statusConfig[investigation.status as keyof typeof statusConfig]
              .icon;
          const statusColor =
            statusConfig[investigation.status as keyof typeof statusConfig]
              .color;
          const phaseInfo =
            phaseConfig[
              investigation.current_phase as keyof typeof phaseConfig
            ];

          return (
            <Link
              key={investigation.id}
              href={`/investigations/${investigation.id}`}
              className={`group block bg-[#111827] border border-[#1f2937] hover:border-[#374151] rounded-2xl transition-all duration-300 ${
                viewMode === "list" ? "p-5" : "p-6"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${statusColor}15` }}
                  >
                    <StatusIcon
                      className="w-5 h-5"
                      style={{ color: statusColor }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                      }}
                    >
                      {
                        statusConfig[
                          investigation.status as keyof typeof statusConfig
                        ].label
                      }
                    </span>
                    <p className="text-xs text-[#6b7280] mt-1">
                      {phaseInfo?.label || "Unknown"}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Title & description */}
              <h3 className="font-semibold text-[#f9fafb] mb-2 line-clamp-1 group-hover:text-[#818cf8] transition-colors">
                {investigation.title}
              </h3>
              <p className="text-sm text-[#6b7280] mb-4 line-clamp-2">
                {investigation.initial_query}
              </p>

              {/* Progress */}
              {investigation.status !== "pending" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#6b7280]">Progress</span>
                    <span className="text-[#f9fafb] font-medium">
                      {investigation.progress_percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${investigation.progress_percentage}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div
                className={`flex items-center gap-4 text-sm text-[#6b7280] ${viewMode === "grid" ? "flex-wrap" : ""}`}
              >
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>{investigation.entities_count} entities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {investigation.status === "completed"
                      ? "Completed"
                      : investigation.estimated_completion
                        ? "Est. " +
                          new Date(
                            investigation.estimated_completion,
                          ).toLocaleDateString()
                        : "Pending"}
                  </span>
                </div>
                {investigation.status === "running" && (
                  <div className="flex items-center gap-1.5 text-[#6366f1]">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span>Live</span>
                  </div>
                )}
              </div>

              {/* Cost indicator */}
              <div className="mt-4 pt-4 border-t border-[#1f2937] flex items-center justify-between text-xs">
                <span className="text-[#6b7280]">
                  {investigation.total_api_calls.toLocaleString()} API calls
                </span>
                <span className="text-[#10b981] font-medium">
                  ${investigation.total_cost_usd}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredInvestigations.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1f2937] flex items-center justify-center">
            <Search className="w-8 h-8 text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
            No investigations found
          </h3>
          <p className="text-[#6b7280] mb-6">
            Try adjusting your filters or create a new investigation
          </p>
          <Link href="/investigations/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Investigation
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
