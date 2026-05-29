"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// LayerNormEffect：调节"前一层 scale"，看张量分布
// 左：未归一化的直方图（scale 大就爆炸）
// 右：LayerNorm 之后被压回均值 0、方差 1
// =============================================================================

const D = 64; // 向量维度
const BINS = 24;
const RANGE = 8; // 显示区间 [-RANGE, RANGE]

// 用一个固定 seed 的简单伪随机，避免组件重渲染时分布跳变
function pseudoNormal(i: number, j: number) {
  // 两次混合 + sin 制造类正态分布
  const u = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
  const r = u - Math.floor(u);
  // Box-Muller-ish
  const v = Math.sin(j * 39.32 + i * 11.135) * 24634.6345;
  const r2 = v - Math.floor(v);
  return Math.sqrt(-2 * Math.log(r + 1e-9)) * Math.cos(2 * Math.PI * r2);
}

function makeVector(scale: number) {
  const vec: number[] = [];
  for (let i = 0; i < D; i++) {
    vec.push(pseudoNormal(7, i) * scale + (scale - 1) * 0.3); // 加一点偏移
  }
  return vec;
}

function layerNorm(v: number[]) {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance =
    v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  const std = Math.sqrt(variance + 1e-5);
  return v.map((x) => (x - mean) / std);
}

function histogram(values: number[]) {
  const bins = new Array(BINS).fill(0);
  for (const v of values) {
    if (v < -RANGE || v > RANGE) {
      // 超界堆到边缘
      bins[v < 0 ? 0 : BINS - 1] += 1;
      continue;
    }
    const idx = Math.min(
      BINS - 1,
      Math.floor(((v + RANGE) / (2 * RANGE)) * BINS)
    );
    bins[idx] += 1;
  }
  return bins;
}

function Histogram({
  bins,
  color,
}: {
  bins: number[];
  color: "amber" | "violet";
}) {
  const max = Math.max(...bins, 1);
  const colorCls =
    color === "amber"
      ? "bg-amber-500/80 dark:bg-amber-400/80"
      : "bg-violet-500/80 dark:bg-violet-400/80";
  return (
    <div className="flex items-end gap-px h-24">
      {bins.map((b, i) => (
        <div key={i} className="flex-1 flex items-end">
          <motion.div
            animate={{ height: `${(b / max) * 100}%` }}
            transition={{ duration: 0.4 }}
            className={cn("w-full rounded-t", colorCls)}
            style={{ minHeight: b > 0 ? 2 : 0 }}
          />
        </div>
      ))}
    </div>
  );
}

function stats(v: number[]) {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance =
    v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  return { mean, std: Math.sqrt(variance) };
}

export function LayerNormEffect() {
  const [scale, setScale] = useState(1);
  const raw = useMemo(() => makeVector(scale), [scale]);
  const normed = useMemo(() => layerNorm(raw), [raw]);
  const rawStats = stats(raw);
  const normStats = stats(normed);

  return (
    <VisualFrame title="LayerNorm 把 64 维向量重新拉回到均值 0、方差 1">
      <div className="flex flex-col items-center gap-5">
        {/* 滑块 */}
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            前一层 scale
          </span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1 accent-violet-500"
          />
          <span className="font-mono text-xs tabular-nums text-foreground w-12 text-right">
            ×{scale.toFixed(1)}
          </span>
        </div>

        {/* 两栏直方图 */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded border border-amber-300/60 dark:border-amber-800 p-4 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="font-mono text-xs mb-2 flex items-baseline justify-between">
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                LayerNorm 之前
              </span>
              <span className="text-muted-foreground">
                μ={rawStats.mean.toFixed(2)}, σ={rawStats.std.toFixed(2)}
              </span>
            </div>
            <Histogram bins={histogram(raw)} color="amber" />
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              scale 越大，分布越宽，下层就要面对越大的输入
            </div>
          </div>

          <div className="rounded border border-violet-300/60 dark:border-violet-800 p-4 bg-violet-50/30 dark:bg-violet-950/20">
            <div className="font-mono text-xs mb-2 flex items-baseline justify-between">
              <span className="font-semibold text-violet-700 dark:text-violet-300">
                LayerNorm 之后
              </span>
              <span className="text-muted-foreground">
                μ={normStats.mean.toFixed(2)}, σ={normStats.std.toFixed(2)}
              </span>
            </div>
            <Histogram bins={histogram(normed)} color="violet" />
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              不管前面 scale 多大，进 attention / FFN 的都是同一档幅度
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
