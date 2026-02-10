// components/investigation/ThoughtChainTab.tsx
"use client";

import { useEffect } from "react";
import {
  Brain,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useThoughtChain } from "@/lib/hooks/useThoughtChain";
import { ThoughtType, TimelineThought } from "@/lib/api/thoughtChain";
import { Button } from "@/components/ui/Button";

interface ThoughtChainTabProps {
  investigationId: string;
}

// Icon and color mapping for thought types
const thoughtTypeConfig: Record<
  ThoughtType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
  }
> = {
  observation: {
    icon: Eye,
    color: "#6366f1",
    bgColor: "#6366f1",
    borderColor: "#6366f1",
    label: "Observation",
  },
  hypothesis: {
    icon: Lightbulb,
    color: "#8b5cf6",
    bgColor: "#8b5cf6",
    borderColor: "#8b5cf6",
    label: "Hypothesis",
  },
  question: {
    icon: HelpCircle,
    color: "#f59e0b",
    bgColor: "#f59e0b",
    borderColor: "#f59e0b",
    label: "Question",
  },
  conclusion: {
    icon: CheckCircle2,
    color: "#10b981",
    bgColor: "#10b981",
    borderColor: "#10b981",
    label: "Conclusion",
  },
  correction: {
    icon: AlertTriangle,
    color: "#ef4444",
    bgColor: "#ef4444",
    borderColor: "#ef4444",
    label: "Correction",
  },
};

function ConfidenceIndicator({
  before,
  after,
}: {
  before: number;
  after: number;
}) {
  const change = after - before;
  const percentChange = Math.round(change * 100);
  const hasChange = Math.abs(change) > 0.01;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6b7280]">Confidence:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366f1] rounded-full transition-all"
                style={{ width: `${before * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#9ca3af] w-10">
              {Math.round(before * 100)}%
            </span>
          </div>

          {hasChange && (
            <>
              <ArrowRight className="w-3 h-3 text-[#6b7280]" />
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${after * 100}%`,
                      backgroundColor:
                        change > 0
                          ? "#10b981"
                          : change < 0
                            ? "#ef4444"
                            : "#6366f1",
                    }}
                  />
                </div>
                <span className="text-xs text-[#f9fafb] font-medium w-10">
                  {Math.round(after * 100)}%
                </span>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  change > 0
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "bg-[#ef4444]/10 text-[#ef4444]"
                }`}
              >
                {change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {percentChange > 0 ? "+" : ""}
                {percentChange}%
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ThoughtCard({
  thought,
  index,
}: {
  thought: TimelineThought;
  index: number;
}) {
  const config = thoughtTypeConfig[thought.type];
  const Icon = config.icon;

  return (
    <div className="flex gap-4 group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
          style={{
            backgroundColor: `${config.bgColor}15`,
            border: `2px solid ${config.borderColor}30`,
          }}
        >
          <Icon
            className="w-5 h-5"
            // style={{ color: config.color }}
          />
        </div>
        <div
          className="w-0.5 flex-1 mt-2"
          style={{
            background: `linear-gradient(to bottom, ${config.borderColor}30, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                style={{
                  backgroundColor: `${config.bgColor}15`,
                  color: config.color,
                  borderColor: `${config.borderColor}30`,
                }}
              >
                {config.label}
              </span>
              <span className="text-xs text-[#6b7280]">
                Step {thought.sequence}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <Clock className="w-3.5 h-3.5" />
              {new Date(thought.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-[#d1d5db] leading-relaxed mb-3">
            {thought.content}
          </p>

          {/* Confidence */}
          <ConfidenceIndicator
            before={thought.confidence_before}
            after={thought.confidence_after}
          />
        </div>
      </div>
    </div>
  );
}

export function ThoughtChainTab({ investigationId }: ThoughtChainTabProps) {
  const { timeline, isLoadingTimeline, error, fetchTimeline, clearError } =
    useThoughtChain();

  useEffect(() => {
    if (investigationId) {
      fetchTimeline(investigationId);
    }
  }, [investigationId, fetchTimeline]);

  const handleRefresh = () => {
    fetchTimeline(investigationId);
  };

  // Loading state
  if (isLoadingTimeline && !timeline) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-[#1f2937] rounded animate-pulse" />
          <div className="h-10 w-24 bg-[#1f2937] rounded-xl animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-[#1f2937]" />
              <div className="flex-1">
                <div className="h-32 rounded-xl bg-[#1f2937]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !timeline) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
          Failed to Load Thought Chain
        </h3>
        <p className="text-[#6b7280] mb-6">{error}</p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (!timeline || timeline.timeline.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center">
          <Brain className="w-8 h-8 text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
          No Thoughts Yet
        </h3>
        <p className="text-[#6b7280] mb-6">
          The AI agent hasn&apos;t started reasoning about this investigation
          yet. Thoughts will appear here as the investigation progresses.
        </p>
      </div>
    );
  }

  // Calculate stats
  const thoughtTypeBreakdown = timeline.timeline.reduce(
    (acc, thought) => {
      acc[thought.type] = (acc[thought.type] || 0) + 1;
      return acc;
    },
    {} as Record<ThoughtType, number>,
  );

  const avgConfidenceGain =
    timeline.timeline.reduce(
      (sum, t) => sum + (t.confidence_after - t.confidence_before),
      0,
    ) / timeline.timeline.length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-[#818cf8]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#f9fafb]">
              AI Reasoning Chain
            </h2>
            <p className="text-sm text-[#6b7280]">
              {timeline.total_thoughts} thoughts traced
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={handleRefresh}
          disabled={isLoadingTimeline}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoadingTimeline ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(thoughtTypeConfig).map(([type, config]) => {
          const count = thoughtTypeBreakdown[type as ThoughtType] || 0;
          if (count === 0) return null;

          const Icon = config.icon;

          return (
            <div
              key={type}
              className="p-4 rounded-xl border transition-all hover:scale-105"
              style={{
                backgroundColor: `${config.bgColor}05`,
                borderColor: `${config.borderColor}20`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className="w-4 h-4"
                  // style={{ color: config.color }}
                />
                <span className="text-xs text-[#6b7280]">{config.label}</span>
              </div>
              <span className="text-2xl font-bold text-[#f9fafb]">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Confidence insight */}
      {avgConfidenceGain !== 0 && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            avgConfidenceGain > 0
              ? "bg-[#10b981]/5 border-[#10b981]/20"
              : "bg-[#f59e0b]/5 border-[#f59e0b]/20"
          }`}
        >
          <Sparkles
            className="w-5 h-5 flex-shrink-0"
            style={{ color: avgConfidenceGain > 0 ? "#10b981" : "#f59e0b" }}
          />
          <div>
            <p className="text-sm font-medium text-[#f9fafb]">
              {avgConfidenceGain > 0
                ? "Average confidence increased"
                : "Average confidence decreased"}
            </p>
            <p className="text-xs text-[#6b7280]">
              {avgConfidenceGain > 0 ? "+" : ""}
              {(avgConfidenceGain * 100).toFixed(1)}% per thought on average
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="space-y-0">
          {timeline.timeline.map((thought, index) => (
            <ThoughtCard key={thought.id} thought={thought} index={index} />
          ))}
        </div>

        {/* End marker */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#6b7280] italic">
              End of reasoning chain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
