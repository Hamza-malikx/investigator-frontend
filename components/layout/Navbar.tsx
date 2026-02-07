// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#1f2937] bg-[#0a0f1e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#a855f7] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-space)] tracking-tight">
              Investi<span className="text-[#3b82f6]">Gator</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[#d1d5db] hover:text-[#f9fafb] transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/investigations"
              className="text-[#d1d5db] hover:text-[#f9fafb] transition-colors text-sm font-medium"
            >
              Investigations
            </Link>
            <Link
              href="/api"
              className="text-[#d1d5db] hover:text-[#f9fafb] transition-colors text-sm font-medium"
            >
              API
            </Link>
            <Link
              href="/docs"
              className="text-[#d1d5db] hover:text-[#f9fafb] transition-colors text-sm font-medium"
            >
              Docs
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 rounded-lg text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-lg text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#a855f7]" />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#d1d5db] hover:bg-[#1f2937]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#1f2937] bg-[#0a0f1e]">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#d1d5db] hover:text-[#f9fafb] hover:bg-[#1f2937]"
            >
              Dashboard
            </Link>
            <Link
              href="/investigations"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#d1d5db] hover:text-[#f9fafb] hover:bg-[#1f2937]"
            >
              Investigations
            </Link>
            <Link
              href="/api"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#d1d5db] hover:text-[#f9fafb] hover:bg-[#1f2937]"
            >
              API
            </Link>
            <Link
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#d1d5db] hover:text-[#f9fafb] hover:bg-[#1f2937]"
            >
              Docs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
