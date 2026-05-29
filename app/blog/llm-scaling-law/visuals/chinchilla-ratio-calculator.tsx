"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// =============================================================================
// ChinchillaRatioCalculator：拖动参数量滑块，自动算 Chinchilla 推荐 token 数
// 提示当前真实大模型在哪个区间，直观看到 GPT-3 数据不足
// =============================================================================

const REFS = [
  { name: "GPT-3", N: 175e9, D: 300e9 },
  { name: "Chinchilla 70B", N: 70e9, D: 1.4e12 },
  { name: "LLaMA-2 70B", N: 70e9, D: 2e12 },
  { name: "LLaMA-3 8B", N: 8e9, D: 15e12 },
];

function fmt(x: number) {
  if (x >= 1e12) return `${(x / 1e12).toFixed(2)} T`;
  if (x >= 1e9) return `${(x / 1e9).toFixed(2)} B`;
  if (x >= 1e6) return `${(x / 1e6).toFixed(2)} M`;
  if (x >= 1e3) return `${(x / 1e3).toFixed(2)} K`;
  return x.toFixed(0);
}

export function ChinchillaRatioCalculator() {
  // 用 log10(N) 作为滑块值，区间 [6, 12.5]，覆盖 1M ~ 300B
  const [logN, setLogN] = useState(10); // 10B 默认
  const N = Math.pow(10, logN);
  const D = 20 * N;
  const flops = 6 * N * D;

  const closest = REFS.reduce((best, r) => {
    return Math.abs(Math.log10(r.N) - logN) <
      Math.abs(Math.log10(best.N) - logN)
      ? r
      : best;
  }, REFS[0]);
  const closestRatio = closest.D / closest.N;
  const isUnderfed = closestRatio < 15;

  return (
    <VisualFrame title="拖动参数量，看 Chinchilla 推荐多少 token，再对照真实大模型">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-mono">
          <span className="text-muted-foreground">
            参数量 N ={" "}
            <span className="text-foreground text-sm">{fmt(N)}</span>
          </span>
          <input
            type="range"
            min={6}
            max={12.5}
            step={0.05}
            value={logN}
            onChange={(e) => setLogN(parseFloat(e.target.value))}
            className="accent-violet-500 w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1M</span>
            <span>1B</span>
            <span>10B</span>
            <span>100B</span>
            <span>1T</span>
          </div>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="px-3 py-2 rounded border border-violet-200 dark:border-violet-700/60 bg-violet-50/40 dark:bg-violet-950/20">
            <div className="text-muted-foreground">推荐 token 数（D = 20 N）</div>
            <div className="text-violet-700 dark:text-violet-400 text-base">
              {fmt(D)}
            </div>
          </div>
          <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800">
            <div className="text-muted-foreground">所需算力（C ≈ 6 N D）</div>
            <div className="text-foreground text-base">
              {flops.toExponential(2)} FLOPs
            </div>
          </div>
          <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800">
            <div className="text-muted-foreground">最接近的真实模型</div>
            <div className="text-foreground text-base">{closest.name}</div>
            <div
              className={cn(
                "text-[11px]",
                isUnderfed
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              实际 D/N = {closestRatio.toFixed(1)}×{" "}
              {isUnderfed ? "（数据不足）" : "（充分喂养）"}
            </div>
          </div>
        </div>

        {/* 真实模型对照 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {REFS.map((r) => {
            const ratio = r.D / r.N;
            return (
              <button
                key={r.name}
                onClick={() => setLogN(Math.log10(r.N))}
                className={cn(
                  "px-2 py-2 rounded border text-left transition-colors",
                  closest.name === r.name
                    ? "border-violet-400 bg-violet-50/60 dark:bg-violet-950/30"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-violet-300"
                )}
              >
                <div className="text-foreground">{r.name}</div>
                <div className="text-muted-foreground text-[10px]">
                  N={fmt(r.N)} · D={fmt(r.D)}
                </div>
                <motion.div
                  className={cn(
                    "mt-1 h-1.5 rounded",
                    ratio < 15
                      ? "bg-rose-400"
                      : ratio < 25
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (ratio / 30) * 100)}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  D/N = {ratio.toFixed(1)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </VisualFrame>
  );
}
