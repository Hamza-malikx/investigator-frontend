// components/layout/DashboardNavbar.tsx
"use client";

import { useState } from "react";
import { Bell, Search, Plus, User } from "lucide-react";
import Link from "next/link";

export function DashboardNavbar() {
  const [notifications] = useState(3);

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
        <Link
          href="/investigations/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Investigation
        </Link>

        <button className="relative p-2.5 rounded-xl bg-[#111827] border border-[#1f2937] text-[#9ca3af] hover:text-[#f9fafb] hover:border-[#374151] transition-all">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#111827]" />
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#1f2937]">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-[#f9fafb]">Alex Chen</p>
            <p className="text-xs text-[#6b7280]">Pro Plan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
