"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 三种位置编码：none / learned / rope
// 训练长度 64，在 64..256 之间评估 loss
type Series = { name: string; color: string; data: { x: number; y: number }[] };

const TRAIN_CTX = 64;
const X = [48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256];

const SERIES: Series[] = [
  {
    name: "无位置（none）",
    color: "neutral",
    data: X.map((x) => ({ x, y: 1.94 + (x > TRAIN_CTX ? 0.001 * (x - TRAIN_CTX) : 0) })),
  },
  {
    name: "绝对学习（learned）",
    color: "rose",
    data: X.map((x) => ({
      x,
      y:
        x <= TRAIN_CTX
          ? 1.65
          : 1.65 + 0.012 * (x - TRAIN_CTX) + 0.00004 * Math.pow(x - TRAIN_CTX, 2),
    })),
  },
  {
    name: "正弦（sinusoidal）",
    color: "sky",
    data: X.map((x) => ({
      x,
      y: x <= TRAIN_CTX ? 1.62 : 1.62 + 0.004 * (x - TRAIN_CTX),
    })),
  },
  {
    name: "RoPE",
    color: "violet",
    data: X.map((x) => ({
      x,
      y: x <= TRAIN_CTX ? 1.58 : 1.58 + 0.0008 * (x - TRAIN_CTX),
    })),
  },
];

const W = 100;
const H = 60;
const PAD = { l: 10, r: 6, t: 6, b: 14 };

const xMin = X[0];
const xMax = X[X.length - 1];
const yMin = 1.5;
const yMax = 2.8;

const xOf = (x: number) =>
  PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
const yOf = (y: number) =>
  H - PAD.b - ((y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

const COLOR_MAP: Record<string, { stroke: string; fill: string; text: string; bg: string; border: string }> = {
  neutral: {
    stroke: "stroke-neutral-400",
    fill: "fill-neutral-400",
    text: "text-neutral-500 dark:text-neutral-400",
    bg: "bg-neutral-400",
    border: "border-neutral-300 dark:border-neutral-700",
  },
  rose: {
    stroke: "stroke-rose-500 dark:stroke-rose-400",
    fill: "fill-rose-500 dark:fill-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500",
    border: "border-rose-300 dark:border-rose-800",
  },
  sky: {
    stroke: "stroke-sky-500 dark:stroke-sky-400",
    fill: "fill-sky-500 dark:fill-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500",
    border: "border-sky-300 dark:border-sky-800",
  },
  violet: {
    stroke: "stroke-violet-500 dark:stroke-violet-400",
    fill: "fill-violet-500 dark:fill-violet-400",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500",
    border: "border-violet-300 dark:border-violet-800",
  },
};

export function ExtrapolationComparison() {
  const [hover, setHover] = useState<number | null>(6); // x = 128

  return (
    <VisualFrame title="训练长度 64，推理时拉到 256：只有 RoPE 几乎不掉">
      <div className="flex flex-col gap-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto font-mono">
          {/* 横向网格 */}
          {[1.6, 2.0, 2.4, 2.8].map((y) => (
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
          {/* 训练长度竖线 */}
          <line
            x1={xOf(TRAIN_CTX)}
            x2={xOf(TRAIN_CTX)}
            y1={PAD.t}
            y2={H - PAD.b}
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth={0.3}
            strokeDasharray="1 0.8"
          />
          <text
            x={xOf(TRAIN_CTX) + 1}
            y={PAD.t + 3}
            fontSize={2.6}
            className="fill-amber-600 dark:fill-amber-400"
          >
            训练 ctx=64
          </text>

          {/* x 轴标签 */}
          {[64, 128, 192, 256].map((x) => (
            <text
              key={x}
              x={xOf(x)}
              y={H - 4}
              textAnchor="middle"
              fontSize={2.6}
              className="fill-muted-foreground"
            >
              {x}
            </text>
          ))}
          <text
            x={W / 2}
            y={H - 0.5}
            textAnchor="middle"
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            推理序列长度
          </text>

          {/* y 轴标签 */}
          {[1.6, 2.0, 2.4, 2.8].map((y) => (
            <text
              key={y}
              x={PAD.l - 1}
              y={yOf(y) + 0.8}
              textAnchor="end"
              fontSize={2.4}
              className="fill-muted-foreground"
            >
              {y.toFixed(1)}
            </text>
          ))}

          {/* 折线 */}
          {SERIES.map((s) => {
            const path = s.data
              .map(
                (p, i) =>
                  `${i === 0 ? "M" : "L"} ${xOf(p.x).toFixed(2)} ${yOf(p.y).toFixed(2)}`
              )
              .join(" ");
            return (
              <motion.path
                key={s.name}
                d={path}
                fill="none"
                className={COLOR_MAP[s.color].stroke}
                strokeWidth={0.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            );
          })}

          {/* hover 列 */}
          {SERIES.map((s) =>
            s.data.map((p, i) => (
              <circle
                key={`${s.name}-${i}`}
                cx={xOf(p.x)}
                cy={yOf(p.y)}
                r={hover === i ? 1.1 : 0.6}
                className={cn(COLOR_MAP[s.color].fill, "transition-all")}
              />
            ))
          )}
          {hover !== null && (
            <line
              x1={xOf(X[hover])}
              x2={xOf(X[hover])}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={0.2}
              strokeDasharray="0.5 0.5"
            />
          )}

          {/* hover 触发区 */}
          {X.map((x, i) => (
            <rect
              key={`hot-${i}`}
              x={xOf(x) - 4}
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

        {/* 图例 + hover 详情 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
          {SERIES.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-0.5 rounded", COLOR_MAP[s.color].bg)} />
              <span className={COLOR_MAP[s.color].text}>{s.name}</span>
            </span>
          ))}
        </div>

        {hover !== null && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {SERIES.map((s) => (
              <div
                key={`d-${s.name}`}
                className={cn(
                  "px-2 py-1.5 rounded border tabular-nums text-center",
                  COLOR_MAP[s.color].border
                )}
              >
                <div className="text-muted-foreground">{s.name}</div>
                <div className={cn("font-semibold", COLOR_MAP[s.color].text)}>
                  loss = {s.data[hover].y.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VisualFrame>
  );
}
