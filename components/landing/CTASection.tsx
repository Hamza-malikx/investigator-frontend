// components/landing/CTASection.tsx
"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3b82f6]/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3b82f6]/10 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass rounded-3xl p-12 md:p-16 text-center border border-[#374151]/50 relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3b82f6]/20 to-transparent" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#a855f7]/20 to-transparent" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Start your free trial today
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] mb-6 leading-tight">
              Ready to Uncover the{" "}
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent">
                Truth?
              </span>
            </h2>

            <p className="text-xl text-[#9ca3af] mb-8 max-w-2xl mx-auto">
              Join thousands of investigators using AI to solve cases faster. No
              credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="secondary">
                  Schedule Demo
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#6b7280]">
              Free plan includes 100 API calls/month • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
