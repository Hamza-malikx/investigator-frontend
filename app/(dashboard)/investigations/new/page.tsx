// app/(dashboard)/investigations/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Globe,
  Database,
  Clock,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { CreateInvestigationData } from "@/types/investigation";

const steps = [
  {
    id: "query",
    title: "Research Question",
    description: "Define what you want to investigate",
  },
  {
    id: "focus",
    title: "Focus Areas",
    description: "Specify areas to concentrate on",
  },
  {
    id: "depth",
    title: "Investigation Depth",
    description: "Choose how comprehensive the analysis should be",
  },
  {
    id: "review",
    title: "Review & Launch",
    description: "Confirm details and start investigation",
  },
];

const focusAreaOptions = [
  {
    id: "financial",
    label: "Financial Records",
    icon: Database,
    description: "Transactions, accounts, funding sources",
  },
  {
    id: "corporate",
    label: "Corporate Structure",
    icon: FileText,
    description: "Ownership, subsidiaries, executives",
  },
  {
    id: "digital",
    label: "Digital Footprint",
    icon: Globe,
    description: "Websites, social media, online presence",
  },
  {
    id: "temporal",
    label: "Timeline Analysis",
    icon: Clock,
    description: "Historical events, chronology, patterns",
  },
];

const depthOptions = [
  {
    id: "shallow",
    label: "Quick Scan",
    description: "Surface-level analysis, 1-2 hours",
    apiCalls: "~100",
    cost: "~$1.00",
    features: [
      "Basic entity extraction",
      "Public records search",
      "Simple relationship mapping",
    ],
  },
  {
    id: "moderate",
    label: "Standard Investigation",
    description: "Thorough analysis, 4-8 hours",
    apiCalls: "~500",
    cost: "~$5.00",
    features: [
      "Deep entity extraction",
      "Multi-source research",
      "Network analysis",
      "Timeline construction",
    ],
    recommended: true,
  },
  {
    id: "comprehensive",
    label: "Deep Dive",
    description: "Exhaustive analysis, 12-24 hours",
    apiCalls: "~2000",
    cost: "~$20.00",
    features: [
      "Advanced AI analysis",
      "Global database search",
      "Predictive modeling",
      "Comprehensive report",
    ],
  },
];

