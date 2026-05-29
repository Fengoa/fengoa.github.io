"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 01 — NextTokenPrediction：核心概念演示
// 给定上文 "床前明月" → 预测下一个字符的概率分布
// =============================================================================

export function NextTokenPrediction() {
  const examples = useMemo(
    () => [
      {
        context: "床前明月",
        candidates: [
          { tok: "光", p: 0.82 },
          { tok: "下", p: 0.08 },
          { tok: "白", p: 0.04 },
          { tok: "色", p: 0.02 },
          { tok: "…", p: 0.04 },
        ],
      },
      {
        context: "举头望明",
        candidates: [
          { tok: "月", p: 0.91 },
          { tok: "天", p: 0.04 },
          { tok: "灯", p: 0.02 },
          { tok: "镜", p: 0.01 },
          { tok: "…", p: 0.02 },
        ],
      },
      {
        context: "低头思故",
        candidates: [
          { tok: "乡", p: 0.88 },
          { tok: "人", p: 0.06 },
          { tok: "土", p: 0.03 },
          { tok: "国", p: 0.01 },
          { tok: "…", p: 0.02 },
        ],
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % examples.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [examples.length]);

  const current = examples[idx];

  return (
    <VisualFrame title="语言模型的核心：P(next | context)">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-8 md:gap-12">
        {/* 上文 */}
        <div className="shrink-0">
          <div className="text-xs font-mono text-muted-foreground mb-2">
            context
          </div>
          <div className="flex flex-wrap items-center gap-1 h-9">
            <AnimatePresence mode="popLayout">
              {current.context.split("").map((ch, i) => (
                <motion.span
                  key={`${idx}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-base"
                >
                  {ch}
                </motion.span>
              ))}
            </AnimatePresence>
            {/* 箭头和 ? 在三个样本间结构不变，放在 AnimatePresence 之外避免每次切换重 mount 抖动 */}
            <span className="inline-flex items-center justify-center w-7 h-9 mx-1 text-neutral-400 dark:text-neutral-600 font-mono leading-none">
              →
            </span>
            {/* ? 框：用 SVG 描边做转圈虚线动画，比静态 dashed 边框更"活"且不抢眼 */}
            <span className="relative inline-flex items-center justify-center w-9 h-9">
              <svg
                className="absolute inset-0 w-full h-full text-violet-400 dark:text-violet-500"
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden
              >
                <rect
                  x="1"
                  y="1"
                  width="34"
                  height="34"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  pathLength="100"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-16"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
              <span className="relative font-mono text-base text-violet-500 dark:text-violet-400">
                ?
              </span>
            </span>
          </div>
        </div>

        {/* 概率分布 */}
        <div className="w-full sm:w-72 sm:shrink-0 min-w-0">
          <div className="text-xs font-mono text-muted-foreground mb-2">
            P(next | context)
          </div>
          <div className="space-y-1.5">
            {current.candidates.map((c, i) => (
              <div key={`${idx}-${c.tok}`} className="flex items-center gap-2">
                <span className="w-6 text-center font-mono text-sm text-foreground">
                  {c.tok}
                </span>
                <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.p * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0
                        ? "bg-violet-500 dark:bg-violet-400"
                        : "bg-neutral-300 dark:bg-neutral-700"
                    )}
                  />
                </div>
                <span className="w-12 text-right font-mono text-xs text-muted-foreground">
                  {(c.p * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
