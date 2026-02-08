// components/layout/DashboardNavbar.tsx
"use client";

import { useState } from "react";
import { Bell, Search, Plus, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export function DashboardNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Get display name
  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username || user?.email || "User";

  // Get initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  // Format subscription tier
  const formatSubscription = (tier?: string) => {
    if (!tier) return "Free Plan";
    return tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";
  };

  return (
    <header className="h-20 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-[#1f2937] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search investigations, entities, or documents..."
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#111827] border border-[#1f2937] text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* New Investigation Button */}
        <Link
          href="/investigations/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Investigation
        </Link>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-[#111827] border border-[#1f2937] text-[#9ca3af] hover:text-[#f9fafb] hover:border-[#374151] transition-all">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#111827]" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-4 border-l border-[#1f2937] hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-[#f9fafb]">
                {displayName}
              </p>
              <p className="text-xs text-[#6b7280]">
                {formatSubscription(user?.subscription_tier)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
              <span className="text-white font-semibold text-sm">
                {getInitials()}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#6b7280] transition-transform ${showUserMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111827] border border-[#1f2937] shadow-xl z-50 overflow-hidden">
                {/* User Info */}
                <div className="p-4 border-b border-[#1f2937]">
                  <p className="text-sm font-medium text-[#f9fafb] mb-1">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        user?.subscription_tier === "enterprise"
                          ? "bg-[#8b5cf6]/10 text-[#8b5cf6]"
                          : user?.subscription_tier === "pro"
                            ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                            : "bg-[#6b7280]/10 text-[#6b7280]"
                      }`}
                    >
                      {formatSubscription(user?.subscription_tier)}
                    </span>
                    <span className="text-xs text-[#6b7280]">
                      {user?.api_quota_remaining || 0} API calls left
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    href="/settings/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/settings/billing"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Billing & Plans
                  </Link>
                  <Link
                    href="/settings/api"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    API Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-[#1f2937]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
