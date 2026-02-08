// components/investigation/EvidenceTab.tsx
"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Globe,
  File,
  Database,
  Edit3,
  ExternalLink,
  Shield,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useEvidence } from "@/lib/hooks/useEntity";
import { formatRelativeTime } from "@/lib/utils";
import type { EvidenceType, SourceCredibility } from "@/types/entity";

interface EvidenceTabProps {
  investigationId: string;
}

const evidenceTypeConfig: Record<
  EvidenceType,
  { icon: unknown; color: string; label: string }
> = {
  web_page: { icon: Globe, color: "#6366f1", label: "Web Page" },
  document: { icon: File, color: "#8b5cf6", label: "Document" },
  api_response: { icon: Database, color: "#10b981", label: "API" },
  database: { icon: Database, color: "#3b82f6", label: "Database" },
  manual_entry: { icon: Edit3, color: "#f59e0b", label: "Manual" },
};

const credibilityConfig: Record<
  SourceCredibility,
  { icon: unknown; color: string; label: string }
> = {
  high: { icon: CheckCircle2, color: "#10b981", label: "High" },
  medium: { icon: AlertTriangle, color: "#f59e0b", label: "Medium" },
  low: { icon: XCircle, color: "#ef4444", label: "Low" },
};

export function EvidenceTab({ investigationId }: EvidenceTabProps) {
  const { evidence, isLoading, error, fetchEvidence, clearError } =
    useEvidence();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EvidenceType | "all">("all");
  const [sortBy, setSortBy] = useState<"credibility" | "date">("date");

  useEffect(() => {
    fetchEvidence(investigationId);
  }, [investigationId]);

  const filteredEvidence = evidence
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.source_url &&
          item.source_url.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType =
        filterType === "all" || item.evidence_type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "credibility") {
        const credibilityOrder = { high: 3, medium: 2, low: 1 };
        return (
          credibilityOrder[b.source_credibility] -
          credibilityOrder[a.source_credibility]
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const typeBreakdown = evidence.reduce(
    (acc, item) => {
      acc[item.evidence_type] = (acc[item.evidence_type] || 0) + 1;
      return acc;
    },
    {} as Record<EvidenceType, number>,
  );

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
          Failed to Load Evidence
        </h3>
        <p className="text-[#6b7280] mb-6">{error}</p>
        <button
          onClick={() => {
            clearError();
            fetchEvidence(investigationId);
          }}
          className="px-4 py-2 rounded-xl bg-[#6366f1] text-white hover:bg-[#5558e3] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.keys(evidenceTypeConfig) as EvidenceType[]).map((type) => {
          const config = evidenceTypeConfig[type];
          const Icon = config.icon;
          const count = typeBreakdown[type] || 0;

          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              className={`p-4 rounded-xl border transition-all ${
                filterType === type
                  ? "bg-[#6366f1]/10 border-[#6366f1]"
                  : "bg-[#111827] border-[#1f2937] hover:border-[#374151]"
              }`}
            >
              {/* <div
                className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div> */}
              <div className="text-left">
                <p className="text-2xl font-bold text-[#f9fafb]">{count}</p>
                <p className="text-xs text-[#6b7280]">{config.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search evidence by title or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "credibility" | "date")}
          className="h-11 px-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1]"
        >
          <option value="date">Sort by Date</option>
          <option value="credibility">Sort by Credibility</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#111827] border border-[#1f2937] animate-pulse"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1f2937]" />
                <div className="flex-1">
                  <div className="h-5 bg-[#1f2937] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#1f2937] rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-[#1f2937] rounded w-full mb-2" />
              <div className="h-4 bg-[#1f2937] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1f2937] flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
            No Evidence Found
          </h3>
          <p className="text-[#6b7280]">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your filters"
              : "Evidence will be collected as the investigation progresses"}
          </p>
        </div>
      ) : (
        /* Evidence List */
        <div className="space-y-4">
          {filteredEvidence.map((item) => {
            const typeConfig = evidenceTypeConfig[item.evidence_type];
            const TypeIcon = typeConfig.icon;
            const credConfig = credibilityConfig[item.source_credibility];
            const CredIcon = credConfig.icon;

            return (
              <div
                key={item.id}
                className="group p-5 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  {/* <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${typeConfig.color}15` }}
                  >
                    <TypeIcon
                      className="w-5 h-5"
                      style={{ color: typeConfig.color }}
                    />
                  </div> */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-semibold text-[#f9fafb] group-hover:text-[#818cf8] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatRelativeTime(item.created_at)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1f2937]">
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Source URL */}
                {item.source_url && (
                  <div className="mb-4 p-3 rounded-lg bg-[#0a0f1e] border border-[#374151]/50">
                    <p className="text-xs text-[#6b7280] mb-1">Source</p>
                    <p className="text-sm text-[#9ca3af] truncate">
                      {item.source_url}
                    </p>
                  </div>
                )}

                {/* Credibility Badge */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: `${credConfig.color}15`,
                      borderColor: `${credConfig.color}30`,
                    }}
                  >
                    {/* <CredIcon
                      className="w-4 h-4"
                      style={{ color: credConfig.color }}
                    /> */}
                    <div>
                      <p className="text-xs text-[#6b7280]">
                        Source Credibility
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: credConfig.color }}
                      >
                        {credConfig.label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
