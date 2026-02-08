// src/components/landing/HeroSection.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Shield,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface Connection {
  p1: Particle;
  p2: Particle;
  opacity: number;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const frameCount = useRef(0);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(Math.floor(width / 8), 150);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
    return particles;
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      frameCount.current++;
      const rect = container.getBoundingClientRect();
      ctx.fillStyle = "rgba(10, 15, 30, 0.15)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // const particles = particlesRef.current;
      const connections: Connection[] = [];

      // Update and draw particles
      // particles.forEach((p, i) => {
      //   // Mouse interaction (only process every 2nd frame for performance)
      //   if (frameCount.current % 2 === 0 && isHovering) {
      //     const dx = mousePos.x - p.x;
      //     const dy = mousePos.y - p.y;
      //     const dist = Math.sqrt(dx * dx + dy * dy);
      //     if (dist < 150) {
      //       const force = (150 - dist) / 150;
      //       p.vx -= (dx / dist) * force * 0.5;
      //       p.vy -= (dy / dist) * force * 0.5;
      //     }
      //   }

      //   // Apply velocity with damping
      //   p.vx *= 0.99;
      //   p.vy *= 0.99;
      //   p.x += p.vx;
      //   p.y += p.vy;

      //   // Boundary wrap
      //   if (p.x < 0) p.x = rect.width;
      //   if (p.x > rect.width) p.x = 0;
      //   if (p.y < 0) p.y = rect.height;
      //   if (p.y > rect.height) p.y = 0;

      //   // Pulse animation
      //   p.pulse += p.pulseSpeed;
      //   const pulseFactor = 1 + Math.sin(p.pulse) * 0.3;

      //   // Draw particle with glow
      //   const gradient = ctx.createRadialGradient(
      //     p.x,
      //     p.y,
      //     0,
      //     p.x,
      //     p.y,
      //     p.size * 3 * pulseFactor,
      //   );
      //   gradient.addColorStop(0, `rgba(59, 130, 246, ${p.opacity})`);
      //   gradient.addColorStop(0.5, `rgba(59, 130, 246, ${p.opacity * 0.3})`);
      //   gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

      //   ctx.beginPath();
      //   ctx.arc(p.x, p.y, p.size * 3 * pulseFactor, 0, Math.PI * 2);
      //   ctx.fillStyle = gradient;
      //   ctx.fill();

      //   // Core
      //   ctx.beginPath();
      //   ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      //   ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
      //   ctx.fill();

      //   // Find connections (limit to every 3rd particle for performance)
      //   if (i % 3 === 0) {
      //     for (let j = i + 1; j < particles.length; j += 2) {
      //       const p2 = particles[j];
      //       const dx = p.x - p2.x;
      //       const dy = p.y - p2.y;
      //       const dist = Math.sqrt(dx * dx + dy * dy);

      //       if (dist < 120) {
      //         connections.push({ p1: p, p2, opacity: 1 - dist / 120 });
      //       }
      //     }
      //   }
      // });

      // Draw connections with gradient
      connections.forEach((conn, i) => {
        if (i % 2 !== 0) return; // Skip every other connection

        const gradient = ctx.createLinearGradient(
          conn.p1.x,
          conn.p1.y,
          conn.p2.x,
          conn.p2.y,
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${conn.opacity * 0.3})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${conn.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${conn.opacity * 0.3})`);

        ctx.beginPath();
        ctx.moveTo(conn.p1.x, conn.p1.y);
        ctx.lineTo(conn.p2.x, conn.p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw mouse glow
      if (isHovering) {
        const gradient = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          0,
          mousePos.x,
          mousePos.y,
          200,
        );
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, mousePos, isHovering]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Multi-layer gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3b82f6]/10 rounded-full blur-[120px] animate-pulse-glow mix-blend-screen" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#a855f7]/10 rounded-full blur-[100px] animate-pulse-glow mix-blend-screen"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#10b981]/5 rounded-full blur-[150px] animate-pulse-glow mix-blend-screen"
        style={{ animationDelay: "4s" }}
      />

      {/* Scanning grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating data fragments */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute glass rounded-lg px-3 py-2 text-xs font-[family-name:var(--font-jetbrains)] text-[#6b7280] border border-[#374151]/30 animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i}s`,
            }}
          >
            {`{ entity: "${["Person", "Org", "Location", "Event", "Document", "Financial"][i]}", confidence: ${(0.85 + Math.random() * 0.14).toFixed(2)} }`}
          </div>
        ))}
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f2937]/80 border border-[#374151] text-sm text-[#d1d5db] backdrop-blur-sm hover:border-[#3b82f6]/50 transition-colors cursor-default group">
              <Sparkles className="w-4 h-4 text-[#a855f7] group-hover:rotate-12 transition-transform" />
              <span>Now with GPT-4 powered analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse ml-1" />
            </div>

            {/* Headline with gradient animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space)] leading-[1.1] tracking-tight">
              <span className="block text-[#f9fafb] mb-2">Uncover</span>
              <span className="block bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#3b82f6] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                Hidden Truths
              </span>
              <span className="block text-[#9ca3af] mt-2 text-4xl sm:text-5xl lg:text-6xl font-light">
                with AI Intelligence
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-[#9ca3af] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform scattered data into actionable intelligence. Our neural
              networks map invisible relationships, extract entities, and reveal
              patterns at
              <span className="text-[#3b82f6] font-semibold">
                {" "}
                machine speed
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group relative overflow-hidden w-full h-14 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] hover:from-[#818cf8] hover:via-[#a78bfa] hover:to-[#c084fc] border-0 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center font-semibold tracking-wide">
                    Start Investigating
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Button
                size="lg"
                variant="secondary"
                className="group w-full sm:w-auto h-14 px-8 bg-[#1e1b4b]/60 hover:bg-[#1e1b4b]/80 border border-[#4c1d95]/30 hover:border-[#7c3aed]/50 text-[#e0e7ff] backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#4f46e5]/20 flex items-center justify-center mr-3 group-hover:bg-[#4f46e5]/30 group-hover:scale-110 transition-all">
                  <Play className="w-3.5 h-3.5 text-[#818cf8] fill-[#818cf8] ml-0.5" />
                </div>
                <span className="font-semibold tracking-wide">Watch Demo</span>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              {[
                { icon: Shield, text: "SOC 2 Certified", color: "#10b981" },
                { icon: Zap, text: "Real-time Analysis", color: "#f59e0b" },
                { icon: Sparkles, text: "99.9% Accuracy", color: "#3b82f6" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-[#6b7280] group cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1f2937] flex items-center justify-center group-hover:bg-[#374151] transition-colors">
                    <item.icon
                      className="w-4 h-4"
                      style={{ color: item.color }}
                    />
                  </div>
                  <span className="group-hover:text-[#9ca3af] transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Live stats ticker */}
            <div className="flex items-center gap-6 pt-6 border-t border-[#1f2937]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f9fafb] font-[family-name:var(--font-space)]">
                  50K+
                </div>
                <div className="text-xs text-[#6b7280] uppercase tracking-wider">
                  Cases Solved
                </div>
              </div>
              <div className="w-px h-10 bg-[#374151]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f9fafb] font-[family-name:var(--font-space)]">
                  2M+
                </div>
                <div className="text-xs text-[#6b7280] uppercase tracking-wider">
                  Entities Mapped
                </div>
              </div>
              <div className="w-px h-10 bg-[#374151]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f9fafb] font-[family-name:var(--font-space)]">
                  10x
                </div>
                <div className="text-xs text-[#6b7280] uppercase tracking-wider">
                  Faster
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Visualization */}
          <div className="relative lg:h-[700px] flex items-center justify-center">
            {/* Main holographic card */}
            <div className="relative w-full max-w-lg transform hover:scale-[1.02] transition-transform duration-500">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#3b82f6]/20 via-[#a855f7]/20 to-[#3b82f6]/20 rounded-3xl blur-2xl opacity-50 animate-pulse-glow" />

              <div className="relative glass rounded-2xl border border-[#374151]/50 overflow-hidden shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#0a0f1e]/50 border-b border-[#374151]/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                      <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="h-4 w-px bg-[#374151] mx-2" />
                    <span className="text-xs text-[#6b7280] font-[family-name:var(--font-jetbrains)]">
                      investigation_alpha.json
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-xs text-[#10b981]">LIVE</span>
                  </div>
                </div>

                {/* 3D Network Visualization */}
                <div className="relative h-80 bg-[#0a0f1e] overflow-hidden">
                  {/* Central hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.5)] animate-pulse">
                        <span className="text-white font-bold text-lg tracking-wider">
                          CORE
                        </span>
                      </div>
                      {/* Orbiting rings */}
                      <div className="absolute inset-0 -m-8 border-2 border-[#3b82f6]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-0 -m-16 border border-[#a855f7]/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                  </div>

                  {/* Satellite nodes */}
                  {[
                    { angle: 0, color: "#a855f7", label: "PERSON", dist: 140 },
                    { angle: 60, color: "#10b981", label: "ORG", dist: 120 },
                    { angle: 120, color: "#f59e0b", label: "LOC", dist: 160 },
                    { angle: 180, color: "#ef4444", label: "EVENT", dist: 130 },
                    { angle: 240, color: "#06b6d4", label: "DOC", dist: 150 },
                    { angle: 300, color: "#ec4899", label: "FIN", dist: 110 },
                  ].map((node, i) => {
                    const rad = (node.angle * Math.PI) / 180;
                    const x = 50 + (node.dist / 320) * 50 * Math.cos(rad);
                    const y = 50 + (node.dist / 320) * 50 * Math.sin(rad);

                    return (
                      <div
                        key={node.label}
                        className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-float cursor-pointer hover:scale-125 transition-transform z-10"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          backgroundColor: node.color,
                          boxShadow: `0 0 30px ${node.color}40`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      >
                        {node.label[0]}

                        {/* Connection line to center */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                          style={{
                            transform: "translate(-50%, -50%)",
                            left: "50%",
                            top: "50%",
                          }}
                        >
                          <line
                            x1="0"
                            y1="0"
                            x2={`${-node.dist * Math.cos(rad)}px`}
                            y2={`${-node.dist * Math.sin(rad)}px`}
                            stroke={node.color}
                            strokeWidth="2"
                            strokeDasharray="4,4"
                            opacity="0.4"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="0"
                              to="8"
                              dur="1s"
                              repeatCount="indefinite"
                            />
                          </line>
                        </svg>

                        {/* Label */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-[#1f2937]/90 text-[10px] text-[#9ca3af] border border-[#374151]/50">
                          {node.label}
                        </div>
                      </div>
                    );
                  })}

                  {/* Data particles flowing along paths */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]"
                        style={{
                          left: "50%",
                          top: "50%",
                          animation: `orbit${i} ${3 + i}s linear infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Real-time metrics */}
                <div className="grid grid-cols-3 gap-px bg-[#374151]/30">
                  {[
                    {
                      label: "ENTITIES",
                      value: "47",
                      color: "#3b82f6",
                      trend: "+12%",
                    },
                    {
                      label: "CONNECTIONS",
                      value: "128",
                      color: "#a855f7",
                      trend: "+28%",
                    },
                    {
                      label: "CONFIDENCE",
                      value: "94%",
                      color: "#10b981",
                      trend: "+5%",
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-[#111827]/80 p-4 text-center group hover:bg-[#1f2937]/80 transition-colors"
                    >
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{ color: metric.color }}
                      >
                        {metric.value}
                        <span className="text-xs ml-1 text-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity">
                          {metric.trend}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6b7280] tracking-wider">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terminal output */}
                <div className="bg-[#0a0f1e] px-4 py-3 border-t border-[#374151]/50 font-[family-name:var(--font-jetbrains)] text-xs">
                  <div className="flex items-center gap-2 text-[#6b7280] mb-2">
                    <span className="text-[#10b981]">➜</span>
                    <span>~</span>
                    <span className="text-[#3b82f6]">investigator</span>
                    <span className="animate-pulse">_</span>
                  </div>
                  <div className="space-y-1 text-[#9ca3af]">
                    <p className="text-[#10b981]">✓ Analysis complete (1.2s)</p>
                    <p>
                      Found{" "}
                      <span className="text-[#3b82f6]">
                        12 high-value targets
                      </span>
                    </p>
                    <p className="text-[#f59e0b]">⚠ 3 anomalies detected</p>
                  </div>
                </div>

                {/* Scanning effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50"
                    style={{
                      animation: "scan 3s ease-in-out infinite",
                      boxShadow: "0 0 20px #3b82f6",
                    }}
                  />
                </div>
              </div>

              {/* Floating status indicators */}
              <div className="absolute -top-6 -right-6 glass rounded-lg px-4 py-2 border border-[#10b981]/30 animate-float">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[#10b981] font-medium">
                    System Online
                  </span>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -left-6 glass rounded-lg px-4 py-2 border border-[#3b82f6]/30 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  <span>Neural Network Active</span>
                </div>
              </div>

              <div
                className="absolute top-1/2 -right-12 glass rounded-lg px-3 py-2 border border-[#a855f7]/30 animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="text-xs text-[#a855f7] font-mono">
                  AI v2.4.1
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280] group cursor-pointer hover:text-[#3b82f6] transition-colors">
          <span className="text-xs uppercase tracking-widest font-medium">
            Explore
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            top: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        @keyframes orbit0 {
          from {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
        @keyframes orbit1 {
          from {
            transform: rotate(120deg) translateX(120px) rotate(-120deg);
          }
          to {
            transform: rotate(480deg) translateX(120px) rotate(-480deg);
          }
        }
        @keyframes orbit2 {
          from {
            transform: rotate(240deg) translateX(80px) rotate(-240deg);
          }
          to {
            transform: rotate(600deg) translateX(80px) rotate(-600deg);
          }
        }
      `}</style>
    </section>
  );
}
