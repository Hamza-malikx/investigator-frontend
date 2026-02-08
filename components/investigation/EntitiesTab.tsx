// components/investigation/EntitiesTab.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Network,
  Search,
  Filter,
  User,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Coins,
  ChevronRight,
  TrendingUp,
  Link2,
  FileSearch,
} from "lucide-react";
import { useEntity } from "@/lib/hooks/useEntity";
import type { EntityType } from "@/types/entity";

interface EntitiesTabProps {
  investigationId: string;
}

const entityTypeConfig: Record<
  EntityType,
  { icon: unknown; color: string; label: string }
> = {
  person: { icon: User, color: "#6366f1", label: "Person" },
  company: { icon: Building2, color: "#8b5cf6", label: "Company" },
  location: { icon: MapPin, color: "#10b981", label: "Location" },
  event: { icon: Calendar, color: "#f59e0b", label: "Event" },
  document: { icon: FileText, color: "#3b82f6", label: "Document" },
  financial_instrument: { icon: Coins, color: "#14b8a6", label: "Financial" },
};

export function EntitiesTab({ investigationId }: EntitiesTabProps) {
  const { entities, isLoading, error, fetchEntities, clearError } = useEntity();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EntityType | "all">("all");
  const [sortBy, setSortBy] = useState<"confidence" | "sources" | "name">(
    "confidence",
  );

  useEffect(() => {
    fetchEntities(investigationId);
  }, [investigationId]);

  const filteredEntities = entities
    .filter((entity) => {
      const matchesSearch = entity.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || entity.entity_type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      if (sortBy === "sources") return b.source_count - a.source_count;
      return a.name.localeCompare(b.name);
    });

  const typeBreakdown = entities.reduce(
    (acc, entity) => {
      acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1;
      return acc;
    },
    {} as Record<EntityType, number>,
  );

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <Network className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
          Failed to Load Entities
        </h3>
        <p className="text-[#6b7280] mb-6">{error}</p>
        <button
          onClick={() => {
            clearError();
            fetchEntities(investigationId);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(Object.keys(entityTypeConfig) as EntityType[]).map((type) => {
          const config = entityTypeConfig[type];
          const Icon = config?.icon;
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
                style={{ backgroundColor: `${config?.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: config?.color }} />
              </div> */}
              <div className="text-left">
                <p className="text-2xl font-bold text-[#f9fafb]">{count}</p>
                <p className="text-xs text-[#6b7280]">{config?.label}</p>
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
            placeholder="Search entities by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "confidence" | "sources" | "name")
          }
          className="h-11 px-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1]"
        >
          <option value="confidence">Sort by Confidence</option>
          <option value="sources">Sort by Sources</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] animate-pulse"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1f2937]" />
                <div className="flex-1">
                  <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#1f2937] rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-[#1f2937] rounded w-full mb-2" />
              <div className="h-3 bg-[#1f2937] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1f2937] flex items-center justify-center">
            <Network className="w-8 h-8 text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
            No Entities Found
          </h3>
          <p className="text-[#6b7280]">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your filters"
              : "Entities will appear as the investigation progresses"}
          </p>
        </div>
      ) : (
        /* Entity Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => {
            const config = entityTypeConfig[entity.entity_type];
            const Icon = config?.icon;

            return (
              <div
                key={entity.id}
                className="group p-4 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${config?.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config?.color }} />
                  </div> */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#f9fafb] truncate group-hover:text-[#818cf8] transition-colors">
                      {entity.name}
                    </h4>
                    <p className="text-xs text-[#6b7280]">{config?.label}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280] flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Confidence
                    </span>
                    <span className="text-[#f9fafb] font-medium">
                      {(entity.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${entity.confidence * 100}%`,
                        backgroundColor: config?.color,
                      }}
                    />
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-4 pt-4 border-t border-[#1f2937] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-[#6b7280] flex items-center gap-1">
                      <FileSearch className="w-3.5 h-3.5" />
                      {entity.source_count} sources
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#818cf8] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
