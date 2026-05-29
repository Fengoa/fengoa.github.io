"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// =============================================================================
// ParamsVsDataRatio：参数量 N 与训练 token 数 D 的比值条形对比
// 比值定义：tokens per parameter = D / N，越大越"喂得饱"
// =============================================================================

type Row = {
  name: string;
  params: string;
  tokens: string;
  ratio: number; // D/N
  note: string;
  highlight?: boolean;
};

const ROWS: Row[] = [
  {
    name: "本项目（4M Shakespeare）",
    params: "4.17 M",
    tokens: "267 K",
    ratio: 0.06,
    note: "数据严重不足，参数比 token 还多",
    highlight: true,
  },
  {
    name: "GPT-3 (Kaplan 配比)",
    params: "175 B",
    tokens: "300 B",
    ratio: 1.7,
    note: "Chinchilla 之前的主流做法",
  },
  {
    name: "Chinchilla 70B (最优)",
    params: "70 B",
    tokens: "1.4 T",
    ratio: 20,
    note: "Hoffmann et al. 2022 推出的甜点",
  },
  {
    name: "LLaMA-2 70B",
    params: "70 B",
    tokens: "2.0 T",
    ratio: 28.6,
    note: "略多于 Chinchilla，为推理质量加码",
  },
  {
    name: "LLaMA-3 8B",
    params: "8 B",
    tokens: "15 T",
    ratio: 1875,
    note: "极端 over-train，换更便宜的推理",
  },
];

const MAX = 2000; // log 上限，便于 LLaMA-3 不至于挤爆

function widthOf(ratio: number) {
  // log scale，避免小数据点看不见
  const lo = Math.log10(0.05);
  const hi = Math.log10(MAX);
  const w = ((Math.log10(Math.max(ratio, 0.05)) - lo) / (hi - lo)) * 100;
  return Math.max(4, Math.min(100, w));
}

export function ParamsVsDataRatio() {
  const [hover, setHover] = useState<number | null>(0);

  return (
    <VisualFrame title="每个参数能分到多少 token：横轴是 log 刻度的 D/N 比值">
      <div className="flex flex-col gap-2">
        {ROWS.map((r, i) => (
          <button
            key={r.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={cn(
              "flex flex-col gap-1.5 px-3 py-2 rounded border text-left transition-colors",
              hover === i
                ? "border-violet-400 dark:border-violet-500 bg-violet-50/60 dark:bg-violet-950/30"
                : r.highlight
                ? "border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20"
                : "border-neutral-200 dark:border-neutral-800"
            )}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-medium">{r.name}</span>
              <span className="text-muted-foreground">
                N={r.params} · D={r.tokens}
              </span>
            </div>
            <div className="relative h-3 bg-neutral-100 dark:bg-neutral-900 rounded">
              <motion.div
                className={cn(
                  "absolute left-0 top-0 h-full rounded",
                  r.ratio < 1
                    ? "bg-rose-400 dark:bg-rose-500"
                    : r.ratio < 25
                    ? "bg-amber-400 dark:bg-amber-500"
                    : "bg-emerald-500 dark:bg-emerald-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${widthOf(r.ratio)}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-foreground">
                {r.ratio < 1
                  ? r.ratio.toFixed(2)
                  : r.ratio < 100
                  ? r.ratio.toFixed(1)
                  : Math.round(r.ratio)}
                ×
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{r.note}</span>
          </button>
        ))}
        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-rose-400 rounded" />
            数据不足
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-400 rounded" />
            接近 Chinchilla
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500 rounded" />
            数据充足
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}
