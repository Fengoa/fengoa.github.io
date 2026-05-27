"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

// =============================================================================
// 06 — Scaling Law：幂律曲线（log-log 直线）
// =============================================================================

export function ScalingLawCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 50), 120);
    return () => clearInterval(timer);
  }, []);

  // 三条不同斜率的幂律曲线
  const curves = [
    { color: "#6366f1", alpha: 0.4, label: "N" },
    { color: "#f59e0b", alpha: 0.3, label: "D" },
    { color: "#10b981", alpha: 0.2, label: "C" },
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-br from-[#fafaf9] via-[#f5f5f4] to-[#fafaf9] dark:from-[#18181b] dark:via-[#1c1c20] dark:to-[#18181b]", className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 网格线 */}
        {[25, 50, 75].map((v) => (
          <g key={v}>
            <line x1={v} y1="15" x2={v} y2="85" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="0.3" />
            <line x1="15" y1={v} x2="85" y2={v} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="0.3" />
          </g>
        ))}
        {/* 幂律曲线 — 仅客户端渲染避免 hydration mismatch */}
        {mounted && curves.map((curve, ci) => {
          const points = Array.from({ length: Math.min(t + 5, 40) }, (_, i) => {
            const x = 18 + (i / 39) * 64;
            const y = 80 - (1 - Math.pow((i + 1) / 40, curve.alpha)) * 60 - ci * 3;
            return `${i === 0 ? "M" : "L"}${x},${y}`;
          }).join(" ");
          return <path key={ci} d={points} fill="none" stroke={curve.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />;
        })}
        {/* 轴标签 */}
        <text x="50" y="95" textAnchor="middle" className="text-[5px] font-mono fill-muted-foreground/50">log(compute)</text>
        <text x="8" y="50" textAnchor="middle" className="text-[5px] font-mono fill-muted-foreground/50" transform="rotate(-90,8,50)">log(loss)</text>
      </svg>
    </div>
  );
}

// =============================================================================
// 07 — RoPE：旋转的向量环
// =============================================================================

export function RoPECover({ className }: { className?: string }) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setAngle((a) => (a + 3) % 360), 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-br from-[#f5f3ff] via-[#ede9fe] to-[#f5f3ff] dark:from-[#1a1625] dark:via-[#1e1a2e] dark:to-[#1a1625]", className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 同心环（不同旋转频率） */}
        {[18, 28, 38].map((r, i) => (
          <g key={i} transform={`rotate(${angle * (i + 1) * 0.3}, 50, 50)`}>
            <circle cx="50" cy="50" r={r} fill="none" stroke={["#8b5cf6", "#a78bfa", "#c4b5fd"][i]} strokeWidth="0.8" opacity="0.5" strokeDasharray="4 4" />
            <circle cx={50 + r * Math.cos(((angle * (i + 1) * 0.3) * Math.PI) / 180)} cy={50 + r * Math.sin(((angle * (i + 1) * 0.3) * Math.PI) / 180)} r="2.5" fill={["#8b5cf6", "#a78bfa", "#c4b5fd"][i]} opacity="0.9" />
          </g>
        ))}
        {/* 中心点 */}
        <circle cx="50" cy="50" r="3" className="fill-violet-500 dark:fill-violet-400" opacity="0.8" />
        {/* 标签 */}
        <text x="50" y="75" textAnchor="middle" className="text-[5px] font-mono fill-violet-400/60">dim 0-1</text>
        <text x="50" y="80" textAnchor="middle" className="text-[4px] font-mono fill-violet-400/40">dim 2-3</text>
      </svg>
    </div>
  );
}

// =============================================================================
// 08 — 高效注意力：压缩/加速的视觉
// =============================================================================

