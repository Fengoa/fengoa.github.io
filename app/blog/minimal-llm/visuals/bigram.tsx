"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 02 — BigramTable：65×65 查找表可视化
// 高亮"当前字符 → 下一个字符"的概率分布
// =============================================================================

export function BigramTable() {
  // 12 个最常见英文字母 + 空格，按出现频率排（更易识别 bigram 模式）
  const vocab = useMemo(
    () => ["t", "h", "e", "a", "i", "n", "o", "r", "s", "l", "d", " "],
    []
  );
  const size = vocab.length;

  // 基于真实英文 bigram 频率（手工选取代表性的"前后字符 → 概率"）
  const matrix = useMemo(() => {
    // key: 当前字符 → 下一字符的相对权重（不必和为 1，渲染时再归一）
    const pairs: Record<string, Record<string, number>> = {
      t: { h: 9, o: 4, e: 3, " ": 5, r: 2, s: 1, i: 2, a: 1 },
      h: { e: 9, a: 4, i: 3, o: 2, " ": 1, t: 0.3 },
      e: { " ": 7, r: 4, s: 3, n: 3, d: 3, a: 2, t: 1, l: 1, i: 0.5 },
      a: { n: 6, t: 4, l: 3, r: 3, s: 2, d: 2, " ": 1, i: 1 },
      i: { n: 7, s: 4, t: 3, o: 2, l: 2, d: 2, e: 1, r: 1, a: 0.5 },
      n: { " ": 6, d: 4, t: 3, e: 3, o: 2, s: 2, i: 0.5, a: 0.5 },
      o: { n: 5, r: 4, u: 3, " ": 3, f: 2, t: 2, l: 2, s: 1 },
      r: { e: 6, " ": 3, i: 3, a: 2, o: 2, s: 1, t: 1, d: 0.5, n: 0.5 },
      s: { " ": 7, t: 4, e: 2, i: 2, o: 1, h: 1 },
      l: { e: 5, " ": 3, l: 3, i: 3, y: 2, o: 2, d: 1, a: 1 },
      d: { " ": 7, e: 3, i: 2, o: 1, a: 1, s: 0.5 },
      " ": { t: 9, a: 5, i: 4, o: 3, s: 3, h: 2, e: 1, n: 1, r: 1, l: 1, d: 1 },
    };

    return vocab.map((rowCh) => {
      const dist = pairs[rowCh] ?? {};
      // 取出本行所有 vocab 列的权重
      const weights = vocab.map((colCh) => dist[colCh] ?? 0);
      // 归一化到 0~1，让每行总和≈1，最强项更突出
      const sum = weights.reduce((a, b) => a + b, 0);
      if (sum === 0) return weights;
      return weights.map((w) => w / sum);
    });
  }, [vocab]);

  // 只循环"有意义"的行（有 bigram 数据的字符），避免空行
  const activeRows = useMemo(() => {
    return matrix
      .map((row, i) => ({ i, sum: row.reduce((a, b) => a + b, 0) }))
      .filter((x) => x.sum > 0)
      .map((x) => x.i);
  }, [matrix]);

  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % activeRows.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [activeRows.length]);

  const activeRow = activeRows[step] ?? 0;
  const activeChar = vocab[activeRow];
  const rowDist = matrix[activeRow];

  // 当前行 top-3
  const topNext = useMemo(() => {
    return rowDist
      .map((p, i) => ({ ch: vocab[i], p }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 3);
  }, [rowDist, vocab]);

  // 把空格显示为 ␣
  const showChar = (ch: string) => (ch === " " ? "␣" : ch);

  return (
    <VisualFrame title="Bigram 模型：当前字符 → 查找一行 → 得到下一字符的概率分布">
      <div className="flex flex-col items-center gap-4">
        {/* 读法说明 */}
        <div className="text-xs text-muted-foreground font-mono text-center">
          <span className="text-violet-600 dark:text-violet-400 font-semibold">
            {showChar(activeChar)}
          </span>{" "}
          → 看下一个字符的可能性
        </div>

        {/* 当前行的"放大版"概率条 — 直接告诉用户"行 = 概率分布" */}
        <div className="w-full max-w-lg">
          <div className="flex items-end gap-1 h-16 px-6">
            {rowDist.map((p, c) => (
              <div
                key={`bar-${activeRow}-${c}`}
                className="flex-1 flex flex-col items-center justify-end gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, p * 100)}%` }}
                  transition={{ duration: 0.5, delay: c * 0.02 }}
                  className={cn(
                    "w-full rounded-t transition-colors",
                    p > 0.25
                      ? "bg-violet-600 dark:bg-violet-400"
                      : p > 0.08
                      ? "bg-violet-500 dark:bg-violet-500"
                      : p > 0
                      ? "bg-violet-400 dark:bg-violet-700"
                      : "bg-neutral-100 dark:bg-neutral-900"
                  )}
                  style={{ minHeight: p > 0 ? "3px" : "0" }}
                />
              </div>
            ))}
          </div>
          {/* 概率条对应的字符标签 */}
          <div className="flex gap-1 px-6 mt-1">
            {vocab.map((ch, c) => (
              <div
                key={`label-${c}`}
                className={cn(
                  "flex-1 text-center font-mono text-xs transition-colors",
                  rowDist[c] > 0.2
                    ? "text-violet-600 dark:text-violet-400 font-semibold"
                    : "text-muted-foreground/60"
                )}
              >
                {showChar(ch)}
              </div>
            ))}
          </div>
        </div>

        {/* 分隔说明 */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/70 mt-2">
          <div className="w-8 h-px bg-border" />
          <span>整张查找表（12 × 12，意会 65 × 65）</span>
          <div className="w-8 h-px bg-border" />
        </div>

        {/* 完整热力图 */}
        <div className="w-full max-w-md">
          {/* 列头 */}
          <div className="flex pl-7">
            <div
              className="flex-1 grid"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
              {vocab.map((ch, i) => (
                <div
                  key={`col-${i}`}
                  className={cn(
                    "text-xs font-mono text-center transition-colors",
                    topNext[0]?.ch === ch
                      ? "text-violet-600 dark:text-violet-400 font-semibold"
                      : "text-muted-foreground/60"
                  )}
                >
                  {showChar(ch)}
                </div>
              ))}
            </div>
          </div>
          {/* 矩阵 */}
          {matrix.map((row, r) => (
            <div key={`row-${r}`} className="flex items-center mt-px">
              <div
                className={cn(
                  "w-7 text-xs font-mono text-right pr-1.5 transition-colors",
                  r === activeRow
                    ? "text-violet-600 dark:text-violet-400 font-semibold"
                    : "text-muted-foreground/60"
                )}
              >
                {showChar(vocab[r])}
              </div>
              <div
                className={cn(
                  "flex-1 grid gap-px transition-shadow",
                  r === activeRow && "ring-2 ring-violet-500 dark:ring-violet-400"
                )}
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
              >
                {row.map((p, c) => {
                  // 用 gamma 提升小值的可见度，否则大量 0.05~0.15 的格子看着像白板
                  const isActive = r === activeRow;
                  const dim = isActive ? 1 : 0.85;
                  // p^0.55 把分布往高位拉，最终 alpha 范围更靠近 0.2~1.0
                  const alpha = p > 0 ? Math.min(1, Math.pow(p, 0.55) * dim) : 0;
                  return (
                    <div
                      key={`cell-${r}-${c}`}
                      className="aspect-square transition-colors"
                      style={{
                        backgroundColor: `rgba(139, 92, 246, ${alpha.toFixed(3)})`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Top-3 下一字符标签 */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-muted-foreground">top 3:</span>
          {topNext.map((t, i) => (
            <div
              key={`${activeRow}-top-${i}`}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded border",
                i === 0
                  ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
              )}
            >
              <span className="font-semibold">{showChar(t.ch)}</span>
              <span className="text-xs opacity-70">
                {(t.p * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
