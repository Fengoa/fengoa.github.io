"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// BPETraining：动画演示 BPE 前几次 merge
// 用一段精简的玩具语料，让用户看到 "找最高频对 → 合并 → 重新统计" 的循环
// =============================================================================

// 精简玩具语料：低 / 低 / 低 / 低 / 低 / 新 / 新 / 宽 / 宽 / 宽
// 选 lower/newer/widest 这种经典 BPE 教学例子
const INITIAL: string[][] = [
  ["l", "o", "w", "e", "r", "</w>"],
  ["l", "o", "w", "e", "r", "</w>"],
  ["l", "o", "w", "</w>"],
  ["l", "o", "w", "</w>"],
  ["l", "o", "w", "</w>"],
  ["n", "e", "w", "e", "r", "</w>"],
  ["n", "e", "w", "e", "r", "</w>"],
  ["w", "i", "d", "e", "s", "t", "</w>"],
  ["w", "i", "d", "e", "s", "t", "</w>"],
  ["w", "i", "d", "e", "s", "t", "</w>"],
];

function countPairs(seqs: string[][]) {
  const counts = new Map<string, { a: string; b: string; n: number }>();
  for (const seq of seqs) {
    for (let i = 0; i < seq.length - 1; i++) {
      const key = `${seq[i]}|${seq[i + 1]}`;
      const prev = counts.get(key);
      if (prev) prev.n += 1;
      else counts.set(key, { a: seq[i], b: seq[i + 1], n: 1 });
    }
  }
  return counts;
}

function topPair(seqs: string[][]) {
  const counts = countPairs(seqs);
  let best: { a: string; b: string; n: number } | null = null;
  for (const v of counts.values()) {
    if (!best || v.n > best.n) best = v;
  }
  return best;
}

function mergePair(seqs: string[][], a: string, b: string): string[][] {
  return seqs.map((seq) => {
    const out: string[] = [];
    let i = 0;
    while (i < seq.length) {
      if (i < seq.length - 1 && seq[i] === a && seq[i + 1] === b) {
        out.push(a + b);
        i += 2;
      } else {
        out.push(seq[i]);
        i += 1;
      }
    }
    return out;
  });
}

// 预先把 5 步 merge 的状态都算出来，避免动画里反复计算
function buildSteps(initial: string[][], n: number) {
  const steps: {
    seqs: string[][];
    pair: { a: string; b: string; n: number } | null;
    merged: string;
  }[] = [{ seqs: initial, pair: topPair(initial), merged: "" }];
  let cur = initial;
  for (let i = 0; i < n; i++) {
    const best = topPair(cur);
    if (!best) break;
    const next = mergePair(cur, best.a, best.b);
    const nextPair = topPair(next);
    steps.push({ seqs: next, pair: nextPair, merged: best.a + best.b });
    cur = next;
  }
  return steps;
}

function fmt(s: string) {
  if (s === "</w>") return "·";
  return s;
}

export function BPETraining() {
  const steps = useMemo(() => buildSteps(INITIAL, 5), []);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [steps.length]);

  const cur = steps[step];
  const prev = step > 0 ? steps[step - 1] : null;
  // 当前要高亮的"最高频对"——下一步即将合并的；最后一步没有则不高亮
  const highlight = cur.pair;

  return (
    <VisualFrame title="BPE 训练：每轮找出最高频的相邻对，合并成新 token">
      <div className="flex flex-col gap-4">
        {/* 顶部状态条 */}
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xs text-muted-foreground">
            第 {step} 轮{step === 0 ? "（初始字符）" : ""}
          </div>
          <div className="font-mono text-xs">
            {step === 0 ? (
              <span className="text-muted-foreground">
                初始词表 = 单个字符（{collectVocab(cur.seqs).length} 个）
              </span>
            ) : (
              <span className="text-muted-foreground">
                合并：
                <span className="text-violet-600 dark:text-violet-400 font-semibold">
                  {fmt(prev!.pair!.a)} + {fmt(prev!.pair!.b)} → {fmt(cur.merged)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* 序列展示 */}
        <div className="flex flex-col gap-1.5">
          {cur.seqs.map((seq, si) => (
            <div key={si} className="flex flex-wrap items-center gap-1">
              {seq.map((tok, ti) => {
                const isPair =
                  highlight &&
                  ti < seq.length - 1 &&
                  seq[ti] === highlight.a &&
                  seq[ti + 1] === highlight.b;
                const isJustMerged = step > 0 && tok === cur.merged;
                return (
                  <span
                    key={`${si}-${ti}`}
                    className={cn(
                      "inline-flex items-center justify-center px-1.5 py-0.5 rounded border font-mono text-xs whitespace-pre transition-colors",
                      isJustMerged
                        ? "border-violet-400 dark:border-violet-500 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-200 font-semibold"
                        : isPair
                          ? "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                          : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-foreground"
                    )}
                  >
                    {fmt(tok)}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* 下一步预告 */}
        {highlight && step < steps.length - 1 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs text-muted-foreground border-t border-border pt-3"
            >
              下一步将合并出现 {highlight.n} 次的&nbsp;
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                ({fmt(highlight.a)}, {fmt(highlight.b)})
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </VisualFrame>
  );
}

function collectVocab(seqs: string[][]) {
  const set = new Set<string>();
  for (const s of seqs) for (const t of s) set.add(t);
  return Array.from(set);
}
