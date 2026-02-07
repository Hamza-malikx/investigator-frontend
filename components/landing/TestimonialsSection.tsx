// src/components/landing/TestimonialsSection.tsx
"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "InvestiGator transformed how we handle due diligence. What used to take weeks now takes hours. The relationship mapping is uncanny.",
    author: "Sarah Chen",
    role: "Chief Investigator",
    company: "Frost & Associates",
    image: "SC",
    rating: 5,
  },
  {
    quote:
      "The AI entity extraction is incredibly accurate. We've identified connections in financial records that would have been impossible to find manually.",
    author: "Marcus Johnson",
    role: "Financial Crime Analyst",
    company: "Global Bank Corp",
    image: "MJ",
    rating: 5,
  },
  {
    quote:
      "Best intelligence platform we've used. The real-time collaboration features allow our distributed team to work seamlessly across time zones.",
    author: "Elena Rodriguez",
    role: "Intelligence Director",
    company: "SecureNet Services",
    image: "ER",
    rating: 5,
  },
  {
    quote:
      "The API integration was seamless. We embedded InvestiGator into our existing workflow and saw immediate productivity gains.",
    author: "David Park",
    role: "Head of Product",
    company: "DataFlow Inc",
    image: "DP",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space)] mb-6">
            Trusted by <span className="text-[#a855f7]">Investigators</span>{" "}
            Worldwide
          </h2>
          <p className="text-xl text-[#9ca3af]">
            See what professionals say about their experience with InvestiGator
          </p>
        </div>

        {/* Testimonial carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-4">
                  <div className="glass rounded-2xl p-8 md:p-12 border border-[#374151]/50 text-center">
                    <Quote className="w-12 h-12 text-[#3b82f6]/30 mx-auto mb-6" />

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]"
                        />
                      ))}
                    </div>

                    <blockquote className="text-xl md:text-2xl text-[#f9fafb] leading-relaxed mb-8 font-light">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    <div className="flex items-center justify-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#a855f7] flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.image}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#f9fafb]">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-[#3b82f6]">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-[#1f2937] border border-[#374151] text-[#d1d5db] hover:bg-[#374151] hover:text-[#f9fafb] transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    current === idx
                      ? "w-8 bg-[#3b82f6]"
                      : "bg-[#374151] hover:bg-[#4b5563]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full bg-[#1f2937] border border-[#374151] text-[#d1d5db] hover:bg-[#374151] hover:text-[#f9fafb] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Logos */}
        <div className="mt-16 pt-16 border-t border-[#1f2937]">
          <p className="text-center text-sm text-[#6b7280] mb-8">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {[
              "Frost & Associates",
              "Global Bank Corp",
              "SecureNet",
              "DataFlow",
              "IntelPro",
              "CyberSec",
            ].map((company) => (
              <div
                key={company}
                className="text-xl font-bold text-[#4b5563] font-[family-name:var(--font-space)]"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
