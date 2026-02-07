// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb] mb-2">
          Welcome back
        </h2>
        <p className="text-[#9ca3af]">Sign in to continue your investigation</p>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1f2937] border border-[#374151] text-[#d1d5db] hover:bg-[#374151] hover:border-[#4b5563] transition-all duration-200">
          <Chrome size={18} />
          <span className="text-sm font-medium">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1f2937] border border-[#374151] text-[#d1d5db] hover:bg-[#374151] hover:border-[#4b5563] transition-all duration-200">
          <Github size={18} />
          <span className="text-sm font-medium">GitHub</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#374151]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0a0f1e] text-[#6b7280]">
            Or continue with
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full group" isLoading={isLoading}>
          Sign in
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-[#9ca3af] text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors"
        >
          Start investigating
        </Link>
      </p>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#6b7280] pt-4 border-t border-[#1f2937]">
        <svg
          className="w-4 h-4 text-[#10b981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>Enterprise-grade security</span>
      </div>
    </div>
  );
}
