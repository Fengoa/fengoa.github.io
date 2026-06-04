"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 04 — AttentionFlow：Self-Attention 注意力权重动态分配
// =============================================================================

export function AttentionFlow() {
  const tokens = ["the", "king", "said", "to", "his"];
  // 真实点 attention：让 "his" 关注 "king" 和 "said"
  const weightsByQuery: number[][] = [
    [1.0, 0, 0, 0, 0], // the → 自己
    [0.15, 0.85, 0, 0, 0], // king → the/king
    [0.1, 0.6, 0.3, 0, 0], // said → king/said
    [0.1, 0.3, 0.5, 0.1, 0], // to → said
    [0.05, 0.45, 0.4, 0.05, 0.05], // his → king + said
  ];

  const [queryIdx, setQueryIdx] = useState(4);
  useEffect(() => {
    const timer = setInterval(() => {
      setQueryIdx((q) => (q + 1) % tokens.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [tokens.length]);

  const w = weightsByQuery[queryIdx];
  const N = tokens.length;

  return (
    <VisualFrame title="Self-Attention：动态决定关注历史每个位置的程度">
      <div className="flex flex-col items-center">
        {/* Key 标题 */}
        <div className="text-xs font-mono text-muted-foreground mb-2">
          Keys（历史 token）
        </div>

        {/* Keys 行：token 框 + 下方百分比，颜色随权重高亮 */}
        <div
          className="grid w-full max-w-md gap-2"
          style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
        >
          {tokens.map((tok, i) => {
            const visible = i <= queryIdx;
            const strong = w[i] > 0.4;
            const medium = w[i] > 0.15;
            return (
              <div key={`k-${i}`} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-full text-center px-2 py-1 rounded border font-mono text-xs transition-all",
                    !visible
                      ? "border-neutral-200 dark:border-neutral-800 bg-transparent text-muted-foreground/40"
                      : strong
                        ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                        : medium
                          ? "border-emerald-300/70 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700/80 dark:text-emerald-300/80"
                          : "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-foreground"
                  )}
                >
                  {tok}
                </div>
                <motion.div
                  key={`pct-${queryIdx}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: visible ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={cn(
                    "text-[11px] font-mono mt-1 tabular-nums transition-colors",
                    strong
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : medium
                        ? "text-emerald-500/80 dark:text-emerald-400/80"
                        : "text-muted-foreground/60"
                  )}
                >
                  {(w[i] * 100).toFixed(0)}%
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* 连接区：从 Keys 百分比下方，连到 Query 框上方，整段无遮挡 */}
        <svg
          className="my-1 w-full max-w-md"
          height="64"
          viewBox="0 0 100 64"
          preserveAspectRatio="none"
        >
          {tokens.map((_, i) => {
            // 每列中心的百分比 x 坐标
            const colCenter = (idx: number) => ((idx + 0.5) / N) * 100;
            const x1 = colCenter(i);
            const x2 = colCenter(queryIdx);
            if (w[i] <= 0.05) return null;
            return (
              <motion.path
                key={`p-${queryIdx}-${i}`}
                d={`M ${x1} 0 C ${x1} 32, ${x2} 32, ${x2} 64`}
                stroke="currentColor"
                className="text-emerald-500 dark:text-emerald-400"
                strokeWidth={Math.max(0.5, w[i] * 2.5)}
                fill="none"
                strokeOpacity={Math.min(1, 0.3 + w[i] * 0.8)}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Query 行 */}
        <div
          className="grid w-full max-w-md gap-2"
          style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
        >
          {tokens.map((tok, i) => (
            <div
              key={`q-${i}`}
              className={cn(
                "w-full text-center px-2 py-1 rounded border font-mono text-xs transition-all",
                i === queryIdx
                  ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-neutral-200 dark:border-neutral-800 bg-transparent text-muted-foreground/40"
              )}
            >
              {tok}
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-muted-foreground mt-2">
          Query（当前预测位置）
        </div>
      </div>
    </VisualFrame>
  );
}
