"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// LLaMA-2 70B 假设：80 层、64 Q-head（MHA），head_dim=128，FP16
const LAYERS = 80;
const HEAD_DIM = 128;
const BYTES = 2;

const SCHEMES = [
  { name: "MHA (64 KV)", kv: 64, color: "rose" },
  { name: "GQA (8 KV)", kv: 8, color: "violet" },
  { name: "MQA (1 KV)", kv: 1, color: "emerald" },
];

const SEQ_LENS = [1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];

function memGB(seqLen: number, kvHeads: number) {
  const bytes = 2 * LAYERS * seqLen * kvHeads * HEAD_DIM * BYTES;
  return bytes / 1024 ** 3;
}

const W = 100;
const H = 60;
const PAD = { l: 11, r: 6, t: 6, b: 14 };

const xMin = Math.log10(SEQ_LENS[0]);
const xMax = Math.log10(SEQ_LENS[SEQ_LENS.length - 1]);
const yMin = 0.05;
const yMax = 200;

const xOf = (s: number) =>
  PAD.l + ((Math.log10(s) - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
const yOf = (m: number) => {
  const v = Math.max(m, yMin);
  return (
    H -
    PAD.b -
    ((Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin))) *
      (H - PAD.t - PAD.b)
  );
};

const COLOR: Record<
  string,
  { stroke: string; fill: string; text: string; bg: string; border: string }
> = {
  rose: {
    stroke: "stroke-rose-500 dark:stroke-rose-400",
    fill: "fill-rose-500 dark:fill-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500",
    border: "border-rose-300 dark:border-rose-800",
  },
  violet: {
    stroke: "stroke-violet-500 dark:stroke-violet-400",
    fill: "fill-violet-500 dark:fill-violet-400",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500",
    border: "border-violet-300 dark:border-violet-800",
  },
  emerald: {
    stroke: "stroke-emerald-500 dark:stroke-emerald-400",
    fill: "fill-emerald-500 dark:fill-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-300 dark:border-emerald-800",
  },
};

export function KvCacheGrowth() {
  const [hover, setHover] = useState<number | null>(5); // 32K

  return (
    <VisualFrame title="LLaMA-2 70B：KV Cache 显存随序列长度线性增长，分组方案差距八倍">
      <div className="flex flex-col gap-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto font-mono">
          {/* 网格 */}
          {[0.1, 1, 10, 100].map((y) => (
            <line
              key={y}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yOf(y)}
              y2={yOf(y)}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
          ))}

          {/* y 轴标签（GB） */}
          {[0.1, 1, 10, 100].map((y) => (
            <text
              key={`yl-${y}`}
              x={PAD.l - 1}
              y={yOf(y) + 0.8}
              textAnchor="end"
              fontSize={2.4}
              className="fill-muted-foreground"
            >
              {y < 1 ? y.toFixed(1) : y}
            </text>
          ))}
          <text
            x={2}
            y={PAD.t + 2}
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            GB
          </text>

          {/* x 轴标签 */}
          {[1024, 8192, 32768, 131072].map((s) => (
            <text
              key={s}
              x={xOf(s)}
              y={H - 4}
              textAnchor="middle"
              fontSize={2.6}
              className="fill-muted-foreground"
            >
              {s >= 1024 ? `${s / 1024}K` : s}
            </text>
          ))}
          <text
            x={W / 2}
            y={H - 0.5}
            textAnchor="middle"
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            序列长度
          </text>

          {/* 80GB H100 上限线 */}
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={yOf(80)}
            y2={yOf(80)}
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth={0.3}
            strokeDasharray="0.8 0.8"
          />
          <text
            x={W - PAD.r}
            y={yOf(80) - 0.8}
            textAnchor="end"
            fontSize={2.4}
            className="fill-amber-600 dark:fill-amber-400"
          >
            H100 80GB 上限
          </text>

          {/* 三条曲线 */}
          {SCHEMES.map((s) => {
            const path = SEQ_LENS.map(
              (sl, i) =>
                `${i === 0 ? "M" : "L"} ${xOf(sl).toFixed(2)} ${yOf(memGB(sl, s.kv)).toFixed(2)}`
            ).join(" ");
            return (
              <motion.path
                key={s.name}
                d={path}
                fill="none"
                className={COLOR[s.color].stroke}
                strokeWidth={0.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            );
          })}

          {/* 数据点 */}
          {SCHEMES.map((s) =>
            SEQ_LENS.map((sl, i) => (
              <circle
                key={`pt-${s.name}-${i}`}
                cx={xOf(sl)}
                cy={yOf(memGB(sl, s.kv))}
                r={hover === i ? 1.1 : 0.6}
                className={cn(COLOR[s.color].fill, "transition-all")}
              />
            ))
          )}

          {/* hover 列 */}
          {hover !== null && (
            <line
              x1={xOf(SEQ_LENS[hover])}
              x2={xOf(SEQ_LENS[hover])}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={0.2}
              strokeDasharray="0.5 0.5"
            />
          )}

          {/* hover 触发区 */}
          {SEQ_LENS.map((sl, i) => (
            <rect
              key={`hot-${i}`}
              x={xOf(sl) - 4}
              y={PAD.t}
              width={8}
              height={H - PAD.t - PAD.b}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* 图例 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
          {SCHEMES.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-0.5 rounded", COLOR[s.color].bg)} />
              <span className={COLOR[s.color].text}>{s.name}</span>
            </span>
          ))}
        </div>

        {/* hover 详情 */}
        {hover !== null && (
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {SCHEMES.map((s) => {
              const m = memGB(SEQ_LENS[hover], s.kv);
              return (
                <div
                  key={`d-${s.name}`}
                  className={cn(
                    "px-2 py-1.5 rounded border tabular-nums text-center",
                    COLOR[s.color].border
                  )}
                >
                  <div className="text-muted-foreground">
                    {s.name} @ {SEQ_LENS[hover] >= 1024 ? `${SEQ_LENS[hover] / 1024}K` : SEQ_LENS[hover]}
                  </div>
                  <div className={cn("font-semibold", COLOR[s.color].text)}>
                    {m < 1 ? `${(m * 1024).toFixed(0)} MB` : `${m.toFixed(1)} GB`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </VisualFrame>
  );
}
