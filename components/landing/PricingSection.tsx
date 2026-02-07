// components/landing/PricingSection.tsx
"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for individual researchers and small projects",
    features: [
      "100 API calls/month",
      "5 investigations",
      "Basic entity extraction",
      "PDF & text support",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    icon: Zap,
    price: { monthly: 49, yearly: 39 },
    description: "For professional investigators and growing teams",
    features: [
      "10,000 API calls/month",
      "Unlimited investigations",
      "Advanced AI models",
      "All file formats",
      "Priority support",
      "API access",
      "Custom integrations",
      "Team collaboration (5 seats)",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: { monthly: null, yearly: null },
    description: "Custom solutions for large organizations",
    features: [
      "Unlimited API calls",
      "Unlimited investigations",
      "Custom AI training",
      "White-label options",
      "24/7 dedicated support",
      "SSO & advanced security",
      "On-premise deployment",
      "Unlimited team seats",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-[#111827]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space)] mb-6">
            Simple, Transparent <span className="text-[#10b981]">Pricing</span>
          </h2>
          <p className="text-xl text-[#9ca3af] mb-8">
            Choose the plan that fits your investigation needs
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 p-1 rounded-full bg-[#1f2937] border border-[#374151]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-[#3b82f6] text-white"
                  : "text-[#9ca3af] hover:text-[#f9fafb]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-[#3b82f6] text-white"
                  : "text-[#9ca3af] hover:text-[#f9fafb]"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#1f2937] to-[#111827] border-2 border-[#3b82f6] shadow-2xl shadow-[#3b82f6]/10"
                  : "bg-[#111827]/50 border border-[#1f2937] hover:border-[#374151]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[#3b82f6] text-white text-sm font-medium shadow-lg shadow-[#3b82f6]/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular ? "bg-[#3b82f6]/20" : "bg-[#1f2937]"
                  }`}
                >
                  <plan.icon
                    className={`w-6 h-6 ${plan.popular ? "text-[#3b82f6]" : "text-[#9ca3af]"}`}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#f9fafb] mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#9ca3af] text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price.monthly !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#f9fafb]">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-[#6b7280]">/month</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-[#f9fafb]">
                    Custom
                  </div>
                )}
                {isYearly && plan.price.yearly && (
                  <p className="text-sm text-[#10b981] mt-1">Billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#d1d5db]"
                  >
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-[#3b82f6]" : "text-[#10b981]"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/register"}
                className="block"
              >
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <div className="mt-12 text-center">
          <p className="text-[#6b7280]">
            Need a custom solution?{" "}
            <Link
              href="/contact"
              className="text-[#3b82f6] hover:underline font-medium"
            >
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
