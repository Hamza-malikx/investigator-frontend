// components/landing/DemoSection.tsx
"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoom, setZoom] = useState(100);

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space)] mb-6">
            See It In <span className="text-[#3b82f6]">Action</span>
          </h2>
          <p className="text-xl text-[#9ca3af]">
            Watch how InvestiGator transforms complex data into clear,
            actionable intelligence
          </p>
        </div>

        {/* Demo container */}
        <div className="relative rounded-2xl overflow-hidden bg-[#111827] border border-[#1f2937] shadow-2xl shadow-black/50">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1e] border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg hover:bg-[#1f2937] text-[#9ca3af] transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="p-2 rounded-lg hover:bg-[#1f2937] text-[#9ca3af] transition-colors">
                <RotateCcw size={18} />
              </button>
              <div className="w-px h-4 bg-[#374151] mx-2" />
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 rounded-lg hover:bg-[#1f2937] text-[#9ca3af] transition-colors"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-xs text-[#6b7280] w-12 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-2 rounded-lg hover:bg-[#1f2937] text-[#9ca3af] transition-colors"
              >
                <ZoomIn size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#1f2937] text-[#9ca3af] transition-colors">
                <Maximize size={18} />
              </button>
            </div>
          </div>

          {/* Demo content */}
          <div className="aspect-video relative bg-[#0a0f1e] overflow-hidden">
            {/* Animated network graph simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative w-full h-full transition-transform duration-300"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {/* Background grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, #374151 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                />

                {/* Central node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] animate-pulse">
                    <span className="text-white font-bold text-lg">ACME</span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-[#1f2937] text-xs text-[#f9fafb] border border-[#374151]">
                      Target Company
                    </span>
                  </div>
                </div>

                {/* Orbiting nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <div
                    key={angle}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translateX(200px) rotate(-${angle}deg) translate(-50%, -50%)`,
                      animation: isPlaying
                        ? `orbit ${20 + i * 5}s linear infinite`
                        : "none",
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                        i % 2 === 0 ? "bg-[#a855f7]" : "bg-[#10b981]"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs text-[#9ca3af]">
                        Entity {i + 1}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <line
                      key={angle}
                      x1="50%"
                      y1="50%"
                      x2={`${50 + 30 * Math.cos((angle * Math.PI) / 180)}%`}
                      y2={`${50 + 30 * Math.sin((angle * Math.PI) / 180)}%`}
                      stroke="#3b82f6"
                      strokeWidth="1"
                      opacity="0.3"
                      strokeDasharray="5,5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="10"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </line>
                  ))}
                </svg>
              </div>
            </div>

            {/* Floating info cards */}
            <div className="absolute top-4 right-4 w-64 glass rounded-xl p-4 border border-[#374151]/50">
              <h4 className="text-sm font-semibold text-[#f9fafb] mb-3">
                Analysis Progress
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9ca3af]">Entities Found</span>
                    <span className="text-[#3b82f6]">47</span>
                  </div>
                  <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[#3b82f6] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9ca3af]">Relationships</span>
                    <span className="text-[#a855f7]">128</span>
                  </div>
                  <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-[#a855f7] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9ca3af]">Confidence</span>
                    <span className="text-[#10b981]">94.2%</span>
                  </div>
                  <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-[#10b981] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f1e] to-transparent">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {[
                  { time: "10:00", event: "Document uploaded" },
                  { time: "10:02", event: "Text extracted" },
                  { time: "10:05", event: "Entities identified" },
                  { time: "10:08", event: "Relations mapped", active: true },
                  { time: "10:12", event: "Report generated" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item.active ? "bg-[#3b82f6] animate-pulse" : "bg-[#374151]"}`}
                    />
                    <div className="text-xs">
                      <div className="text-[#6b7280]">{item.time}</div>
                      <div
                        className={
                          item.active ? "text-[#3b82f6]" : "text-[#9ca3af]"
                        }
                      >
                        {item.event}
                      </div>
                    </div>
                    {idx < 4 && <div className="w-8 h-px bg-[#374151]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights below demo */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              label: "Processing Speed",
              value: "< 2 min",
              desc: "Per 1000 pages",
            },
            {
              label: "Entity Types",
              value: "50+",
              desc: "Person, Org, Location, etc.",
            },
            {
              label: "Data Sources",
              value: "Unlimited",
              desc: "Connect any API",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-[#111827]/50 border border-[#1f2937]"
            >
              <div className="text-3xl font-bold text-[#f9fafb] mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-[#3b82f6] mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-[#6b7280]">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(200px) rotate(0deg)
              translate(-50%, -50%);
          }
          to {
            transform: rotate(360deg) translateX(200px) rotate(-360deg)
              translate(-50%, -50%);
          }
        }
      `}</style>
    </section>
  );
}
