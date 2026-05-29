"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// ParamBreakdownPie：MiniGPT 42 万参数饼图 + 对比 GPT-2 Small 的占比
// =============================================================================

type Slice = {
  key: string;
  label: string;
  count: number; // 参数量
  color: string;
  hex: string;
};

const MINIGPT: Slice[] = [
  { key: "tok", label: "Token Embedding", count: 8320, color: "fill-violet-400", hex: "#a78bfa" },
  { key: "pos", label: "Position Embedding", count: 8192, color: "fill-amber-400", hex: "#fbbf24" },
  { key: "attn", label: "Attention", count: 131072, color: "fill-emerald-400", hex: "#34d399" },
  { key: "ffn", label: "FFN", count: 262144, color: "fill-sky-400", hex: "#38bdf8" },
  { key: "ln", label: "LayerNorm", count: 1024, color: "fill-rose-400", hex: "#fb7185" },
  { key: "lm", label: "LM Head", count: 8320, color: "fill-stone-400", hex: "#a8a29e" },
];

// GPT-2 Small（124M）大致比例：embedding 38M+38M=76M？实际略小，按公开实现：
// Token Embedding 50257*768 ≈ 38.6M, Position Embedding 1024*768 ≈ 0.8M
// Block × 12: Attention QKV+proj 4*768^2 ≈ 2.36M/层, FFN 768*3072 + 3072*768 ≈ 4.72M/层
// LN 忽略, LM Head 与 Token Embedding tied（不重复）
const GPT2: Slice[] = [
  { key: "tok", label: "Token Embedding", count: 38_597_376, color: "fill-violet-400", hex: "#a78bfa" },
  { key: "pos", label: "Position Embedding", count: 786_432, color: "fill-amber-400", hex: "#fbbf24" },
  { key: "attn", label: "Attention", count: 28_320_000, color: "fill-emerald-400", hex: "#34d399" },
  { key: "ffn", label: "FFN", count: 56_640_000, color: "fill-sky-400", hex: "#38bdf8" },
  { key: "ln", label: "LayerNorm", count: 50_000, color: "fill-rose-400", hex: "#fb7185" },
  { key: "lm", label: "LM Head", count: 0, color: "fill-stone-400", hex: "#a8a29e" }, // tied
];

const MODELS = [
  { key: "minigpt", name: "MiniGPT", total: "42 万", slices: MINIGPT },
  { key: "gpt2", name: "GPT-2 Small", total: "124M", slices: GPT2 },
];

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;
  return [
    `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    `L ${cx} ${cy}`,
    "Z",
  ].join(" ");
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function ParamBreakdownPie() {
  const [modelIdx, setModelIdx] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const model = MODELS[modelIdx];

  const total = model.slices.reduce((a, b) => a + b.count, 0);

  // 计算每片角度（reduce 累加，避免在 render 阶段 reassign 外部变量）
  const arcs = model.slices.reduce<Array<Slice & {
    fraction: number;
    startAngle: number;
    endAngle: number;
  }>>((acc, s) => {
    const fraction = s.count / total;
    const startAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -Math.PI / 2;
    const endAngle = startAngle + fraction * Math.PI * 2;
    acc.push({ ...s, fraction, startAngle, endAngle });
    return acc;
  }, []);

  return (
    <VisualFrame title="参数都长在哪？切换模型，会发现各模块的占比几乎不变">
      <div className="flex flex-col items-center gap-5">
        {/* 模型切换 */}
        <div className="flex gap-1 rounded border border-neutral-200 dark:border-neutral-800 p-1 bg-neutral-50 dark:bg-neutral-900">
          {MODELS.map((m, i) => (
            <button
              key={m.key}
              onClick={() => setModelIdx(i)}
              className={cn(
                "px-3 py-1 rounded font-mono text-xs transition-colors",
                modelIdx === i
                  ? "bg-violet-500 text-white dark:bg-violet-400 dark:text-neutral-900"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.name}（{m.total}）
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-6">
          {/* 饼图 */}
          <div className="flex justify-center">
            <svg viewBox="0 0 100 100" className="w-44 h-44">
              {arcs.map((a) => {
                if (a.fraction <= 0) return null;
                const isHover = hover === a.key;
                return (
                  <motion.path
                    key={a.key}
                    d={describeArc(50, 50, isHover ? 46 : 44, a.startAngle, a.endAngle)}
                    className={a.color}
                    onMouseEnter={() => setHover(a.key)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
              {/* 中心镂空 */}
              <circle cx={50} cy={50} r={18} className="fill-white dark:fill-neutral-950" />
              <text
                x={50}
                y={49}
                textAnchor="middle"
                className="text-[5px] font-mono fill-muted-foreground"
              >
                总参数
              </text>
              <text
                x={50}
                y={56}
                textAnchor="middle"
                className="text-[6px] font-mono fill-foreground font-semibold"
              >
                {model.total}
              </text>
            </svg>
          </div>

          {/* 图例 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
            {arcs.map((a) => {
              if (a.count === 0) return (
                <div key={a.key} className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.hex }} />
                  <span className="flex-1">{a.label}</span>
                  <span className="tabular-nums">tied</span>
                </div>
              );
              const isHover = hover === a.key;
              return (
                <button
                  key={a.key}
                  onMouseEnter={() => setHover(a.key)}
                  onMouseLeave={() => setHover(null)}
                  className={cn(
                    "flex items-center gap-2 text-xs font-mono px-1 py-0.5 rounded transition-colors text-left",
                    isHover
                      ? "bg-violet-50 dark:bg-violet-950/30 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: a.hex }}
                  />
                  <span className="flex-1 truncate">{a.label}</span>
                  <span className="tabular-nums text-foreground/80">
                    {(a.fraction * 100).toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-mono text-center text-muted-foreground max-w-lg leading-relaxed">
          模型从 42 万参数放大到 1.24 亿，FFN 和 Attention 占的比例几乎一致，结构是同一套，只是每个模块都按比例放大。
        </div>
      </div>
    </VisualFrame>
  );
}
