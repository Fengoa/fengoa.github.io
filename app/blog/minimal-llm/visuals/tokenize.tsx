"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 06 — Tokenize：字符 → 整数 ID 的可视化
// 把 "Hello" 这种文本，按一张固定的字符表查成 [20, 43, 50, 50, 53]
// =============================================================================

export function Tokenize() {
  // Tiny Shakespeare 真实词表，65 个字符按 ASCII 升序排列
  // 来源：karpathy/char-rnn 数据集中 stoi 的实际顺序
  const vocab = useMemo(
    () => [
      "\n", " ", "!", "$", "&", "'", ",", "-", ".", "3", ":", ";", "?",
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ],
    []
  );

  // 字符 → 编号
  const charToId = useMemo(() => {
    const map = new Map<string, number>();
    vocab.forEach((ch, i) => map.set(ch, i));
    return map;
  }, [vocab]);

  // 三个轮播样本，让读者直观看到不同输入 → 不同 ID 序列
  const samples = useMemo(
    () => ["Hello", "Speak", "First"],
    []
  );

  const [sampleIdx, setSampleIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSampleIdx((s) => (s + 1) % samples.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [samples.length]);

  const text = samples[sampleIdx];
  const chars = text.split("");
  const ids = chars.map((ch) => charToId.get(ch) ?? 0);

  // 空格 → ␣，换行 → ↵，方便在格子里可视化
  const showChar = (ch: string) => {
    if (ch === " ") return "␣";
    if (ch === "\n") return "↵";
    return ch;
  };

  return (
    <VisualFrame title="字符级 tokenize：每个字符按词表查到一个整数 ID">
      <div className="flex flex-col items-center gap-6">
        {/* 顶部：词表预览 */}
        <div className="w-full max-w-2xl">
          <div className="text-xs font-mono text-muted-foreground mb-2 text-center">
            vocab（共 65 个字符）
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {vocab.map((ch, i) => {
              const isActive = ids.includes(i);
              return (
                <div
                  key={`v-${i}`}
                  className={cn(
                    "flex flex-col items-center justify-center w-7 py-1 rounded-sm border font-mono transition-colors",
                    isActive
                      ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                      : "border-neutral-200 dark:border-neutral-800 bg-transparent text-muted-foreground/60"
                  )}
                >
                  <span className="text-xs leading-none">{showChar(ch)}</span>
                  <span className="text-[10px] leading-none mt-0.5 opacity-70 tabular-nums">
                    {i}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 分隔说明 */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/70">
          <div className="w-8 h-px bg-border" />
          <span>用这张表查输入</span>
          <div className="w-8 h-px bg-border" />
        </div>

        {/* 底部：输入文本 → 编号序列 */}
        <div className="flex flex-col items-center gap-2">
          {/* 输入字符 */}
          <div className="flex gap-2">
            <AnimatePresence mode="popLayout">
              {chars.map((ch, i) => (
                <motion.div
                  key={`${sampleIdx}-c-${i}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="flex flex-col items-center justify-center w-10 h-10 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-base"
                >
                  {showChar(ch)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 箭头 */}
          <div className="flex gap-2">
            {chars.map((_, i) => (
              <div
                key={`${sampleIdx}-a-${i}`}
                className="flex justify-center w-10 text-violet-400 dark:text-violet-500 font-mono text-xs"
              >
                ↓
              </div>
            ))}
          </div>

          {/* 输出编号 */}
          <div className="flex gap-2">
            <AnimatePresence mode="popLayout">
              {ids.map((id, i) => (
                <motion.div
                  key={`${sampleIdx}-i-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
                  className="flex items-center justify-center w-10 h-8 rounded border border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 font-mono text-sm text-violet-700 dark:text-violet-300 tabular-nums"
                >
                  {id}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 数组表示 */}
          <motion.div
            key={`arr-${sampleIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 font-mono text-xs text-muted-foreground tabular-nums"
          >
            &quot;{text}&quot; → [{ids.join(", ")}]
          </motion.div>
        </div>
      </div>
    </VisualFrame>
  );
}
