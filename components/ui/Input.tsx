// components/ui/Input.tsx
"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#d1d5db] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-[#1f2937] border border-[#374151] rounded-lg px-4 py-3 text-[#f9fafb] placeholder-[#6b7280]",
              "transition-all duration-200 ease-in-out",
              "focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10",
              "hover:border-[#4b5563]",
              icon && "pl-10",
              isPassword && "pr-10",
              error &&
                "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#d1d5db] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-[#ef4444]">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
