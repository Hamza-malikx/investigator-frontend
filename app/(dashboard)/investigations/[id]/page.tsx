// app/(dashboard)/investigations/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Network,
  FileText,
  Settings,
  ChevronRight,
  Download,
  Share2,
  Edit3,
  XCircle,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { formatRelativeTime } from "@/lib/utils";
import { EntitiesTab } from "@/components/investigation/EntitiesTab";
import { EvidenceTab } from "@/components/investigation/EvidenceTab";
import { ThoughtChainTab } from "@/components/investigation/ThoughtChainTab";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "entities", label: "Entities", icon: Network },
  { id: "evidence", label: "Evidence", icon: FileText },
  { id: "thinking", label: "AI Reasoning", icon: Brain },
  { id: "board", label: "Investigation Board", icon: Network },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusConfig = {
  pending: { color: "#6b7280", label: "Pending" },
  running: { color: "#6366f1", label: "Running" },
  paused: { color: "#f59e0b", label: "Paused" },
  completed: { color: "#10b981", label: "Completed" },
  failed: { color: "#ef4444", label: "Failed" },
};

const phaseConfig = {
  planning: { label: "Planning", color: "#6b7280" },
  researching: { label: "Researching", color: "#6366f1" },
  analyzing: { label: "Analyzing", color: "#8b5cf6" },
  reporting: { label: "Reporting", color: "#10b981" },
};

