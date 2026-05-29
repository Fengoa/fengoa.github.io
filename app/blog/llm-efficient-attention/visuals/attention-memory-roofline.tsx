"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 四种方案在不同序列长度下的"激活 + KV"显存（GB，单 batch）
// 以 LLaMA-2 13B (40 层, 40 head, head_dim=128, fp16) 单层注意力为粗略参考

type Scheme = "naive" | "kv" | "gqa" | "flash";

const SEQ_LENS = [2048, 8192, 32768, 131072] as const;

// 简化模型：
// activation(N) = 2 * 40 * N * N * fp16  for naive (整张 attention 矩阵)
// activation(N) = 2 * 40 * N * fp16     for flash (online softmax, 不存全矩阵)
// kv(N, kv_heads) = 2 * 40 * 2 * N * kv_heads * 128 * fp16
function calc(N: number, scheme: Scheme): { act: number; kv: number } {
  const layers = 40;
  const fp16 = 2;
  const fullKvHeads = 40;
  const gqaKvHeads = 8;
  const head_dim = 128;

  const naiveAct = (layers * N * N * fp16) / 1024 ** 3;
  const flashAct = (layers * N * 4 * fp16) / 1024 ** 3; // 几乎可忽略
  const fullKV = (2 * layers * N * fullKvHeads * head_dim * fp16) / 1024 ** 3;
  const gqaKV = (2 * layers * N * gqaKvHeads * head_dim * fp16) / 1024 ** 3;

  switch (scheme) {
    case "naive":
      return { act: naiveAct, kv: 0 };
    case "kv":
      return { act: flashAct, kv: fullKV };
    case "gqa":
      return { act: flashAct, kv: gqaKV };
    case "flash":
      return { act: flashAct, kv: gqaKV };
  }
}

const SCHEMES: { id: Scheme; label: string; color: string; desc: string }[] = [
  { id: "naive", label: "朴素 + 重复算", color: "rose", desc: "整张 attention 矩阵进 HBM" },
  { id: "kv", label: "+ KV Cache", color: "amber", desc: "缓存历史 KV，省重复算但占显存" },
  { id: "gqa", label: "+ GQA", color: "sky", desc: "8 组 KV 共享，显存降 5×" },
  { id: "flash", label: "+ Flash Attention", color: "violet", desc: "+ tile 化，激活几乎为零" },
];

const COLOR: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  rose: {
    bar: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-300 dark:border-rose-800",
  },
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
  },
  sky: {
    bar: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-300 dark:border-sky-800",
  },
  violet: {
    bar: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-300 dark:border-violet-800",
  },
};

export function AttentionMemoryRoofline() {
  const [seqIdx, setSeqIdx] = useState(2); // 32K

  const seq = SEQ_LENS[seqIdx];
  const data = SCHEMES.map((s) => ({ ...s, ...calc(seq, s.id) }));
  const maxTotal = Math.max(...data.map((d) => d.act + d.kv));
  // 80GB 上限
  const limit = 80;
  const scaleMax = Math.max(maxTotal, limit) * 1.05;

  return (
    <VisualFrame title="四种方案叠加：从 O(N²) 朴素一路减到 GQA + Flash">
      <div className="flex flex-col gap-5">
        {/* 序列长度切换 */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">序列长度</span>
          <div className="flex gap-1">
            {SEQ_LENS.map((s, i) => (
              <button
                key={s}
                onClick={() => setSeqIdx(i)}
                className={cn(
                  "px-2 py-1 rounded border tabular-nums transition-colors",
                  seqIdx === i
                    ? "border-foreground bg-accent text-foreground"
                    : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
                )}
              >
                {s >= 1024 ? `${s / 1024}K` : s}
              </button>
            ))}
          </div>
        </div>

        {/* 柱状图 */}
        <div className="flex flex-col gap-2">
          {data.map((d) => {
            const total = d.act + d.kv;
            const pctTotal = (total / scaleMax) * 100;
            const pctAct = (d.act / scaleMax) * 100;
            const pctKv = (d.kv / scaleMax) * 100;
            const overflow = total > limit;
            return (
              <div key={d.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={COLOR[d.color].text}>{d.label}</span>
                  <span
                    className={cn(
                      "tabular-nums",
                      overflow ? "text-rose-600 dark:text-rose-400 font-medium" : "text-foreground"
                    )}
                  >
                    {total < 1 ? `${(total * 1024).toFixed(0)} MB` : `${total.toFixed(1)} GB`}
                    {overflow && " · 超 80GB"}
                  </span>
                </div>
                <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden flex">
                  <motion.div
                    className={cn(COLOR[d.color].bar, "opacity-70")}
                    initial={false}
                    animate={{ width: `${pctAct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className={COLOR[d.color].bar}
                    initial={false}
                    animate={{ width: `${pctKv}%` }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* 上限标线 */}
                  <div
                    className="relative"
                    style={{ width: `${100 - pctTotal}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{d.desc}</div>
              </div>
            );
          })}
        </div>

        {/* 80GB 上限提示 */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400">
          <span className="inline-block w-3 h-0.5 bg-amber-500" />
          单卡 H100 80GB 上限。超过这条线就只能 offload 或多卡。
        </div>

        {/* 颜色含义 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-neutral-400 rounded opacity-70" />
            激活
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-neutral-400 rounded" />
            KV Cache
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}