export default function NewInvestigationPage() {
  const router = useRouter();
  const { createInvestigation, isLoading, error, clearError } =
    useInvestigation();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateInvestigationData>({
    title: "",
    initial_query: "",
    focus_areas: [],
    depth_level: "moderate",
    time_range: {
      start: "",
      end: "",
    },
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          errors.title = "Title is required";
        }
        if (!formData.initial_query.trim()) {
          errors.initial_query = "Research question is required";
        } else if (formData.initial_query.trim().length < 20) {
          errors.initial_query =
            "Please provide more detail (at least 20 characters)";
        }
        break;
      case 1:
        if (formData.focus_areas && formData.focus_areas.length === 0) {
          errors.focus_areas = "Please select at least one focus area";
        }
        break;
      case 2:
        // Depth level is always valid (has default)
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    clearError();

    try {
      const submissionData: CreateInvestigationData = {
        title: formData.title,
        initial_query: formData.initial_query,
        focus_areas: formData.focus_areas,
        depth_level: formData.depth_level,
      };

      if (formData.time_range?.start || formData.time_range?.end) {
        submissionData.time_range = formData.time_range;
      }

      // Show loading state
      // setIsLoading(true);

      // Create investigation - backend returns immediately with ID
      const investigation = await createInvestigation(submissionData);

      // Redirect IMMEDIATELY with the ID
      router.push(`/investigations/${investigation.id}`);

      // Note: Component may unmount here, causing the "cancelled"
      // but that's OK - the investigation is already created and task is running
    } catch (err) {
      console.error("Failed to create investigation:", err);
      // setIsLoading(false);
    }
  };

  const toggleFocusArea = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      focus_areas: prev.focus_areas?.includes(id)
        ? prev.focus_areas.filter((f) => f !== id)
        : [...(prev.focus_areas || []), id],
    }));
    // Clear validation error
    if (validationErrors.focus_areas) {
      setValidationErrors({ ...validationErrors, focus_areas: "" });
    }
  };

  const handleInputChange = (
    field: keyof CreateInvestigationData,
    value: unknown,
  ) => {
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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return (
          formData.title.trim() !== "" && formData.initial_query.trim() !== ""
        );
      case 1:
        return (formData.focus_areas?.length || 0) > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-[#111827] border border-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:border-[#374151] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space)] text-[#f9fafb]">
            New Investigation
          </h1>
          <p className="text-[#9ca3af] text-sm">
            Configure your research parameters
          </p>
        </div>
      </div>

      {/* API Error Alert */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-500 font-medium">
              Failed to Create Investigation
            </p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    index < currentStep
                      ? "bg-[#10b981] text-white"
                      : index === currentStep
                        ? "bg-[#6366f1] text-white ring-4 ring-[#6366f1]/20"
                        : "bg-[#1f2937] text-[#6b7280] border border-[#374151]"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    index <= currentStep ? "text-[#f9fafb]" : "text-[#6b7280]"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? "bg-[#10b981]" : "bg-[#374151]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                Investigation Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Financial Fraud Analysis - Q4 2024"
                className={`w-full h-12 px-4 rounded-xl bg-[#0a0f1e] border text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all ${
                  validationErrors.title ? "border-red-500" : "border-[#374151]"
                }`}
                disabled={isLoading}
              />
              {validationErrors.title && (
                <p className="mt-1.5 text-sm text-red-500">
                  {validationErrors.title}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                Research Question
              </label>
              <textarea
                value={formData.initial_query}
                onChange={(e) =>
                  handleInputChange("initial_query", e.target.value)
                }
                placeholder="Describe what you want to investigate in detail. Be specific about the subject, scope, and desired outcomes."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none ${
                  validationErrors.initial_query
                    ? "border-red-500"
                    : "border-[#374151]"
                }`}
                disabled={isLoading}
              />
              {validationErrors.initial_query && (
                <p className="mt-1.5 text-sm text-red-500">
                  {validationErrors.initial_query}
                </p>
              )}
              <p className="mt-2 text-xs text-[#6b7280]">
                Tip: A well-defined question leads to better results. Include
                names, dates, and specific topics.
              </p>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <p className="text-[#9ca3af]">
              Select the areas you want the investigation to focus on:
            </p>
            {validationErrors.focus_areas && (
              <p className="text-sm text-red-500">
                {validationErrors.focus_areas}
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {focusAreaOptions.map((area) => {
                const Icon = area.icon;
                const isSelected =
                  formData.focus_areas?.includes(area.id) || false;
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleFocusArea(area.id)}
                    disabled={isLoading}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#6366f1]/10 border-[#6366f1] ring-2 ring-[#6366f1]/20"
                        : "bg-[#0a0f1e] border-[#374151] hover:border-[#4b5563]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-[#6366f1]/20" : "bg-[#1f2937]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${isSelected ? "text-[#818cf8]" : "text-[#6b7280]"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold ${isSelected ? "text-[#f9fafb]" : "text-[#d1d5db]"}`}
                          >
                            {area.label}
                          </h3>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#6366f1]" />
                          )}
                        </div>
                        <p className="text-sm text-[#6b7280] mt-1">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <p className="text-[#9ca3af]">
              Choose how deep the investigation should go:
            </p>
            <div className="space-y-4">
              {depthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleInputChange("depth_level", option.id)}
                  disabled={isLoading}
                  className={`w-full p-6 rounded-xl border text-left transition-all relative ${
                    formData.depth_level === option.id
                      ? "bg-[#6366f1]/10 border-[#6366f1] ring-2 ring-[#6366f1]/20"
                      : "bg-[#0a0f1e] border-[#374151] hover:border-[#4b5563]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {option.recommended && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-medium border border-[#10b981]/20">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className={`font-semibold text-lg ${formData.depth_level === option.id ? "text-[#f9fafb]" : "text-[#d1d5db]"}`}
                      >
                        {option.label}
                      </h3>
                      <p className="text-sm text-[#6b7280] mt-1">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#f9fafb] font-semibold">
                        {option.cost}
                      </div>
                      <div className="text-xs text-[#6b7280]">
                        {option.apiCalls} calls
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-[#9ca3af]"
                      >
                        <Check className="w-4 h-4 text-[#6366f1]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20">
              <Check className="w-5 h-5 text-[#10b981]" />
              <span className="text-[#10b981] font-medium">
                Ready to launch investigation
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-1">
                  Title
                </h3>
                <p className="text-[#f9fafb]">{formData.title}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]">
                <h3 className="text-sm font-medium text-[#6b7280] mb-1">
                  Research Question
                </h3>
                <p className="text-[#d1d5db] text-sm">
                  {formData.initial_query}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]">
                  <h3 className="text-sm font-medium text-[#6b7280] mb-1">
                    Focus Areas
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.focus_areas?.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 rounded-lg bg-[#6366f1]/10 text-[#818cf8] text-xs"
                      >
                        {focusAreaOptions.find((f) => f.id === area)?.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0f1e] border border-[#374151]">
                  <h3 className="text-sm font-medium text-[#6b7280] mb-1">
                    Investigation Depth
                  </h3>
                  <p className="text-[#f9fafb]">
                    {
                      depthOptions.find((d) => d.id === formData.depth_level)
                        ?.label
                    }
                  </p>
                  <p className="text-xs text-[#6b7280] mt-1">
                    {
                      depthOptions.find((d) => d.id === formData.depth_level)
                        ?.cost
                    }{" "}
                    •{" "}
                    {
                      depthOptions.find((d) => d.id === formData.depth_level)
                        ?.apiCalls
                    }{" "}
                    API calls
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20">
              <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#d1d5db]">
                <p className="font-medium text-[#f9fafb] mb-1">Important</p>
                Once started, the investigation will consume API calls and
                cannot be refunded. You can pause or cancel at any time.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          isLoading={isLoading}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? "Launching..." : "Launch Investigation"}
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
