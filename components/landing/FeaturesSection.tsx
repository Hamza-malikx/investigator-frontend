// components/landing/FeaturesSection.tsx
"use client";

import { useState } from "react";
import {
  Brain,
  Network,
  FileSearch,
  Shield,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced NLP models extract entities, relationships, and sentiments from unstructured data automatically.",
    color: "#3b82f6",
    stats: "99.2% accuracy",
  },
  {
    icon: Network,
    title: "Relationship Mapping",
    description:
      "Visualize complex connections between entities with interactive graph networks and timeline views.",
    color: "#a855f7",
    stats: "Infinite depth",
  },
  {
    icon: FileSearch,
    title: "Multi-Source Ingestion",
    description:
      "Import data from documents, URLs, APIs, and databases. Support for PDF, CSV, JSON, and more.",
    color: "#10b981",
    stats: "50+ formats",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SOC 2 compliance, and granular access controls protect sensitive investigations.",
    color: "#f59e0b",
    stats: "SOC 2 Type II",
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. Share insights, annotations, and reports instantly.",
    color: "#ef4444",
    stats: "Live sync",
  },
  {
    icon: Globe,
    title: "Global Intelligence",
    description:
      "Access global databases, news feeds, and public records to enrich your investigations.",
    color: "#06b6d4",
    stats: "200+ sources",
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space)] mb-6">
            Everything You Need to{" "}
            <span className="text-[#3b82f6]">Investigate</span>
          </h2>
          <p className="text-xl text-[#9ca3af]">
            Powerful tools designed for investigators, analysts, and researchers
            who need to uncover the truth hidden in data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-[#111827]/50 border border-[#1f2937] hover:border-[#374151] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#3b82f6]/5"
              onMouseEnter={() => setActiveFeature(index)}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}10, transparent 40%)`,
                }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#f9fafb] mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#9ca3af] mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                    }}
                  >
                    {feature.stats}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#6b7280] mb-4">And much more...</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "API Access",
              "Custom Integrations",
              "White-label",
              "SSO",
              "Audit Logs",
              "Data Export",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-[#1f2937] text-sm text-[#d1d5db] border border-[#374151]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
