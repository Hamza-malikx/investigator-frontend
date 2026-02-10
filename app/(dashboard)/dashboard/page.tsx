// app/(dashboard)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  FolderOpen,
  Network,
  TrendingUp,
  Clock,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Zap,
  FileText,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { TimeRange } from "@/lib/api/dashboard";

// Icon mapping for activities
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Network,
  FileText,
  Zap,
  FolderOpen,
  Users,
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const {
    stats,
    activities,
    systemStatus,
    isLoadingStats,
    isLoadingActivities,
    isLoadingSystemStatus,
    error,
    fetchStats,
    refreshAll,
    clearError,
  } = useDashboard();

  const {
    investigations,
    isLoading: isLoadingInvestigations,
    fetchInvestigations,
  } = useInvestigation();

  // Fetch stats when time range changes
  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange, fetchStats]);

  // Fetch recent investigations
  useEffect(() => {
    fetchInvestigations({ limit: 4 });
  }, []);

  // Map stats to display format
  const statsDisplay = stats
    ? [
        {
          name: "Active Investigations",
          value: stats.active_investigations.value.toString(),
          total: stats.active_investigations.total,
          change: stats.active_investigations.change,
          trend: stats.active_investigations.trend,
          icon: Search,
          color: "#6366f1",
        },
        {
          name: "Entities Mapped",
          value: stats.entities_mapped.value.toString(),
          change: stats.entities_mapped.change,
          trend: stats.entities_mapped.trend,
          icon: Network,
          color: "#8b5cf6",
        },
        {
          name: "Documents Analyzed",
          value: stats.documents_analyzed.value.toString(),
          change: stats.documents_analyzed.change,
          trend: stats.documents_analyzed.trend,
          icon: FileText,
          color: "#10b981",
        },
        {
          name: "Team Members",
          value: stats.team_members.value.toString(),
          change: stats.team_members.change,
          trend: stats.team_members.trend,
          icon: Users,
          color: "#f59e0b",
        },
      ]
    : [];

  const handleRefresh = async () => {
    await refreshAll(timeRange);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
            Dashboard
          </h1>
          <p className="text-[#9ca3af] mt-1">
            Welcome back. Here&apos;s what&apos;s happening with your
            investigations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoadingStats}
            className="h-11 px-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] hover:bg-[#1f2937] transition-all disabled:opacity-50 flex items-center gap-2"
            title="Refresh dashboard"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingStats ? "animate-spin" : ""}`}
            />
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="h-11 px-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1]"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Link href="/investigations/new">
            <Button className="h-11">
              <Search className="w-4 h-4 mr-2" />
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
              Failed to Load Dashboard
            </p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats
          ? // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937] animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1f2937]" />
                  <div className="w-16 h-5 rounded bg-[#1f2937]" />
                </div>
                <div className="w-20 h-8 rounded bg-[#1f2937] mb-2" />
                <div className="w-32 h-4 rounded bg-[#1f2937]" />
              </div>
            ))
          : statsDisplay.map((stat) => (
              <div
                key={stat.name}
                className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon
                      className="w-6 h-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-[#10b981]" : "text-[#ef4444]"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#f9fafb] mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-[#6b7280]">{stat.name}</p>
              </div>
            ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent investigations - takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#f9fafb]">
              Recent Investigations
            </h2>
            <Link
              href="/investigations"
              className="text-sm text-[#6366f1] hover:text-[#818cf8] font-medium flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingInvestigations ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#111827] border border-[#1f2937] animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1f2937]" />
                      <div>
                        <div className="w-48 h-5 rounded bg-[#1f2937] mb-2" />
                        <div className="w-64 h-4 rounded bg-[#1f2937]" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1f2937] mt-4" />
                </div>
              ))}
            </div>
          ) : investigations.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#111827] border border-[#1f2937] text-center">
              <Search className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
                No Investigations Yet
              </h3>
              <p className="text-[#6b7280] mb-6">
                Start your first investigation to see it here
              </p>
              <Link href="/investigations/new">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  New Investigation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {investigations.slice(0, 4).map((inv) => (
                <Link
                  key={inv.id}
                  href={`/investigations/${inv.id}`}
                  className="block p-5 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#6366f1]/10">
                        <Search className="w-5 h-5 text-[#6366f1]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#f9fafb] group-hover:text-[#818cf8] transition-colors">
                          {inv.title}
                        </h3>
                        <p className="text-sm text-[#6b7280]">
                          {inv.initial_query?.substring(0, 80)}
                          {inv.initial_query && inv.initial_query.length > 80
                            ? "..."
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          inv.status === "running"
                            ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                            : inv.status === "completed"
                              ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
                              : inv.status === "paused"
                                ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                                : "bg-[#6b7280]/10 text-[#6b7280] border border-[#6b7280]/20"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#6b7280]">Progress</span>
                        <span className="text-[#f9fafb] font-medium">
                          {inv.progress_percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                          style={{ width: `${inv.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                      <div className="flex items-center gap-1.5">
                        <Network className="w-4 h-4" />
                        <span>{inv.entities_count} entities</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(inv.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/investigations/new"
              className="p-5 rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 hover:border-[#6366f1]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6366f1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#818cf8]" />
              </div>
              <h3 className="font-semibold text-[#f9fafb] mb-1">
                Quick Investigation
              </h3>
              <p className="text-sm text-[#6b7280]">
                Start a new investigation with AI-powered analysis
              </p>
            </Link>

            <Link
              href="/investigations"
              className="p-5 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1f2937] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="font-semibold text-[#f9fafb] mb-1">
                Browse Investigations
              </h3>
              <p className="text-sm text-[#6b7280]">
                Explore all your investigations and insights
              </p>
            </Link>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-8">
          {/* Activity feed */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#f9fafb]">
                Recent Activity
              </h2>
              <Activity className="w-5 h-5 text-[#6b7280]" />
            </div>

            {isLoadingActivities ? (
              // Loading skeleton
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-[#1f2937]" />
                    <div className="flex-1">
                      <div className="w-full h-4 rounded bg-[#1f2937] mb-2" />
                      <div className="w-20 h-3 rounded bg-[#1f2937]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.activities.length > 0 ? (
              <div className="space-y-6">
                {activities.activities.map((activity) => {
                  const IconComponent = iconMap[activity.icon] || Activity;

                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${activity.color}15` }}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          // style={{ color: activity.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#d1d5db]">
                          <span className="font-medium text-[#f9fafb]">
                            {activity.user}
                          </span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-[#818cf8]">
                            {activity.target}
                          </span>
                        </p>
                        <p className="text-xs text-[#6b7280] mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
                <p className="text-sm text-[#6b7280]">No recent activity</p>
              </div>
            )}
          </div>

          {/* System status */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f9fafb]">
                System Status
              </h2>
              {systemStatus && (
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      systemStatus.status === "operational"
                        ? "bg-[#10b981] animate-pulse"
                        : "bg-[#ef4444]"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      systemStatus.status === "operational"
                        ? "text-[#10b981]"
                        : "text-[#ef4444]"
                    }`}
                  >
                    {systemStatus.status === "operational"
                      ? "Operational"
                      : "Issues Detected"}
                  </span>
                </div>
              )}
            </div>

            {isLoadingSystemStatus ? (
              // Loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between animate-pulse"
                  >
                    <div className="w-32 h-4 rounded bg-[#1f2937]" />
                    <div className="w-16 h-4 rounded bg-[#1f2937]" />
                  </div>
                ))}
              </div>
            ) : systemStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#6366f1]" />
                    <span className="text-sm text-[#d1d5db]">API Response</span>
                  </div>
                  <span className="text-sm text-[#10b981] font-medium">
                    {systemStatus.api_response_time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
                    <span className="text-sm text-[#d1d5db]">
                      Processing Queue
                    </span>
                  </div>
                  <span className="text-sm text-[#f9fafb] font-medium">
                    {systemStatus.processing_queue} jobs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#f59e0b]" />
                    <span className="text-sm text-[#d1d5db]">Uptime</span>
                  </div>
                  <span className="text-sm text-[#f9fafb] font-medium">
                    {systemStatus.uptime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
                <p className="text-sm text-[#6b7280]">Status unavailable</p>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20">
            <h3 className="font-semibold text-[#f9fafb] mb-2">Pro Tip</h3>
            <p className="text-sm text-[#9ca3af] mb-4">
              Use keyboard shortcuts to speed up your workflow. Press{" "}
              <kbd className="px-2 py-1 rounded bg-[#1f2937] text-[#f9fafb] text-xs">
                ⌘K
              </kbd>{" "}
              for quick actions.
            </p>
            <Link
              href="/docs/shortcuts"
              className="text-sm text-[#818cf8] hover:text-[#a78bfa] font-medium"
            >
              View all shortcuts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
