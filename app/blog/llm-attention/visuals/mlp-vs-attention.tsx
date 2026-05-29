"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// MLPVsAttention：相同输入流，左边 MLP 用同一组权重处理，右边 Attention 重新分配
// 切换不同句子，能直观看到右侧权重在变、左侧不变
// =============================================================================

const SAMPLES = [
  {
    tokens: ["the", "king", "said", "to", "his"],
    target: "next",
    // attention 给"his"位置的注意力分布（和上一篇 AttentionFlow 风格一致）
    attn: [0.05, 0.45, 0.4, 0.05, 0.05],
    summary: "“his” 决定主语，重点看 king / said",
  },
  {
    tokens: ["the", "cat", "sat", "on", "the"],
    target: "next",
    attn: [0.05, 0.5, 0.25, 0.15, 0.05],
    summary: "下一个最可能是“mat”，重点看 cat / sat",
  },
  {
    tokens: ["it", "was", "a", "dark", "and"],
    target: "next",
    attn: [0.05, 0.1, 0.05, 0.6, 0.2],
    summary: "“dark and ___” 强烈暗示 stormy",
  },
];

// MLP 的"固定权重"——每个位置一根条，永远不变
const MLP_WEIGHTS = [0.18, 0.22, 0.25, 0.2, 0.15];

function Bars({
  weights,
  active,
  highlight,
}: {
  weights: number[];
  active?: boolean;
  highlight?: boolean;
}) {
  const max = Math.max(...weights);
  return (
    <div className="flex items-end gap-1 h-16">
      {weights.map((w, i) => {
        const h = (w / Math.max(max, 0.01)) * 100;
        return (
          <div key={i} className="flex-1 flex items-end">
            <motion.div
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "w-full rounded-t",
                highlight
                  ? "bg-violet-500 dark:bg-violet-400"
                  : "bg-amber-500/80 dark:bg-amber-400/80",
                active && "opacity-100",
                !active && "opacity-50"
              )}
              style={{ minHeight: 3 }}
            />
          </div>
        );
      })}
    </div>
  );
}

function TokenRow({ tokens }: { tokens: string[] }) {
  return (
    <div className="flex gap-1">
      {tokens.map((t, i) => (
        <div
          key={i}
          className="flex-1 text-center font-mono text-xs text-muted-foreground/80"
        >
          {t}
        </div>
      ))}
    </div>
  );
}

export function MLPvsAttention() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SAMPLES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const sample = SAMPLES[idx];

  return (
    <VisualFrame title="同一组输入下，MLP 的权重不会变，Attention 的权重每次都会重算">
      <div className="flex flex-col items-center gap-5">
        {/* 输入句子切换提示 */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "px-2.5 py-1 rounded border transition-colors",
                idx === i
                  ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
            >
              {s.tokens.join(" ")}
            </button>
          ))}
        </div>

        {/* 左右两栏 */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          {/* MLP */}
          <div className="rounded border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                MLP
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                position-wise，权重训练完就固定
              </span>
            </div>
            <Bars weights={MLP_WEIGHTS} active />
            <TokenRow tokens={sample.tokens} />
            <div className="mt-3 text-xs font-mono text-muted-foreground leading-relaxed">
              不管输入什么内容，第 1、2、3、4、5 个位置永远按这套比例混合
            </div>
          </div>

          {/* Attention */}
          <div className="rounded border border-violet-300 dark:border-violet-700 p-4 bg-violet-50/30 dark:bg-violet-950/20">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                Attention
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                输入相关，每次都重算
              </span>
            </div>
            <motion.div
              key={`bars-${idx}`}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Bars weights={sample.attn} active highlight />
            </motion.div>
            <TokenRow tokens={sample.tokens} />
            <motion.div
              key={`hint-${idx}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-xs font-mono text-violet-700 dark:text-violet-300 leading-relaxed"
            >
              {sample.summary}
            </motion.div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
