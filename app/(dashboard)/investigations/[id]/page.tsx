// src/app/(dashboard)/investigations/[id]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock investigation detail matching backend structure
const investigationDetail = {
  id: "inv_001",
  title: "Financial Fraud Analysis - Q4 2024",
  initial_query:
    "Analyze cross-border transaction patterns for suspicious activity in Q4 2024",
  status: "running",
  current_phase: "analyzing",
  progress_percentage: 78,
  confidence_score: 0.89,
  started_at: "2024-01-15T10:30:00Z",
  estimated_completion: "2024-01-16T14:00:00Z",
  total_api_calls: 1247,
  total_cost_usd: "12.45",
  entities_count: 47,
  relationships_count: 128,
  evidence_count: 234,
  plan: {
    research_strategy: [
      { step: 1, action: "Initial data collection", status: "completed" },
      {
        step: 2,
        action: "Entity extraction from transactions",
        status: "completed",
      },
      { step: 3, action: "Relationship mapping", status: "in_progress" },
      { step: 4, action: "Anomaly detection", status: "pending" },
      { step: 5, action: "Report generation", status: "pending" },
    ],
    hypothesis:
      "Suspicious circular trading patterns between offshore entities",
    priority_areas: [
      "Offshore accounts",
      "Shell companies",
      "Transaction timing",
    ],
  },
  subtasks: [
    {
      id: "task_001",
      task_type: "web_search",
      description: "Search for registered offshore entities",
      status: "completed",
      confidence: 0.92,
    },
    {
      id: "task_002",
      task_type: "document_analysis",
      description: "Analyze transaction records for patterns",
      status: "completed",
      confidence: 0.88,
    },
    {
      id: "task_003",
      task_type: "entity_extraction",
      description: "Extract beneficial owners from corporate records",
      status: "in_progress",
      confidence: 0.76,
    },
    {
      id: "task_004",
      task_type: "relationship_mapping",
      description: "Map ownership structures and control relationships",
      status: "pending",
      confidence: 0.0,
    },
  ],
};

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "entities", label: "Entities", icon: Network, count: 47 },
  { id: "evidence", label: "Evidence", icon: FileText, count: 234 },
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

export default function InvestigationDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const statusColor =
    statusConfig[investigationDetail.status as keyof typeof statusConfig].color;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
                {investigationDetail.title}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${statusColor}15`,
                  color: statusColor,
                  borderColor: `${statusColor}30`,
                }}
              >
                {
                  statusConfig[
                    investigationDetail.status as keyof typeof statusConfig
                  ].label
                }
              </span>
            </div>
            <p className="text-[#9ca3af] max-w-2xl">
              {investigationDetail.initial_query}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {investigationDetail.status === "running" && (
            <Button variant="secondary" className="h-10">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          {investigationDetail.status === "paused" && (
            <Button className="h-10">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          <Button variant="secondary" className="h-10">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
          <div className="relative">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="p-2.5 rounded-xl bg-[#111827] border border-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:border-[#374151] transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {isActionMenuOpen && (
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
                <button className="w-full px-4 py-2 text-left text-sm text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cancel Investigation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            Progress
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[#f9fafb]">
              {investigationDetail.progress_percentage}%
            </span>
            <div className="flex-1 h-2 bg-[#1f2937] rounded-full mb-2">
              <div
                className="h-full rounded-full bg-[#6366f1] transition-all"
                style={{ width: `${investigationDetail.progress_percentage}%` }}
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
            {(investigationDetail.confidence_score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <Clock className="w-4 h-4" />
            Est. Completion
          </div>
          <span className="text-2xl font-bold text-[#f9fafb]">
            {new Date(
              investigationDetail.estimated_completion,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937]">
          <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
            <Network className="w-4 h-4" />
            Entities Found
          </div>
          <span className="text-2xl font-bold text-[#f9fafb]">
            {investigationDetail.entities_count}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1f2937]">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#6366f1] text-[#6366f1]"
                    : "border-transparent text-[#6b7280] hover:text-[#9ca3af]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1f2937] text-xs text-[#9ca3af]">
                    {tab.count}
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
              {/* Research strategy */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-lg font-semibold text-[#f9fafb] mb-4">
                  Research Strategy
                </h3>
                <div className="space-y-3">
                  {investigationDetail.plan.research_strategy.map(
                    (step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0f1e] border border-[#374151]/50"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.status === "completed"
                              ? "bg-[#10b981]/20 text-[#10b981]"
                              : step.status === "in_progress"
                                ? "bg-[#6366f1]/20 text-[#6366f1]"
                                : "bg-[#1f2937] text-[#6b7280]"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            step.step
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${step.status === "completed" ? "text-[#9ca3af] line-through" : "text-[#d1d5db]"}`}
                          >
                            {step.action}
                          </p>
                        </div>
                        {step.status === "in_progress" && (
                          <div className="w-16 h-1 bg-[#1f2937] rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-[#6366f1] rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Active subtasks */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-lg font-semibold text-[#f9fafb] mb-4">
                  Active Tasks
                </h3>
                <div className="space-y-3">
                  {investigationDetail.subtasks.map((task) => (
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
                            {task.task_type.replace("_", " ")}
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Hypothesis */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-3">
                  Working Hypothesis
                </h3>
                <p className="text-[#d1d5db] text-sm leading-relaxed">
                  {investigationDetail.plan.hypothesis}
                </p>
              </div>

              {/* Priority areas */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-3">
                  Priority Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {investigationDetail.plan.priority_areas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1.5 rounded-lg bg-[#6366f1]/10 text-[#818cf8] text-sm border border-[#6366f1]/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

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
                        {investigationDetail.total_api_calls.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-[#6366f1] rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#1f2937]">
                    <span className="text-[#9ca3af]">Total Cost</span>
                    <span className="text-xl font-bold text-[#10b981]">
                      ${investigationDetail.total_cost_usd}
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
                    href={`/investigations/${params.id}/entities`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]/50 hover:bg-[#0a0f1e] transition-colors group"
                  >
                    <span className="text-sm text-[#d1d5db]">
                      View All Entities
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#818cf8] group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href={`/investigations/${params.id}/board`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]/50 hover:bg-[#0a0f1e] transition-colors group"
                  >
                    <span className="text-sm text-[#d1d5db]">
                      Open Investigation Board
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#818cf8] group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "entities" && (
          <div className="text-center py-16">
            <Network className="w-16 h-16 mx-auto mb-4 text-[#6b7280]" />
            <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
              Entities Tab
            </h3>
            <p className="text-[#6b7280]">
              Entity list and management would appear here
            </p>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-[#6b7280]" />
            <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
              Evidence Tab
            </h3>
            <p className="text-[#6b7280]">
              Evidence collection and documents would appear here
            </p>
          </div>
        )}

        {activeTab === "board" && (
          <div className="text-center py-16">
            <Network className="w-16 h-16 mx-auto mb-4 text-[#6b7280]" />
            <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
              Investigation Board
            </h3>
            <p className="text-[#6b7280]">
              Interactive graph visualization would appear here
            </p>
            <Link href={`/investigations/${params.id}/board`}>
              <Button className="mt-4">Open Full Board</Button>
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
              Investigation configuration options would appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
