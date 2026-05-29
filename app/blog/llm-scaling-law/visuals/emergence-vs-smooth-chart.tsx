"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// =============================================================================
// EmergenceVsSmoothChart：双面板对比
//   左：平滑能力（loss / 翻译 BLEU）随参数量幂律下降
//   右：涌现能力（多步算术、Chain-of-thought）在某阈值后突跃
// 数据点为示意（贴近 BIG-bench / Wei 2022 的形态）
// =============================================================================

type Series = {
  name: string;
  color: string;
  data: { N: number; y: number }[];
};

const SMOOTH: Series[] = [
  {
    name: "Cross-entropy loss",
    color: "violet",
    data: [
      { N: 1e7, y: 4.2 },
      { N: 1e8, y: 3.5 },
      { N: 1e9, y: 2.95 },
      { N: 1e10, y: 2.55 },
      { N: 1e11, y: 2.25 },
      { N: 5e11, y: 2.05 },
    ],
  },
];

const EMERGE: Series[] = [
  {
    name: "Modular arithmetic",
    color: "rose",
    data: [
      { N: 1e7, y: 0.0 },
      { N: 1e8, y: 0.0 },
      { N: 1e9, y: 0.0 },
      { N: 1e10, y: 0.02 },
      { N: 5e10, y: 0.32 },
      { N: 1e11, y: 0.71 },
      { N: 5e11, y: 0.89 },
    ],
  },
  {
    name: "3-digit addition w/ CoT",
    color: "emerald",
    data: [
      { N: 1e7, y: 0.0 },
      { N: 1e8, y: 0.01 },
      { N: 1e9, y: 0.02 },
      { N: 1e10, y: 0.05 },
      { N: 5e10, y: 0.2 },
      { N: 1e11, y: 0.62 },
      { N: 5e11, y: 0.95 },
    ],
  },
];

const W = 100;
const H = 50;
const PAD = { l: 11, r: 4, t: 5, b: 11 };

const N_MIN = 1e7;
const N_MAX = 1e12;

function xOf(N: number) {
  return (
    PAD.l +
    ((Math.log10(N) - Math.log10(N_MIN)) /
      (Math.log10(N_MAX) - Math.log10(N_MIN))) *
      (W - PAD.l - PAD.r)
  );
}

function pathOf(
  data: { N: number; y: number }[],
  yMin: number,
  yMax: number
) {
  return data
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xOf(p.N).toFixed(2)} ${(
          H -
          PAD.b -
          ((p.y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)
        ).toFixed(2)}`
    )
    .join(" ");
}

const COLOR_MAP: Record<string, string> = {
  violet: "stroke-violet-500 dark:stroke-violet-400",
  rose: "stroke-rose-500 dark:stroke-rose-400",
  emerald: "stroke-emerald-500 dark:stroke-emerald-400",
};
const FILL_MAP: Record<string, string> = {
  violet: "fill-violet-500 dark:fill-violet-400",
  rose: "fill-rose-500 dark:fill-rose-400",
  emerald: "fill-emerald-500 dark:fill-emerald-400",
};
const BG_MAP: Record<string, string> = {
  violet: "bg-violet-500 dark:bg-violet-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
};

function Panel({
  title,
  series,
  yMin,
  yMax,
  yLabel,
  yTicks,
}: {
  title: string;
  series: Series[];
  yMin: number;
  yMax: number;
  yLabel: string;
  yTicks: number[];
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-mono text-foreground mb-2">{title}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto font-mono"
        preserveAspectRatio="none"
      >
        {/* x 轴 */}
        {[7, 8, 9, 10, 11, 12].map((p) => (
          <g key={`xg-${p}`}>
            <line
              x1={xOf(Math.pow(10, p))}
              x2={xOf(Math.pow(10, p))}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
            {p % 2 === 1 && (
              <text
                x={xOf(Math.pow(10, p))}
                y={H - 2}
                textAnchor="middle"
                fontSize={2.4}
                className="fill-muted-foreground"
              >
                10^{p}
              </text>
            )}
          </g>
        ))}
        {/* y 轴 */}
        {yTicks.map((t) => (
          <g key={`yt-${t}`}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={
                H -
                PAD.b -
                ((t - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)
              }
              y2={
                H -
                PAD.b -
                ((t - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)
              }
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
            <text
              x={PAD.l - 1}
              y={
                H -
                PAD.b -
                ((t - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b) +
                0.8
              }
              textAnchor="end"
              fontSize={2.2}
              className="fill-muted-foreground"
            >
              {t}
            </text>
          </g>
        ))}
        <text
          x={PAD.l - 0.5}
          y={PAD.t + 1.5}
          textAnchor="end"
          fontSize={2.4}
          className="fill-muted-foreground"
        >
          {yLabel}
        </text>

        {/* 各曲线 */}
        {series.map((s) => (
          <g key={s.name}>
            <motion.path
              d={pathOf(s.data, yMin, yMax)}
              fill="none"
              className={COLOR_MAP[s.color]}
              strokeWidth={0.7}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            {s.data.map((p, i) => (
              <circle
                key={i}
                cx={xOf(p.N)}
                cy={
                  H -
                  PAD.b -
                  ((p.y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)
                }
                r={0.8}
                className={FILL_MAP[s.color]}
              />
            ))}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 text-xs font-mono mt-2">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className={cn("w-3 h-0.5 rounded", BG_MAP[s.color])} />
            <span className="text-muted-foreground">{s.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function EmergenceVsSmoothChart() {
  return (
    <VisualFrame title="左：loss 沿幂律平滑下降；右：算术能力在某个参数门槛突然冒出来">
      <div className="flex flex-col md:flex-row gap-6">
        <Panel
          title="平滑能力 — loss / cross-entropy"
          series={SMOOTH}
          yMin={1.5}
          yMax={5}
          yLabel="loss"
          yTicks={[2, 3, 4]}
        />
        <Panel
          title="涌现能力 — task accuracy"
          series={EMERGE}
          yMin={0}
          yMax={1}
          yLabel="acc"
          yTicks={[0.25, 0.5, 0.75]}
        />
      </div>
    </VisualFrame>
  );
}
