"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// =============================================================================
// 通用容器
// =============================================================================

function VisualFrame({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className="my-10">
      <div
        data-no-zoom
        className={cn(
          "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6",
          className
        )}
      >
        {children}
      </div>
      {title && (
        <figcaption className="mt-2 text-xs text-center text-muted-foreground font-mono">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* 上文 */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-muted-foreground mb-2">
            context
          </div>
          <div className="flex flex-wrap gap-1">
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
              <motion.span
                key={`${idx}-arrow`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center text-neutral-400 dark:text-neutral-600 px-1 font-mono"
              >
                →
              </motion.span>
              <motion.span
                key={`${idx}-q`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="inline-flex items-center justify-center w-9 h-9 rounded border border-dashed border-violet-400 text-violet-500 dark:text-violet-400 font-mono text-base"
              >
                ?
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* 概率分布 */}
        <div className="flex-1 min-w-0">
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
                    p > 0.3
                      ? "bg-violet-500 dark:bg-violet-400"
                      : p > 0.1
                      ? "bg-violet-300 dark:bg-violet-600"
                      : p > 0
                      ? "bg-violet-200 dark:bg-violet-800"
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
                  "flex-1 grid gap-px rounded-sm transition-shadow",
                  r === activeRow && "ring-2 ring-violet-400/60 dark:ring-violet-500/60"
                )}
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
              >
                {row.map((p, c) => (
                  <div
                    key={`cell-${r}-${c}`}
                    className="aspect-square transition-colors"
                    style={{
                      backgroundColor: `rgba(139, 92, 246, ${(
                        p * (r === activeRow ? 1 : 0.55)
                      ).toFixed(3)})`,
                    }}
                  />
                ))}
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
      {/* 文本流 */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex font-mono text-sm leading-none pb-1">
          {text.map((ch, i) => {
            const inWindow = i >= start && i < start + winSize;
            const isTarget = i === start + winSize;
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center justify-center w-5 h-7 transition-all",
                  inWindow &&
                    "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300",
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
                className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-violet-100 dark:bg-violet-950/50 font-mono text-xs text-violet-700 dark:text-violet-300"
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
                  backgroundColor: `hsl(${260 + i * 4}, 65%, ${55 + (i % 3) * 8}%)`,
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

  return (
    <VisualFrame title="Self-Attention：动态决定关注历史每个位置的程度">
      <div className="flex flex-col items-center">
        {/* Key 行 */}
        <div className="text-xs font-mono text-muted-foreground mb-2">
          Keys（历史 token）
        </div>
        <div className="flex gap-3 mb-2">
          {tokens.map((tok, i) => (
            <div key={`k-${i}`} className="flex flex-col items-center">
              <div
                className={cn(
                  "px-2 py-1 rounded border font-mono text-xs transition-all",
                  i <= queryIdx
                    ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-foreground"
                    : "border-neutral-200 dark:border-neutral-800 bg-transparent text-muted-foreground/40"
                )}
              >
                {tok}
              </div>
              {/* 权重柱 */}
              <div className="h-12 w-6 mt-1 flex items-end justify-center">
                <motion.div
                  key={`bar-${queryIdx}-${i}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${w[i] * 100}%` }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={cn(
                    "w-3 rounded-t",
                    w[i] > 0.4
                      ? "bg-violet-500 dark:bg-violet-400"
                      : w[i] > 0.15
                        ? "bg-violet-300 dark:bg-violet-600"
                        : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                />
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {(w[i] * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        {/* 连接区 */}
        <svg
          className="my-1"
          width="280"
          height="50"
          viewBox="0 0 280 50"
          preserveAspectRatio="none"
        >
          {tokens.map((_, i) => {
            const x1 = 18 + i * 47;
            const x2 = 18 + queryIdx * 47;
            if (w[i] <= 0.05) return null;
            return (
              <motion.path
                key={`p-${queryIdx}-${i}`}
                d={`M ${x1} 0 Q ${(x1 + x2) / 2} 25 ${x2} 50`}
                stroke="currentColor"
                className="text-violet-500 dark:text-violet-400"
                strokeWidth={Math.max(0.5, w[i] * 3)}
                fill="none"
                strokeOpacity={Math.min(1, w[i] * 1.5)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Query 行 */}
        <div className="flex gap-3">
          {tokens.map((tok, i) => (
            <div
              key={`q-${i}`}
              className={cn(
                "px-2 py-1 rounded border font-mono text-xs transition-all",
                i === queryIdx
                  ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 ring-2 ring-violet-400/30"
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

// =============================================================================
// 05 — ModelComparison：三个模型 loss 曲线对比
// =============================================================================

export function ModelComparison() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const HOLD_MS = 2500; // 到达终点后停留时长
    const STEP_MS = 60;
    const STEP = 0.01;
    let holdUntil = 0;

    const timer = setInterval(() => {
      const now = Date.now();
      setProgress((p) => {
        if (p >= 1) {
          if (holdUntil === 0) holdUntil = now + HOLD_MS;
          if (now < holdUntil) return 1;
          holdUntil = 0;
          return 0;
        }
        return Math.min(1, p + STEP);
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  // 三条 loss 曲线（指数衰减到不同终值）
  const models = [
    {
      name: "Bigram",
      finalLoss: 2.53,
      decay: 2.5,
      color: "#94a3b8", // slate
      colorClass: "text-slate-500",
      params: "4K",
      ctx: "1 char",
    },
    {
      name: "MLP",
      finalLoss: 1.78,
      decay: 3.5,
      color: "#f59e0b", // amber
      colorClass: "text-amber-500",
      params: "350K",
      ctx: "16 chars",
    },
    {
      name: "MiniGPT",
      finalLoss: 1.58,
      decay: 4.0,
      color: "#10b981", // emerald
      colorClass: "text-emerald-500",
      params: "420K",
      ctx: "64 chars",
    },
  ];

  const startLoss = 4.3;
  const W = 400;
  const H = 200;
  const PAD = { l: 36, r: 48, t: 16, b: 28 };
  const yMin = 1.2;
  const yMax = 4.6;

  const xScale = (t: number) =>
    PAD.l + t * (W - PAD.l - PAD.r);
  // SVG 坐标系 y 向下，需要反转：v 越大，y 越小（顶部）
  const yScale = (v: number) =>
    PAD.t + ((yMax - v) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  return (
    <VisualFrame title="三个模型的训练曲线：上下文越长、动态关注 → loss 越低">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 网格 */}
            {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={yScale(v)}
                  y2={yScale(v)}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                />
                <text
                  x={PAD.l - 6}
                  y={yScale(v) + 3}
                  textAnchor="end"
                  className="text-[8px] font-mono fill-muted-foreground"
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            {/* 轴 */}
            <line
              x1={PAD.l}
              x2={PAD.l}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="currentColor"
              className="text-neutral-300 dark:text-neutral-700"
              strokeWidth={0.8}
            />
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={H - PAD.b}
              y2={H - PAD.b}
              stroke="currentColor"
              className="text-neutral-300 dark:text-neutral-700"
              strokeWidth={0.8}
            />
            <text
              x={W / 2}
              y={H - 6}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
            >
              training steps
            </text>
            <text
              x={10}
              y={H / 2}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
              transform={`rotate(-90, 10, ${H / 2})`}
            >
              val loss
            </text>

            {/* 三条曲线 */}
            {models.map((m, mi) => {
              const N = 80;
              const lossAt = (t: number) =>
                m.finalLoss +
                (startLoss - m.finalLoss) * Math.exp(-m.decay * t) +
                Math.sin(t * 24 + mi * 1.7) * 0.04 * (1 - t);
              const points: string[] = [];
              const upTo = Math.floor(N * progress);
              for (let i = 0; i <= upTo; i++) {
                const t = i / N;
                const x = xScale(t);
                const y = yScale(lossAt(t));
                points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
              }
              const lastT = upTo / N;
              const lastX = xScale(lastT);
              const lastY = yScale(lossAt(lastT));
              return (
                <g key={m.name}>
                  <path
                    d={points.join(" ")}
                    fill="none"
                    stroke={m.color}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {progress > 0 && (
                    <circle
                      cx={lastX}
                      cy={lastY}
                      r={2.5}
                      fill={m.color}
                    />
                  )}
                  {/* 终值标签 */}
                  {progress >= 0.99 && (
                    <text
                      x={lastX + 6}
                      y={lastY + 3}
                      className="text-[9px] font-mono"
                      fill={m.color}
                    >
                      {m.finalLoss.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 图例 */}
        <div className="lg:w-44 space-y-3">
          {models.map((m) => (
            <div key={m.name} className="flex items-start gap-2">
              <div
                className="w-3 h-3 rounded-sm mt-1 shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-medium">{m.name}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {m.params} · ctx {m.ctx}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  val loss → {m.finalLoss}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
