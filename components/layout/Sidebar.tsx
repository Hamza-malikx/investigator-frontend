// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  FolderOpen,
  Network,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Investigations", href: "/investigations", icon: Search },
  { name: "Entities", href: "/entities", icon: Network },
  { name: "Documents", href: "/documents", icon: FolderOpen },
  { name: "Reports", href: "/reports", icon: FileText },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Calculate API quota percentage
  const apiQuotaPercentage = user?.api_quota_remaining
    ? Math.min((user.api_quota_remaining / 1000) * 100, 100)
    : 0;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#111827] border-r border-[#1f2937] z-40 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-[#1f2937]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
              Investi<span className="text-[#8b5cf6]">Gator</span>
            </span>
          )}
        </Link>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center text-[#6b7280] hover:text-[#f9fafb] hover:border-[#6366f1] transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-4">
            Main
          </p>
        )}
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20"
                  : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb]",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-[#818cf8]"
                    : "text-[#6b7280] group-hover:text-[#9ca3af]",
                )}
              />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#6366f1] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* API Quota */}
      {!collapsed && user && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-xl bg-[#1f2937]/50 border border-[#374151]/50">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-sm font-medium text-[#f9fafb]">
                API Quota
              </span>
            </div>
            <div className="h-2 bg-[#374151] rounded-full overflow-hidden mb-2">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  apiQuotaPercentage > 50
                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                    : apiQuotaPercentage > 25
                      ? "bg-gradient-to-r from-[#f59e0b] to-[#f97316]"
                      : "bg-gradient-to-r from-[#ef4444] to-[#dc2626]",
                )}
                style={{ width: `${apiQuotaPercentage}%` }}
              />
            </div>
            <p className="text-xs text-[#6b7280]">
              {user.api_quota_remaining || 0} / 1,000 calls
            </p>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="px-4 py-4 border-t border-[#1f2937] space-y-1">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all duration-200 group"
            title={collapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 text-[#6b7280] group-hover:text-[#9ca3af]" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9ca3af] hover:bg-[#ef4444]/10 hover:text-[#ef4444] transition-all duration-200 group"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 text-[#6b7280] group-hover:text-[#ef4444]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
