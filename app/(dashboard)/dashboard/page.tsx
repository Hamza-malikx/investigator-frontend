// app/(dashboard)/dashboard/page.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Stats data
const stats = [
  {
    name: "Active Investigations",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Search,
    color: "#6366f1",
  },
  {
    name: "Entities Mapped",
    value: "1,247",
    change: "+156",
    trend: "up",
    icon: Network,
    color: "#8b5cf6",
  },
  {
    name: "Documents Analyzed",
    value: "3.4K",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "#10b981",
  },
  {
    name: "Team Members",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Users,
    color: "#f59e0b",
  },
];

// Recent investigations
const recentInvestigations = [
  {
    id: "inv_001",
    title: "Financial Fraud Analysis",
    description: "Cross-border transaction pattern analysis",
    status: "active",
    progress: 78,
    entities: 47,
    updatedAt: "2 hours ago",
    type: "financial",
  },
  {
    id: "inv_002",
    title: "Corporate Due Diligence",
    description: "Acquisition target background check",
    status: "active",
    progress: 45,
    entities: 23,
    updatedAt: "5 hours ago",
    type: "corporate",
  },
  {
    id: "inv_003",
    title: "IP Theft Investigation",
    description: "Source code leak tracing",
    status: "completed",
    progress: 100,
    entities: 12,
    updatedAt: "1 day ago",
    type: "security",
  },
  {
    id: "inv_004",
    title: "Supply Chain Analysis",
    description: "Vendor relationship mapping",
    status: "paused",
    progress: 32,
    entities: 89,
    updatedAt: "2 days ago",
    type: "corporate",
  },
];

// Activity feed
const activities = [
  {
    id: 1,
    user: "You",
    action: "created new investigation",
    target: "Financial Fraud Analysis",
    time: "2 hours ago",
    icon: Search,
    color: "#6366f1",
  },
  {
    id: 2,
    user: "System",
    action: "detected 12 new relationships in",
    target: "Corporate Due Diligence",
    time: "3 hours ago",
    icon: Network,
    color: "#8b5cf6",
  },
  {
    id: 3,
    user: "Sarah M.",
    action: "uploaded 24 documents to",
    target: "IP Theft Investigation",
    time: "5 hours ago",
    icon: FileText,
    color: "#10b981",
  },
  {
    id: 4,
    user: "System",
    action: "completed analysis of",
    target: "Supply Chain Analysis",
    time: "1 day ago",
    icon: Zap,
    color: "#f59e0b",
  },
  {
    id: 5,
    user: "You",
    action: "exported report from",
    target: "Market Research Q4",
    time: "2 days ago",
    icon: FolderOpen,
    color: "#6366f1",
  },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
            Dashboard
          </h1>
          <p className="text-[#9ca3af] mt-1">
            Welcome back, Alex. Here&apos;s what&apos;s happening with your
            investigations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
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

          <div className="space-y-4">
            {recentInvestigations.map((inv) => (
              <Link
                key={inv.id}
                href={`/investigations/${inv.id}`}
                className="block p-5 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        inv.type === "financial"
                          ? "bg-[#10b981]/10"
                          : inv.type === "corporate"
                            ? "bg-[#6366f1]/10"
                            : inv.type === "security"
                              ? "bg-[#ef4444]/10"
                              : "bg-[#f59e0b]/10"
                      }`}
                    >
                      <Search
                        className={`w-5 h-5 ${
                          inv.type === "financial"
                            ? "text-[#10b981]"
                            : inv.type === "corporate"
                              ? "text-[#6366f1]"
                              : inv.type === "security"
                                ? "text-[#ef4444]"
                                : "text-[#f59e0b]"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f9fafb] group-hover:text-[#818cf8] transition-colors">
                        {inv.title}
                      </h3>
                      <p className="text-sm text-[#6b7280]">
                        {inv.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === "active"
                          ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                          : inv.status === "completed"
                            ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
                            : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                      }`}
                    >
                      {inv.status}
                    </span>
                    <button className="p-2 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6b7280]">Progress</span>
                      <span className="text-[#f9fafb] font-medium">
                        {inv.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                        style={{ width: `${inv.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                    <div className="flex items-center gap-1.5">
                      <Network className="w-4 h-4" />
                      <span>{inv.entities} entities</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{inv.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
              href="/entities"
              className="p-5 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-[#374151] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1f2937] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="font-semibold text-[#f9fafb] mb-1">
                Browse Entities
              </h3>
              <p className="text-sm text-[#6b7280]">
                Explore 1,247+ mapped entities and relationships
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

            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${activity.color}15` }}
                  >
                    <activity.icon
                      className="w-5 h-5"
                      style={{ color: activity.color }}
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
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl text-sm text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-colors">
              View all activity
            </button>
          </div>

          {/* System status */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f9fafb]">
                System Status
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-xs text-[#10b981] font-medium">
                  Operational
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-sm text-[#d1d5db]">API Response</span>
                </div>
                <span className="text-sm text-[#10b981] font-medium">24ms</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
                  <span className="text-sm text-[#d1d5db]">
                    Processing Queue
                  </span>
                </div>
                <span className="text-sm text-[#f9fafb] font-medium">
                  3 jobs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#f59e0b]" />
                  <span className="text-sm text-[#d1d5db]">Uptime</span>
                </div>
                <span className="text-sm text-[#f9fafb] font-medium">
                  99.9%
                </span>
              </div>
            </div>
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
