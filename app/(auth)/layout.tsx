// app/(auth)/layout.tsx
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0f1e]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#3b82f6]/20 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#a855f7] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold font-[family-name:var(--font-space)] tracking-tight">
                Investi<span className="text-[#3b82f6]">Gator</span>
              </span>
            </div>
            <h1 className="text-5xl font-bold font-[family-name:var(--font-space)] leading-tight mb-6 bg-gradient-to-r from-white via-[#d1d5db] to-[#9ca3af] bg-clip-text text-transparent">
              Uncover Hidden
              <br />
              Connections
            </h1>
            <p className="text-xl text-[#d1d5db] leading-relaxed max-w-md">
              AI-powered intelligence platform for deep investigations. Map
              relationships, analyze evidence, and generate insights
              automatically.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              "Entity Extraction",
              "Relationship Mapping",
              "AI Analysis",
              "Real-time Collaboration",
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-[#1f2937]/80 border border-[#374151] text-sm text-[#d1d5db] backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative code snippet */}
        <div className="absolute bottom-8 left-16 right-16 glass rounded-xl p-4 font-[family-name:var(--font-jetbrains)] text-xs">
          <div className="flex items-center gap-2 mb-2 text-[#6b7280]">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span className="ml-2">investigation.json</span>
          </div>
          <pre className="text-[#10b981] overflow-x-auto">
            <code>{`{
  "status": "analyzing",
  "entities_found": 42,
  "confidence": 0.94,
  "insights": [...]
}`}</code>
          </pre>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0f1e] relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a855f7]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
