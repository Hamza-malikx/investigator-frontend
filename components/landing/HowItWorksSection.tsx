// components/landing/HowItWorksSection.tsx
"use client";

import { useState } from "react";
import { Upload, Brain, Network, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Data",
    description:
      "Import documents, URLs, or connect APIs. Our system handles PDFs, images, spreadsheets, and unstructured text.",
    details: [
      "Drag & drop interface",
      "50+ file formats",
      "API integrations",
      "Secure cloud storage",
    ],
  },
  {
    icon: Brain,
    title: "AI Processing",
    description:
      "Our AI engine extracts entities, identifies relationships, and analyzes sentiment across all your data sources.",
    details: [
      "Named Entity Recognition",
      "Relationship extraction",
      "Sentiment analysis",
      "Anomaly detection",
    ],
  },
  {
    icon: Network,
    title: "Visualize Connections",
    description:
      "Explore interactive network graphs, timelines, and geographic maps to understand complex relationships.",
    details: [
      "Force-directed graphs",
      "Temporal analysis",
      "Geographic mapping",
      "Custom views",
    ],
  },
  {
    icon: FileText,
    title: "Generate Reports",
    description:
      "Export comprehensive investigation reports with visualizations, evidence trails, and AI-generated insights.",
    details: [
      "Auto-generated summaries",
      "Evidence export",
      "Custom templates",
      "Shareable links",
    ],
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-[#111827]/30 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space)] mb-6">
            How It <span className="text-[#a855f7]">Works</span>
          </h2>
          <p className="text-xl text-[#9ca3af]">
            From raw data to actionable intelligence in four simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={step.title}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
                  activeStep === index
                    ? "bg-[#1f2937] border-[#3b82f6] shadow-lg shadow-[#3b82f6]/10"
                    : "bg-[#111827]/50 border-[#1f2937] hover:border-[#374151]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activeStep === index
                        ? "bg-[#3b82f6]"
                        : "bg-[#1f2937] group-hover:bg-[#374151]"
                    }`}
                  >
                    <step.icon
                      className={`w-6 h-6 ${activeStep === index ? "text-white" : "text-[#9ca3af]"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#6b7280]">
                        Step {index + 1}
                      </span>
                      {activeStep === index && (
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      )}
                    </div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${activeStep === index ? "text-[#f9fafb]" : "text-[#d1d5db]"}`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 mt-1 transition-all ${
                      activeStep === index
                        ? "text-[#3b82f6] translate-x-1"
                        : "text-[#374151]"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Visual representation */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-[#0a0f1e] border border-[#1f2937] p-8 relative overflow-hidden">
              {/* Animated content based on active step */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeStep === 0 && (
                  <div className="text-center space-y-4 animate-in fade-in duration-500">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-[#3b82f6]/10 border-2 border-dashed border-[#3b82f6]/30 flex items-center justify-center">
                      <Upload className="w-10 h-10 text-[#3b82f6]" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-32 mx-auto bg-[#1f2937] rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-[#3b82f6] rounded-full animate-pulse" />
                      </div>
                      <p className="text-sm text-[#6b7280]">
                        Uploading documents...
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="w-full max-w-sm space-y-4 animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1f2937] border border-[#374151]">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      <div className="flex-1 h-2 bg-[#374151] rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] rounded-full" />
                      </div>
                      <span className="text-xs text-[#10b981]">Processing</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Person", "Org", "Location"].map((tag) => (
                        <div
                          key={tag}
                          className="px-3 py-2 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-xs text-[#3b82f6] text-center"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="relative w-full h-full animate-in fade-in duration-500">
                    <svg className="w-full h-full">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        opacity="0.3"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="80"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2"
                        opacity="0.2"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="120"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        opacity="0.1"
                      />
                      <circle cx="50%" cy="50%" r="8" fill="#3b82f6" />
                      <circle
                        cx="30%"
                        cy="30%"
                        r="6"
                        fill="#a855f7"
                        className="animate-pulse"
                      />
                      <circle
                        cx="70%"
                        cy="30%"
                        r="6"
                        fill="#10b981"
                        className="animate-pulse"
                      />
                      <circle
                        cx="50%"
                        cy="80%"
                        r="6"
                        fill="#f59e0b"
                        className="animate-pulse"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="30%"
                        y2="30%"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="70%"
                        y2="30%"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="80%"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="w-full max-w-sm space-y-3 animate-in fade-in duration-500">
                    <div className="p-4 rounded-lg bg-[#1f2937] border border-[#374151]">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-[#3b82f6]" />
                        <span className="text-sm font-medium text-[#f9fafb]">
                          Investigation_Report.pdf
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-[#374151] rounded-full" />
                        <div className="h-2 w-4/5 bg-[#374151] rounded-full" />
                        <div className="h-2 w-3/5 bg-[#374151] rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs">
                        Ready
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#1f2937] text-[#9ca3af] text-xs">
                        2.4 MB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeStep === idx
                        ? "w-8 bg-[#3b82f6]"
                        : "bg-[#374151] hover:bg-[#4b5563]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#3b82f6]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#a855f7]/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
