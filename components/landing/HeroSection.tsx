// components/landing/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor(window.innerWidth / 10);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2,
          opacity: Math.random() * 0.5,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3b82f6]/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-[128px] animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f2937]/80 border border-[#374151] text-sm text-[#d1d5db] backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#a855f7]" />
              <span>Now with Gemini powered analysis</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space)] leading-tight">
              Uncover{" "}
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Hidden Truths
              </span>
              <br />
              with AI Intelligence
            </h1>

            <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform scattered data into actionable intelligence. Our AI maps
              relationships, extracts entities, and reveals connections
              invisible to the human eye.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start Investigating
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="secondary"
                className="group w-full sm:w-auto"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-[#6b7280]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#10b981]" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#f59e0b]" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3b82f6]" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Main visualization card */}
            <div className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl border border-[#374151]/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                </div>
                <span className="text-xs text-[#6b7280] font-[family-name:var(--font-jetbrains)]">
                  investigation_001.json
                </span>
              </div>

              {/* Graph visualization */}
              <div className="relative h-64 bg-[#0a0f1e] rounded-xl overflow-hidden mb-6">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Connection lines */}
                  <line
                    x1="20%"
                    y1="30%"
                    x2="50%"
                    y2="50%"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="30%"
                    stroke="#a855f7"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="80%"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <line
                    x1="20%"
                    y1="30%"
                    x2="50%"
                    y2="80%"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />

                  {/* Nodes */}
                  <circle
                    cx="20%"
                    cy="30%"
                    r="20"
                    fill="#3b82f6"
                    className="animate-pulse"
                  />
                  <circle cx="50%" cy="50%" r="25" fill="#a855f7" />
                  <circle cx="80%" cy="30%" r="18" fill="#10b981" />
                  <circle cx="50%" cy="80%" r="15" fill="#f59e0b" />
                </svg>

                {/* Floating labels */}
                <div className="absolute top-[20%] left-[15%] px-2 py-1 rounded bg-[#1f2937]/90 text-xs text-[#3b82f6] font-[family-name:var(--font-jetbrains)]">
                  Person
                </div>
                <div className="absolute top-[45%] left-[55%] px-2 py-1 rounded bg-[#1f2937]/90 text-xs text-[#a855f7] font-[family-name:var(--font-jetbrains)]">
                  Company
                </div>
                <div className="absolute top-[20%] right-[15%] px-2 py-1 rounded bg-[#1f2937]/90 text-xs text-[#10b981] font-[family-name:var(--font-jetbrains)]">
                  Location
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-[#1f2937]/50">
                  <div className="text-2xl font-bold text-[#3b82f6]">47</div>
                  <div className="text-xs text-[#6b7280]">Entities</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#1f2937]/50">
                  <div className="text-2xl font-bold text-[#a855f7]">128</div>
                  <div className="text-xs text-[#6b7280]">Connections</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#1f2937]/50">
                  <div className="text-2xl font-bold text-[#10b981]">94%</div>
                  <div className="text-xs text-[#6b7280]">Confidence</div>
                </div>
              </div>

              {/* Scanning line animation */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent animate-[scan_3s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 glass rounded-lg p-3 shadow-xl animate-float">
              <div className="flex items-center gap-2 text-sm text-[#10b981]">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                Analysis Complete
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 glass rounded-lg p-3 shadow-xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2 text-xs text-[#d1d5db]">
                <Shield className="w-4 h-4 text-[#3b82f6]" />
                Encrypted & Secure
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280] animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#3b82f6] to-transparent" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
