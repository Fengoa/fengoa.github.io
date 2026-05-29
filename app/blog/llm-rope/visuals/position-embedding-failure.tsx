"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 训练长度 ctx=64。位置 0..63 有学好的 embedding，>=64 越界。
// 演示当输入长度逐步从 60 走到 72 时，loss 的变化。

const TRAIN_CTX = 64;
const SEQ_LENS = [60, 62, 64, 66, 68, 70, 72];

// 训练长度内 loss 平稳；越界后随距离指数式上升
function lossAt(len: number) {
  if (len <= TRAIN_CTX) return 1.6 + 0.005 * (TRAIN_CTX - len);
  const over = len - TRAIN_CTX;
  return 1.6 + 0.45 * over + 0.04 * over * over;
}

export function PositionEmbeddingFailure() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SEQ_LENS.length);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const len = SEQ_LENS[idx];
  const overflow = len > TRAIN_CTX;
  const loss = lossAt(len);

  // 位置表 8 行 8 列，索引 0..63
  const cols = 16;
  const rows = 4;

  return (
    <VisualFrame title="ctx=64 训练完的模型，第 65 个 token 找不到位置编码">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono">
          <span className="text-muted-foreground">
            训练时的位置 embedding 表（{TRAIN_CTX} 行）
          </span>
          <span
            className={cn(
              "tabular-nums",
              overflow
                ? "text-rose-600 dark:text-rose-400 font-medium"
                : "text-emerald-600 dark:text-emerald-400"
            )}
          >
            当前序列长度: {len} {overflow ? "→ 越界" : "→ 表内"}
          </span>
        </div>

        {/* 位置表色块 */}
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const trained = i < TRAIN_CTX;
            const active = i === Math.min(len - 1, TRAIN_CTX - 1) && !overflow;
            return (
              <div
                key={i}
                className={cn(
                  "h-3 rounded-[2px] border transition-colors",
                  trained
                    ? active
                      ? "bg-violet-400 dark:bg-violet-500 border-violet-500"
                      : "bg-violet-100 dark:bg-violet-950/50 border-violet-200 dark:border-violet-900"
                    : "bg-transparent border-dashed border-neutral-300 dark:border-neutral-700"
                )}
              />
            );
          })}
        </div>

        {/* 越界指示 */}
        {overflow && (
          <motion.div
            key={`miss-${len}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-rose-400"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
            想要第 {len - 1} 行的位置编码，但表里只有 0–{TRAIN_CTX - 1} 行
          </motion.div>
        )}

        {/* loss 条 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>val loss</span>
            <span className="tabular-nums text-foreground">{loss.toFixed(2)}</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden">
            <motion.div
              className={cn(
                "h-full",
                overflow ? "bg-rose-500" : "bg-emerald-500"
              )}
              initial={false}
              animate={{ width: `${Math.min(100, (loss / 8) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground tabular-nums">
            <span>1.0</span>
            <span>4.0</span>
            <span>8.0</span>
          </div>
        </div>

        {/* 序列长度刻度 */}
        <div className="flex justify-between text-xs font-mono">
          {SEQ_LENS.map((s, i) => (
            <button
              key={s}
              onMouseEnter={() => setIdx(i)}
              className={cn(
                "px-2 py-1 rounded border transition-colors tabular-nums",
                i === idx
                  ? s > TRAIN_CTX
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                    : "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
