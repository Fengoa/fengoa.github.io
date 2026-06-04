"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 03 — MLPWindow：16 字符滑动窗口送入 MLP
// =============================================================================

export function MLPWindow() {
  const text =
    "Before we proceed any further, hear me speak. All: Speak, speak.".split("");
  const winSize = 16;
  const maxStart = text.length - winSize - 1;

  const [start, setStart] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStart((s) => (s + 1) % (maxStart + 1));
    }, 1200);
    return () => clearInterval(timer);
  }, [maxStart]);

  const window = text.slice(start, start + winSize);
  const target = text[start + winSize] ?? " ";

  return (
    <VisualFrame title="MLP 模型：固定 16 字符窗口 → 拼接 embedding → 预测下一字符">
      {/* 文本流（外层 overflow-x-auto 用于横向滚动；纵向加 py-1 防止 ring 顶/底被裁） */}
      <div className="mb-6 overflow-x-auto overflow-y-visible">
        <div className="flex font-mono text-sm leading-none py-1.5">
          {text.map((ch, i) => {
            const inWindow = i >= start && i < start + winSize;
            const isTarget = i === start + winSize;
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center justify-center w-5 h-7 transition-all",
                  inWindow &&
                    "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
                  isTarget &&
                    "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400 dark:ring-emerald-600",
                  !inWindow && !isTarget && "text-muted-foreground/50"
                )}
              >
                {ch === " " ? "␣" : ch}
              </span>
            );
          })}
        </div>
      </div>

      {/* 流水线 */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* 窗口 token */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            16 chars
          </div>
          <div className="grid grid-cols-8 gap-0.5 max-w-[180px]">
            {window.map((ch, i) => (
              <span
                key={`${start}-${i}`}
                className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-emerald-100 dark:bg-emerald-950/50 font-mono text-xs text-emerald-700 dark:text-emerald-300"
              >
                {ch === " " ? "␣" : ch}
              </span>
            ))}
          </div>
        </div>

        <span className="text-muted-foreground/60 font-mono">→</span>

        {/* embedding 拼接 */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            concat (16×64=1024)
          </div>
          <div className="flex h-5 w-32 rounded-sm overflow-hidden">
            {window.map((_, i) => (
              <motion.div
                key={`emb-${start}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02, duration: 0.15 }}
                className="flex-1"
                style={{
                  backgroundColor: `hsl(${150 + i * 4}, 65%, ${55 + (i % 3) * 8}%)`,
                }}
              />
            ))}
          </div>
        </div>

        <span className="text-muted-foreground/60 font-mono">→</span>

        {/* MLP 层 */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            MLP
          </div>
          <div className="flex gap-1">
            {[1024, 256, 256, 65].map((d, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
                className="w-2 rounded-sm bg-amber-400 dark:bg-amber-500"
                style={{ height: `${(18 + Math.log2(d) * 2).toFixed(2)}px` }}
              />
            ))}
          </div>
        </div>

        <span className="text-muted-foreground/60 font-mono">→</span>

        {/* 预测结果 */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            next
          </div>
          <motion.span
            key={`target-${start}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-mono text-base text-emerald-700 dark:text-emerald-300"
          >
            {target === " " ? "␣" : target}
          </motion.span>
        </div>
      </div>
    </VisualFrame>
  );
}
