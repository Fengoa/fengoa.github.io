"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// ContextCoverage：64 token 上下文窗口的"实际覆盖量"
// 用同一段莎士比亚文本，演示三种 tokenizer 下 64 个 token 实际能装多少内容
// =============================================================================

// 一段足够长的样本文本
const PASSAGE =
  "First Citizen: Before we proceed any further, hear me speak. " +
  "All: Speak, speak. First Citizen: You are all resolved rather to die than to famish? " +
  "All: Resolved. resolved. First Citizen: First, you know Caius Marcius is chief enemy to the people.";

// 三种 tokenizer 的字符容量（约略值，基于 1MB Shakespeare 实验）
const TOKENIZERS = [
  { name: "字符级",   vocab: "65",   chars: 64,  hue: "neutral" as const },
  { name: "BPE-512",  vocab: "512",  chars: 125, hue: "violet"  as const },
  { name: "BPE-4000", vocab: "4000", chars: 240, hue: "emerald" as const },
];

const PALETTE = {
  neutral: {
    bar: "bg-neutral-300 dark:bg-neutral-700",
    text: "text-foreground",
    border: "border-neutral-200 dark:border-neutral-800",
  },
  violet: {
    bar: "bg-violet-500 dark:bg-violet-400",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900",
  },
  emerald: {
    bar: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900",
  },
};

export function ContextCoverage() {
  // 以最长的 BPE-4000 为基准做条形长度归一
  const maxChars = Math.max(...TOKENIZERS.map((t) => t.chars));

  return (
    <VisualFrame title="64 个 token 在三种切法下实际能看多少英文">
      <div className="flex flex-col gap-5">
        {TOKENIZERS.map((tk, i) => {
          const palette = PALETTE[tk.hue];
          const visible = PASSAGE.slice(0, tk.chars);
          const hidden  = PASSAGE.slice(tk.chars);
          const widthPct = (tk.chars / maxChars) * 100;
          return (
            <div key={tk.name} className="flex flex-col gap-2">
              {/* 标签行 */}
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs">
                  <span className={cn("font-semibold", palette.text)}>{tk.name}</span>
                  <span className="text-muted-foreground/70 ml-2">vocab={tk.vocab}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  64 token ≈ {tk.chars} 字符
                </span>
              </div>
              {/* 条形 */}
              <div className="relative h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  className={cn("absolute inset-y-0 left-0 rounded-full", palette.bar)}
                />
              </div>
              {/* 文本预览：可见 + 灰色不可见 */}
              <div
                className={cn(
                  "relative rounded border p-2.5 text-xs font-mono leading-relaxed",
                  palette.border
                )}
              >
                <span className="text-foreground">{visible}</span>
                <span className="text-muted-foreground/30">{hidden}</span>
              </div>
            </div>
          );
        })}
      </div>
    </VisualFrame>
  );
}
