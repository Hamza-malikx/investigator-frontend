// app/(auth)/register/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

// Password requirement component - moved outside to avoid re-creation on render
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <li className="flex items-center gap-2">
    {met ? (
      <Check size={14} className="text-[#10b981]" />
    ) : (
      <X size={14} className="text-[#6b7280]" />
    )}
    <span className={met ? "text-[#10b981]" : "text-[#6b7280]"}>{text}</span>
  </li>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Password strength indicators - derived state using useMemo
  const passwordStrength = useMemo(
    () => ({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
    }),
    [formData.password],
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !passwordStrength.length ||
      !passwordStrength.uppercase ||
      !passwordStrength.number
    ) {
      errors.password = "Password does not meet requirements";
    }

    if (!formData.password_confirm) {
      errors.password_confirm = "Please confirm your password";
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    // Step 2 - Submit registration
    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
      console.error("Registration failed:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
    // Clear API error
    if (error) {
      clearError();
    }
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

      {/* API Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-500 font-medium">
              Registration Failed
            </p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}

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
              onChange={(e) => handleInputChange("username", e.target.value)}
              error={validationErrors.username}
              required
              disabled={isLoading}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="jane@company.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={validationErrors.email}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={validationErrors.password}
                required
                disabled={isLoading}
              />
              <Input
                label="Confirm"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={formData.password_confirm}
                onChange={(e) =>
                  handleInputChange("password_confirm", e.target.value)
                }
                error={validationErrors.password_confirm}
                required
                disabled={isLoading}
              />
            </div>

            <div className="text-xs text-[#6b7280] space-y-2">
              <p className="font-medium">Password must contain:</p>
              <ul className="space-y-1.5 ml-1">
                <PasswordRequirement
                  met={passwordStrength.length}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordStrength.uppercase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.number}
                  text="One number"
                />
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
                  handleInputChange("first_name", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                label="Last name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                disabled={isLoading}
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
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 group"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading
              ? "Creating account..."
              : step === 1
                ? "Continue"
                : "Create account"}
            {!isLoading && (
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
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
