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
        <div className="text-[8px] font-mono text-emerald-700 dark:text-emerald-300">Q heads: 8</div>
        {/* KV 行 */}
        <div className="flex gap-1">
          {Array.from({ length: blocks[phase][1] }, (_, i) => (
            <motion.div key={`kv-${phase}-${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="w-3 h-3 rounded-sm bg-teal-500" />
          ))}
        </div>
        <div className="text-[8px] font-mono text-teal-700 dark:text-teal-300">KV heads: {blocks[phase][1]}</div>
        {/* 标签 */}
        <div className="text-[10px] font-mono font-semibold text-foreground/80 mt-1">{labels[phase]}</div>
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
          <div className="text-[8px] font-mono text-amber-600 dark:text-amber-400 font-semibold mb-0.5">Instruction</div>
          <div className="text-[11px] text-foreground">What is 2+2?</div>
        </div>
        {/* Arrow */}
        <motion.div animate={{ opacity: show ? 1 : 0.4 }} className="text-amber-500 dark:text-amber-400 text-sm font-bold">↓</motion.div>
        {/* Response */}
        <motion.div animate={{ opacity: show ? 1 : 0.4, y: show ? 0 : 4 }} transition={{ duration: 0.4 }} className="w-full rounded-lg border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm">
          <div className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">Response</div>
          <div className="text-[11px] text-foreground">{show ? "4" : "..."}</div>
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
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">chosen</div>
          <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">detailed, helpful</div>
        </motion.div>
        {/* VS */}
        <div className="text-[10px] font-mono font-bold text-foreground/60">vs</div>
        {/* Rejected */}
        <motion.div animate={{ scale: pulse ? 0.95 : 1, opacity: pulse ? 0.5 : 0.8 }} className="w-full rounded-lg border-2 border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-red-600 dark:text-red-300 line-through">rejected</div>
          <div className="text-[9px] text-red-500 dark:text-red-400 mt-0.5">lazy, unhelpful</div>
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
// 12 — 部署：容器/服务器图标
// =============================================================================

export function DeployCover({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % 3), 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#eff6ff] dark:from-[#0f1a2e] dark:via-[#101e33] dark:to-[#0f1a2e]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-14">
        {/* 三个容器方块 */}
        {["API", "Model", "Cache"].map((label, i) => (
          <motion.div key={label} animate={{ opacity: active === i ? 1 : 0.5, scale: active === i ? 1.05 : 1 }} className={cn("w-full rounded border px-3 py-1.5 text-center font-mono text-[9px]", active === i ? "border-blue-300 dark:border-blue-700 bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/30 text-muted-foreground")}>
            {label}
          </motion.div>
        ))}
        <div className="text-[8px] font-mono text-blue-500/50 mt-1">:8000</div>
      </div>
    </div>
  );
}

// =============================================================================
// 13 — RAG：检索+生成的管道
// =============================================================================

export function RAGCover({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 4), 1500);
    return () => clearInterval(timer);
  }, []);

  const steps = ["Query", "Retrieve", "Context", "Generate"];
  const colors = ["text-violet-500", "text-blue-500", "text-amber-500", "text-emerald-500"];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#faf5ff] dark:from-[#1a1025] dark:via-[#1c1230] dark:to-[#1a1025]", className)}>
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="flex flex-col gap-1.5 w-full">
          {steps.map((s, i) => (
            <motion.div key={s} animate={{ opacity: step >= i ? 1 : 0.3, x: step >= i ? 0 : -5 }} transition={{ duration: 0.3 }} className={cn("flex items-center gap-2 text-[10px] font-mono", step === i ? colors[i] : "text-muted-foreground/60")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", step >= i ? "bg-current" : "bg-muted-foreground/20")} />
              {s}
              {i < 3 && <span className="text-[8px] text-muted-foreground/30 ml-auto">→</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 14 — 全景图：分层堆叠的彩色条
// =============================================================================

export function LandscapeLLMCover({ className }: { className?: string }) {
  const layers = [
    { color: "bg-[#b5d4f4]", label: "Data" },
    { color: "bg-[#afa9ec]", label: "Arch" },
    { color: "bg-[#9fe1cb]", label: "Train" },
    { color: "bg-[#f5c4b3]", label: "Align" },
    { color: "bg-[#f4c0d1]", label: "Infer" },
    { color: "bg-[#fac775]", label: "Cap" },
    { color: "bg-[#c0dd97]", label: "Eval" },
    { color: "bg-[#d3d1c7]", label: "App" },
  ];

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", "bg-gradient-to-b from-[#fafaf9] to-[#f5f5f4] dark:from-[#1a1a18] dark:to-[#151514]", className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3px] px-16 py-14">
        {layers.map((layer, i) => (
          <motion.div key={layer.label} className={cn("w-full h-2.5 rounded-sm opacity-70", layer.color)} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[9px] font-mono text-foreground/30 tracking-wider">8 LAYERS</div>
      </div>
    </div>
  );
}
