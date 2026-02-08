// src/app/(dashboard)/investigations/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  BarChart3,
  LayoutGrid,
  List,
  Trash2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { formatRelativeTime } from "@/lib/utils";
import { Investigation } from "@/types/investigation";

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
  const {
    investigations,
    isLoading,
    error,
    fetchInvestigations,
    pauseInvestigation,
    resumeInvestigation,
    deleteInvestigation,
    clearError,
  } = useInvestigation();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestigations();
  }, []);

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

  const handlePause = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActioningId(id);
    try {
      await pauseInvestigation(id);
    } catch (err) {
      console.error("Failed to pause investigation:", err);
    } finally {
      setActioningId(null);
      setShowActions(null);
    }
  };

  const handleResume = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActioningId(id);
    try {
      await resumeInvestigation(id);
    } catch (err) {
      console.error("Failed to resume investigation:", err);
    } finally {
      setActioningId(null);
      setShowActions(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this investigation? This action cannot be undone.",
      )
    ) {
      return;
    }

    setActioningId(id);
    try {
      await deleteInvestigation(id);
    } catch (err) {
      console.error("Failed to delete investigation:", err);
    } finally {
      setActioningId(null);
      setShowActions(null);
    }
  };

  const InvestigationCard = ({
    investigation,
  }: {
    investigation: Investigation;
  }) => {
    const StatusIcon = statusConfig[investigation.status].icon;
    const statusColor = statusConfig[investigation.status].color;
    const phaseInfo = phaseConfig[investigation.current_phase];
    const isActioning = actioningId === investigation.id;

    return (
      <div className="group relative">
        <Link
          href={`/investigations/${investigation.id}`}
          className={`block bg-[#111827] border border-[#1f2937] hover:border-[#374151] rounded-2xl transition-all duration-300 ${
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
                  {statusConfig[investigation.status].label}
                </span>
                <p className="text-xs text-[#6b7280] mt-1">
                  {phaseInfo?.label || "Unknown"}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowActions(
                    showActions === investigation.id ? null : investigation.id,
                  );
                }}
                className="p-2 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showActions === investigation.id && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActions(null);
                    }}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111827] border border-[#1f2937] shadow-xl z-50 overflow-hidden">
                    <Link
                      href={`/investigations/${investigation.id}/board`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(null);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Investigation
                    </Link>

                    {investigation.status === "running" && (
                      <button
                        onClick={(e) => handlePause(investigation.id, e)}
                        disabled={isActioning}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all disabled:opacity-50"
                      >
                        <Pause className="w-4 h-4" />
                        {isActioning ? "Pausing..." : "Pause Investigation"}
                      </button>
                    )}

                    {investigation.status === "paused" && (
                      <button
                        onClick={(e) => handleResume(investigation.id, e)}
                        disabled={isActioning}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        {isActioning ? "Resuming..." : "Resume Investigation"}
                      </button>
                    )}

                    <div className="border-t border-[#1f2937]" />

                    <button
                      onClick={(e) => handleDelete(investigation.id, e)}
                      disabled={isActioning}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isActioning ? "Deleting..." : "Delete Investigation"}
                    </button>
                  </div>
                </>
              )}
            </div>
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
              <span>{formatRelativeTime(investigation.created_at)}</span>
            </div>
            {investigation.status === "running" && (
              <div className="flex items-center gap-1.5 text-[#6366f1]">
                <AlertCircle className="w-4 h-4 animate-pulse" />
                <span>Live</span>
              </div>
            )}
          </div>

          {/* Cost indicator */}
          {/* <div className="mt-4 pt-4 border-t border-[#1f2937] flex items-center justify-between text-xs">
            <span className="text-[#6b7280]">
              {investigation.total_api_calls.toLocaleString()} API calls
            </span>
            <span className="text-[#10b981] font-medium">
              ${investigation.total_cost_usd}
            </span>
          </div> */}
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-500 font-medium">
              Failed to Load Investigations
            </p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
          <button
            onClick={() => {
              clearError();
              fetchInvestigations();
            }}
            className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* Loading State */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`bg-[#111827] border border-[#1f2937] rounded-2xl animate-pulse ${
                viewMode === "list" ? "p-5" : "p-6"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1f2937]" />
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-[#1f2937] rounded" />
                    <div className="h-3 w-12 bg-[#1f2937] rounded" />
                  </div>
                </div>
              </div>
              <div className="h-5 bg-[#1f2937] rounded mb-2" />
              <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-4" />
              <div className="h-2 bg-[#1f2937] rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-[#1f2937] rounded" />
                <div className="h-4 w-24 bg-[#1f2937] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredInvestigations.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1f2937] flex items-center justify-center">
            <Search className="w-8 h-8 text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
            No investigations found
          </h3>
          <p className="text-[#6b7280] mb-6">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters or search query"
              : "Create your first investigation to get started"}
          </p>
          <Link href="/investigations/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Investigation
            </Button>
          </Link>
        </div>
      ) : (
        /* Investigations list */
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredInvestigations.map((investigation) => (
            <InvestigationCard
              key={investigation.id}
              investigation={investigation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
