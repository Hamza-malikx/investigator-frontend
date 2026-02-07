// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Chrome,
  Github,
} from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const features = [
    "100 free API calls/month",
    "Unlimited investigations",
    "Basic entity extraction",
    "Email support",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb] mb-2">
          {step === 1 ? "Create your account" : "Complete your profile"}
        </h2>
        <p className="text-[#9ca3af]">
          {step === 1
            ? "Start uncovering insights with AI-powered investigations"
            : "Tell us a bit more about yourself"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-[#3b82f6]" : "bg-[#374151]"
            }`}
          />
        ))}
      </div>

      {/* Social login - only on step 1 */}
      {step === 1 && (
        <>
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
                Or register with email
              </span>
            </div>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <Input
              label="Username"
              type="text"
              placeholder="investigator_jane"
              icon={<User size={18} />}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="jane@company.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
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
              <Input
                label="Confirm"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={formData.password_confirm}
                onChange={(e) =>
                  setFormData({ ...formData, password_confirm: e.target.value })
                }
                required
              />
            </div>

            <div className="text-xs text-[#6b7280] space-y-1">
              <p>Password must contain:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#10b981]" />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#10b981]" />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#10b981]" />
                  One number
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                type="text"
                placeholder="Jane"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
              <Input
                label="Last name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            {/* Plan preview */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1f2937] to-[#111827] border border-[#374151]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#f9fafb]">
                  Free Plan
                </span>
                <span className="px-2 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-medium border border-[#10b981]/30">
                  Selected
                </span>
              </div>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[#d1d5db]"
                  >
                    <CheckCircle2 size={14} className="text-[#3b82f6]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[#6b7280]">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-[#3b82f6] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#3b82f6] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </>
        )}

        <div className="flex gap-3">
          {step === 2 && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1 group" isLoading={isLoading}>
            {step === 1 ? "Continue" : "Create account"}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>

      {/* Footer */}
      <p className="text-center text-[#9ca3af] text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