export default function InvestigationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const investigationId = params.id as string;

  const {
    currentInvestigation,
    isLoading,
    error,
    fetchInvestigation,
    pauseInvestigation,
    resumeInvestigation,
    cancelInvestigation,
    clearError,
  } = useInvestigation();

  const [activeTab, setActiveTab] = useState("overview");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  useEffect(() => {
    if (investigationId) {
      fetchInvestigation(investigationId);
    }
  }, [investigationId]);

  const handlePause = async () => {
    setIsActioning(true);
    try {
      await pauseInvestigation(investigationId);
      setIsActionMenuOpen(false);
    } catch (err) {
      console.error("Failed to pause investigation:", err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleResume = async () => {
    setIsActioning(true);
    try {
      await resumeInvestigation(investigationId);
      setIsActionMenuOpen(false);
    } catch (err) {
      console.error("Failed to resume investigation:", err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this investigation? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsActioning(true);
    try {
      await cancelInvestigation(investigationId);
      setIsActionMenuOpen(false);
      router.push("/investigations");
    } catch (err) {
      console.error("Failed to cancel investigation:", err);
      setIsActioning(false);
    }
  };

  // Loading state
  if (isLoading && !currentInvestigation) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1f2937] animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-[#1f2937] rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-[#1f2937] rounded w-3/4 animate-pulse" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] animate-pulse"
            >
              <div className="h-4 bg-[#1f2937] rounded w-20 mb-2" />
              <div className="h-8 bg-[#1f2937] rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentInvestigation) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
          Failed to Load Investigation
        </h3>
        <p className="text-[#6b7280] mb-6">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => router.push("/investigations")}
            variant="secondary"
          >
            Back to Investigations
          </Button>
          <Button
            onClick={() => {
              clearError();
              fetchInvestigation(investigationId);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!currentInvestigation) {
    return null;
  }

  const investigation = currentInvestigation;
  const statusColor = statusConfig[investigation.status].color;
  const phaseInfo = phaseConfig[investigation.current_phase];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/investigations"
            className="p-2 rounded-xl bg-[#111827] border border-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:border-[#374151] transition-all mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
                {investigation.title}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${statusColor}15`,
                  color: statusColor,
                  borderColor: `${statusColor}30`,
                }}
              >
                {statusConfig[investigation.status].label}
              </span>
              {investigation.current_phase && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  // style={{
                  //   backgroundColor: `${phaseInfo.color}15`,
                  //   color: phaseInfo.color,
                  //   borderColor: `${phaseInfo.color}30`,
                  // }}
                >
                  {/* {phaseInfo.label} */}
                </span>
              )}
            </div>
            <p className="text-[#9ca3af] max-w-2xl">
              {investigation.initial_query}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {investigation.status === "running" && (
            <Button
              variant="secondary"
              className="h-10"
              onClick={handlePause}
              disabled={isActioning}
            >
              <Pause className="w-4 h-4 mr-2" />
              {isActioning ? "Pausing..." : "Pause"}
            </Button>
          )}
          {investigation.status === "paused" && (
            <Button
              className="h-10"
              onClick={handleResume}
              disabled={isActioning}
            >
              <Play className="w-4 h-4 mr-2" />
              {isActioning ? "Resuming..." : "Resume"}
            </Button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="p-2.5 rounded-xl bg-[#111827] border border-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:border-[#374151] transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {isActionMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsActionMenuOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#111827] border border-[#1f2937] shadow-xl py-1 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-[#d1d5db] hover:bg-[#1f2937] flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Details
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#d1d5db] hover:bg-[#1f2937] flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#d1d5db] hover:bg-[#1f2937] flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                  <hr className="my-1 border-[#1f2937]" />
                  <button
                    onClick={handleCancel}
                    disabled={isActioning}
                    className="w-full px-4 py-2 text-left text-sm text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center gap-2 disabled:opacity-50"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {isActioning ? "Cancelling..." : "Cancel Investigation"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-500 font-medium">Action Failed</p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            Progress
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[#f9fafb]">
              {investigation.progress_percentage}%
            </span>
            <div className="flex-1 h-2 bg-[#1f2937] rounded-full mb-2">
              <div
                className="h-full rounded-full bg-[#6366f1] transition-all"
                style={{ width: `${investigation.progress_percentage}%` }}
              />
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Confidence
          </div>
          <span className="text-2xl font-bold text-[#f9fafb]">
            {(investigation.confidence_score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <Clock className="w-4 h-4" />
            {investigation.status === "completed"
              ? "Completed"
              : "Est. Completion"}
          </div>
          <span className="text-sm font-bold text-[#f9fafb]">
            {investigation.estimated_completion
              ? new Date(
                  investigation.estimated_completion,
                ).toLocaleDateString()
              : investigation.completed_at
                ? formatRelativeTime(investigation.completed_at)
                : "Pending"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <Network className="w-4 h-4" />
            Entities Found
          </div>
          <span className="text-2xl font-bold text-[#f9fafb]">
            {investigation.entities_count}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1f2937]">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "entities"
                ? investigation.entities_count
                : tab.id === "evidence"
                  ? investigation.evidence_count
                  : undefined;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#6366f1] text-[#6366f1]"
                    : "border-transparent text-[#6b7280] hover:text-[#9ca3af]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {count !== undefined && count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1f2937] text-xs text-[#9ca3af]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan info */}
              {investigation.plan && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                  <h3 className="text-lg font-semibold text-[#f9fafb] mb-4">
                    Investigation Plan
                  </h3>

                  {investigation.plan.hypothesis && (
                    <div className="mb-4 p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]/50">
                      <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                        Working Hypothesis
                      </h4>
                      <p className="text-[#d1d5db] text-sm leading-relaxed">
                        {investigation.plan.hypothesis}
                      </p>
                    </div>
                  )}

                  {investigation.plan.priority_areas &&
                    investigation.plan.priority_areas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-[#6b7280] mb-3">
                          Priority Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {investigation.plan.priority_areas.map(
                            (area, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-lg bg-[#6366f1]/10 text-[#818cf8] text-sm border border-[#6366f1]/20"
                              >
                                {typeof area === "string"
                                  ? area
                                  : area.focus || "Priority Area"}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Active subtasks */}
              {investigation.subtasks && investigation.subtasks.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                  <h3 className="text-lg font-semibold text-[#f9fafb] mb-4">
                    Active Tasks
                  </h3>
                  <div className="space-y-3">
                    {investigation.subtasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              task.status === "completed"
                                ? "bg-[#10b981]"
                                : task.status === "in_progress"
                                  ? "bg-[#6366f1] animate-pulse"
                                  : "bg-[#6b7280]"
                            }`}
                          />
                          <div>
                            <p className="text-sm text-[#d1d5db]">
                              {task.description}
                            </p>
                            <p className="text-xs text-[#6b7280] capitalize">
                              {task.task_type.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>
                        {task.confidence > 0 && (
                          <span className="text-xs text-[#6b7280]">
                            {(task.confidence * 100).toFixed(0)}% confidence
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-lg font-semibold text-[#f9fafb] mb-4">
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] mt-2" />
                    <div>
                      <p className="text-sm text-[#d1d5db]">
                        Investigation Created
                      </p>
                      <p className="text-xs text-[#6b7280]">
                        {formatRelativeTime(investigation.created_at)}
                      </p>
                    </div>
                  </div>
                  {investigation.started_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#6366f1] mt-2" />
                      <div>
                        <p className="text-sm text-[#d1d5db]">
                          Investigation Started
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          {formatRelativeTime(investigation.started_at)}
                        </p>
                      </div>
                    </div>
                  )}
                  {investigation.completed_at && (
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          investigation.status === "completed"
                            ? "bg-[#10b981]"
                            : "bg-[#ef4444]"
                        }`}
                      />
                      <div>
                        <p className="text-sm text-[#d1d5db]">
                          Investigation{" "}
                          {investigation.status === "completed"
                            ? "Completed"
                            : "Ended"}
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          {formatRelativeTime(investigation.completed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cost tracking */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-4">
                  Resource Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#9ca3af]">API Calls</span>
                      <span className="text-[#f9fafb]">
                        {investigation?.total_api_calls?.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-[#6366f1] rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#1f2937]">
                    <span className="text-[#9ca3af]">Total Cost</span>
                    <span className="text-xl font-bold text-[#10b981]">
                      ${investigation.total_cost_usd}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-4">
                  Discovery Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9ca3af]">Entities</span>
                    <span className="text-lg font-bold text-[#f9fafb]">
                      {investigation.entities_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9ca3af]">
                      Relationships
                    </span>
                    <span className="text-lg font-bold text-[#f9fafb]">
                      {investigation.relationships_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9ca3af]">Evidence</span>
                    <span className="text-lg font-bold text-[#f9fafb]">
                      {investigation.evidence_count}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20">
                <h3 className="text-sm font-medium text-[#f9fafb] mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href={`/investigations/${investigationId}/board`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]/50 hover:bg-[#0a0f1e] transition-colors group"
                  >
                    <span className="text-sm text-[#d1d5db]">
                      Open Investigation Board
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#818cf8] group-hover:translate-x-1 transition-all" />
                  </Link>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]/50 hover:bg-[#0a0f1e] transition-colors group">
                    <span className="text-sm text-[#d1d5db]">
                      Generate Report
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#818cf8] group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "entities" && (
          <EntitiesTab investigationId={investigationId} />
        )}

        {activeTab === "evidence" && (
          <EvidenceTab investigationId={investigationId} />
        )}

        {activeTab === "thinking" && (
          <ThoughtChainTab investigationId={investigationId} />
        )}

        {activeTab === "board" && (
          <div className="text-center py-16">
            <Network className="w-16 h-16 mx-auto mb-4 text-[#6b7280]" />
            <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
              Investigation Board
            </h3>
            <p className="text-[#6b7280] mb-6">
              Interactive graph visualization with{" "}
              {investigation.entities_count} entities and{" "}
              {investigation.relationships_count} relationships
            </p>
            <Link href={`/investigations/${investigationId}/board`}>
              <Button>
                <Network className="w-4 h-4 mr-2" />
                Open Full Board
              </Button>
            </Link>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-16">
            <Settings className="w-16 h-16 mx-auto mb-4 text-[#6b7280]" />
            <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
              Settings Tab
            </h3>
            <p className="text-[#6b7280]">
              Investigation configuration options coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