export function EfficientAttentionCover({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(timer);
  }, []);

  const labels = ["Full KV", "GQA", "Flash"];
  const blocks = [
    [8, 8, 8, 8], // Full: 8 KV heads
    [8, 4, 4, 4], // GQA: 4 KV heads
    [8, 2, 2, 2], // Flash: 2 blocks (conceptual)
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] dark:from-[#052e16] dark:via-[#064e3b] dark:to-[#052e16]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-14">
        {/* Q 行 */}
        <div className="flex gap-1">
          {Array.from({ length: blocks[phase][0] }, (_, i) => (
            <motion.div key={`q-${i}`} className="w-3 h-3 rounded-sm bg-emerald-500" animate={{ scale: [1, 1.1, 1] }} transition={{ delay: i * 0.05, duration: 0.5 }} />
          ))}
        </div>
        <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">Q heads: 8</div>
        {/* KV 行 */}
        <div className="flex gap-1">
          {Array.from({ length: blocks[phase][1] }, (_, i) => (
            <motion.div key={`kv-${phase}-${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="w-3 h-3 rounded-sm bg-teal-500" />
          ))}
        </div>
        <div className="text-xs font-mono text-teal-700 dark:text-teal-300">KV heads: {blocks[phase][1]}</div>
        {/* 标签 */}
        <div className="text-xs font-mono font-semibold text-foreground/80 mt-1">{labels[phase]}</div>
      </div>
    </div>
  );
}

// =============================================================================
// 09 — SFT：指令→回复的格式化
// =============================================================================

export function SFTCover({ className }: { className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setShow((s) => !s), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a] dark:from-[#1c1508] dark:via-[#2a1f0a] dark:to-[#3b2c0f]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-12">
        {/* Instruction */}
        <div className="w-full rounded-lg border border-amber-300 dark:border-amber-600 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm">
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold mb-0.5">Instruction</div>
          <div className="text-xs text-foreground">What is 2+2?</div>
        </div>
        {/* Arrow */}
        <motion.div animate={{ opacity: show ? 1 : 0.4 }} className="text-amber-500 dark:text-amber-400 text-sm font-bold">↓</motion.div>
        {/* Response */}
        <motion.div animate={{ opacity: show ? 1 : 0.4, y: show ? 0 : 4 }} transition={{ duration: 0.4 }} className="w-full rounded-lg border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">Response</div>
          <div className="text-xs text-foreground">{show ? "4" : "..."}</div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// 10 — DPO：偏好对比（chosen vs rejected）
// =============================================================================

export function DPOCover({ className }: { className?: string }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8] dark:from-[#1f0a18] dark:via-[#2d1025] dark:to-[#3b1530]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-14">
        {/* Chosen */}
        <motion.div animate={{ scale: pulse ? 1.05 : 1, opacity: pulse ? 1 : 0.8 }} className="w-full rounded-lg border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-2.5 text-center shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">chosen</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">detailed, helpful</div>
        </motion.div>
        {/* VS */}
        <div className="text-xs font-mono font-bold text-foreground/60">vs</div>
        {/* Rejected */}
        <motion.div animate={{ scale: pulse ? 0.95 : 1, opacity: pulse ? 0.5 : 0.8 }} className="w-full rounded-lg border-2 border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-center shadow-sm">
          <div className="text-xs font-semibold text-red-600 dark:text-red-300 line-through">rejected</div>
          <div className="text-xs text-red-500 dark:text-red-400 mt-0.5">lazy, unhelpful</div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// 11 — 推理优化：压缩仪表盘
// =============================================================================

export function InferenceCover({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress((p) => (p + 2) % 100), 80);
    return () => clearInterval(timer);
  }, []);

  const angle = -135 + (progress / 100) * 270; // gauge from -135° to +135°

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] dark:from-[#0f1419] dark:via-[#111820] dark:to-[#0f1419]", className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 仪表背景弧 */}
        <path d="M 20 70 A 30 30 0 1 1 80 70" fill="none" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="4" strokeLinecap="round" />
        {/* 进度弧 */}
        <path d="M 20 70 A 30 30 0 1 1 80 70" fill="none" stroke="url(#gaugeGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${progress * 1.88} 188`} />
        {/* 指针 */}
        <line x1="50" y1="55" x2={50 + 20 * Math.cos((angle * Math.PI) / 180)} y2={55 + 20 * Math.sin((angle * Math.PI) / 180)} stroke="currentColor" className="text-foreground/60" strokeWidth="1" strokeLinecap="round" />
        <circle cx="50" cy="55" r="2" className="fill-foreground/40" />
        {/* 标签 */}
        <text x="25" y="82" className="text-[5px] font-mono fill-muted-foreground/50">FP32</text>
        <text x="70" y="82" className="text-[5px] font-mono fill-muted-foreground/50">INT4</text>
        <text x="50" y="92" textAnchor="middle" className="text-[6px] font-mono fill-foreground/50">{Math.round(progress / 100 * 8)}x faster</text>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// =============================================================================
// 12 — 部署：终端风格的服务架构
// =============================================================================

export function DeployCover({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % 3), 1200);
    return () => clearInterval(timer);
  }, []);

  const services = [
    { label: "FastAPI", port: "8000", color: "border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
    { label: "vLLM Engine", port: "GPU", color: "border-violet-400 bg-violet-500/10 text-violet-700 dark:text-violet-300" },
    { label: "Redis Cache", port: "6379", color: "border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-[#1e293b] dark:bg-[#0f172a]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-12">
        {/* 标题 */}
        <div className="text-xs font-mono text-slate-400 mb-1 self-start">$ docker compose up</div>
        {/* 服务方块 */}
        {services.map((svc, i) => (
          <motion.div key={svc.label} animate={{ opacity: active === i ? 1 : 0.6, scale: active === i ? 1.03 : 1 }} className={cn("w-full rounded-lg border px-4 py-2 flex items-center justify-between font-mono text-xs", svc.color)}>
            <span className="font-semibold">{svc.label}</span>
            <span className="text-xs opacity-70">:{svc.port}</span>
          </motion.div>
        ))}
        {/* 状态 */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400">healthy</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 13 — RAG：检索+生成的管道（清晰大字版）
// =============================================================================

export function RAGCover({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 4), 1500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { label: "Query", icon: "?", color: "bg-violet-500 text-white" },
    { label: "Retrieve", icon: "⌕", color: "bg-blue-500 text-white" },
    { label: "Context", icon: "◫", color: "bg-amber-500 text-white" },
    { label: "Generate", icon: "▶", color: "bg-emerald-500 text-white" },
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-12">
        {steps.map((s, i) => (
          <motion.div key={s.label} animate={{ opacity: step >= i ? 1 : 0.25, scale: step === i ? 1.05 : 1, x: step >= i ? 0 : -10 }} transition={{ duration: 0.3 }} className="w-full flex items-center gap-3">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold", step >= i ? s.color : "bg-white/10 text-white/30")}>
              {s.icon}
            </div>
            <span className={cn("font-mono text-sm font-semibold", step >= i ? "text-white" : "text-white/30")}>{s.label}</span>
            {i < 3 && <span className={cn("ml-auto text-xs", step > i ? "text-white/60" : "text-white/15")}>→</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// 14 — 全景图：分层架构图（大字清晰版）
// =============================================================================

export function LandscapeLLMCover({ className }: { className?: string }) {
  const layers = [
    { color: "bg-blue-400", label: "Data" },
    { color: "bg-indigo-400", label: "Architecture" },
    { color: "bg-emerald-400", label: "Pretrain" },
    { color: "bg-orange-400", label: "Alignment" },
    { color: "bg-pink-400", label: "Inference" },
    { color: "bg-amber-400", label: "Capability" },
    { color: "bg-green-400", label: "Evaluation" },
    { color: "bg-slate-400", label: "Application" },
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl", "bg-[#0f172a] dark:bg-[#020617]", className)}>
      <div className="absolute inset-0 flex flex-col items-stretch justify-center gap-1.5 px-10 py-12">
        {layers.map((layer, i) => (
          <motion.div key={layer.label} className="flex items-center gap-2" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <div className={cn("h-4 rounded-sm flex-1 origin-left", layer.color)} style={{ opacity: 0.85 }} />
            <span className="text-xs font-mono text-slate-400 w-16 text-right">{layer.label}</span>
          </motion.div>
        ))}
      </div>
      {/* 标题 */}
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <span className="text-xs font-mono text-slate-500 tracking-widest">FULL STACK</span>
      </div>
    </div>
  );
}
