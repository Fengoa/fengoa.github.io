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
                        ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                        : medium
                          ? "border-violet-300/70 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 text-violet-700/80 dark:text-violet-300/80"
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
                      ? "text-violet-600 dark:text-violet-400 font-medium"
                      : medium
                        ? "text-violet-500/80 dark:text-violet-400/80"
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
                className="text-violet-500 dark:text-violet-400"
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
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="flex-1 min-w-0">
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
        <div className="lg:w-56 lg:shrink-0 space-y-5">
          {models.map((m) => (
            <div key={m.name} className="flex items-start gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-medium leading-snug">
                  {m.name}
                </div>
                <div className="mt-1 text-xs font-mono text-muted-foreground/80 leading-relaxed">
                  <div>{m.params} 参数</div>
                  <div>上下文 {m.ctx}</div>
                  <div>
                    val loss <span className="text-foreground/70">{m.finalLoss}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

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

// =============================================================================
// 07 — AttentionExample：用 grid 等宽列展示"the king said to his ???"的关注度
// 替代原本的 ASCII 排版（中英混排在等宽字体下永远对不齐）
// =============================================================================

export function AttentionExample() {
  const tokens = [
    { word: "the",  level: 1, label: "低关注" },
    { word: "king", level: 2, label: "高关注" },
    { word: "said", level: 3, label: "最关注" },
    { word: "to",   level: 1, label: "低关注" },
    { word: "his",  level: 2, label: "高关注" },
    { word: "???",  level: 0, label: "" },
  ];

  // 每个 level 对应的色块宽度（用 width 而不是 ↑ 字符数，更直观）
  const levelMeta = [
    { bar: "w-0",                                       text: "text-muted-foreground/40" },
    { bar: "w-3 bg-violet-300 dark:bg-violet-700",      text: "text-muted-foreground" },
    { bar: "w-6 bg-violet-400 dark:bg-violet-500",      text: "text-violet-600 dark:text-violet-300" },
    { bar: "w-9 bg-violet-500 dark:bg-violet-400",      text: "text-violet-700 dark:text-violet-200 font-semibold" },
  ];

  return (
    <VisualFrame title="预测 his 之后的词时，模型对历史每个位置的关注度">
      <div
        className="grid w-full max-w-xl mx-auto gap-x-2"
        style={{ gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))` }}
      >
        {/* 第 1 行：单词 */}
        {tokens.map((t, i) => (
          <div
            key={`w-${i}`}
            className={cn(
              "text-center font-mono text-sm",
              t.word === "???" ? "text-violet-500 dark:text-violet-400 font-semibold" : "text-foreground"
            )}
          >
            {t.word}
          </div>
        ))}

        {/* 第 2 行：关注强度色块 */}
        {tokens.map((t, i) => (
          <div key={`b-${i}`} className="flex justify-center mt-2">
            <div className={cn("h-1.5 rounded-full", levelMeta[t.level].bar)} />
          </div>
        ))}

        {/* 第 3 行：文字标签 */}
        {tokens.map((t, i) => (
          <div
            key={`l-${i}`}
            className={cn("text-center font-mono text-xs mt-1", levelMeta[t.level].text)}
          >
            {t.label}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
