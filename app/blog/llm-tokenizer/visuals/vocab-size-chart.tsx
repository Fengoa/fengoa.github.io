"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// VocabSizeChart：vocab_size vs 压缩率 / 训练时间 的双轴折线图
// 用 SVG 手画，hover 任意点显示数值卡片
// =============================================================================

type Point = {
  vocab: number;
  tokens: number;
  ratio: number;   // 相对字符级的压缩率
  trainSec: number;
};

const DATA: Point[] = [
  { vocab: 65,   tokens: 1_115_394, ratio: 1.0,  trainSec: 0   },
  { vocab: 512,  tokens:   568_210, ratio: 1.96, trainSec: 27  },
  { vocab: 1000, tokens:   447_069, ratio: 2.49, trainSec: 66  },
  { vocab: 2000, tokens:   361_821, ratio: 3.08, trainSec: 132 },
  { vocab: 4000, tokens:   297_518, ratio: 3.75, trainSec: 248 },
];

// SVG 坐标系 0..100 内布局
const W = 100;
const H = 60;
const PAD = { l: 10, r: 10, t: 6, b: 12 };

const xMin = Math.log10(DATA[0].vocab);
const xMax = Math.log10(DATA[DATA.length - 1].vocab);
const yMaxRatio = 4;
const yMaxTime  = 260;

function xOf(vocab: number) {
  return PAD.l + ((Math.log10(vocab) - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
}
function yOfRatio(r: number) {
  return H - PAD.b - (r / yMaxRatio) * (H - PAD.t - PAD.b);
}
function yOfTime(t: number) {
  return H - PAD.b - (t / yMaxTime) * (H - PAD.t - PAD.b);
}

function pathFor(yFn: (p: Point) => number) {
  return DATA
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.vocab).toFixed(2)} ${yFn(p).toFixed(2)}`)
    .join(" ");
}

export function VocabSizeChart() {
  const [hover, setHover] = useState<number | null>(2);

  const ratioPath = pathFor((p) => yOfRatio(p.ratio));
  const timePath  = pathFor((p) => yOfTime(p.trainSec));

  return (
    <VisualFrame title="词表越大，压缩率越高，但训练成本也涨得更快">
      <div className="flex flex-col gap-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto font-mono"
          preserveAspectRatio="none"
        >
          {/* 网格 */}
          {[1, 2, 3, 4].map((r) => (
            <line
              key={`grid-${r}`}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yOfRatio(r)}
              y2={yOfRatio(r)}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
          ))}

          {/* X 轴标签 */}
          {DATA.map((p) => (
            <text
              key={`x-${p.vocab}`}
              x={xOf(p.vocab)}
              y={H - 2}
              textAnchor="middle"
              fontSize={3}
              className="fill-muted-foreground"
            >
              {p.vocab}
            </text>
          ))}

          {/* 训练时间线（emerald） */}
          <motion.path
            d={timePath}
            fill="none"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth={0.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          {/* 压缩率线（violet） */}
          <motion.path
            d={ratioPath}
            fill="none"
            className="stroke-violet-500 dark:stroke-violet-400"
            strokeWidth={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />

          {/* 数据点 */}
          {DATA.map((p, i) => {
            const isHover = hover === i;
            return (
              <g key={`pt-${i}`}>
                <circle
                  cx={xOf(p.vocab)}
                  cy={yOfRatio(p.ratio)}
                  r={isHover ? 1.4 : 0.9}
                  className="fill-violet-500 dark:fill-violet-400 transition-all"
                />
                <circle
                  cx={xOf(p.vocab)}
                  cy={yOfTime(p.trainSec)}
                  r={isHover ? 1.4 : 0.9}
                  className="fill-emerald-500 dark:fill-emerald-400 transition-all"
                />
                {/* hover 触发区，覆盖整列 */}
                <rect
                  x={xOf(p.vocab) - 4}
                  y={PAD.t}
                  width={8}
                  height={H - PAD.t - PAD.b}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                />
              </g>
            );
          })}

          {/* hover 标注 */}
          {hover !== null && (
            <line
              x1={xOf(DATA[hover].vocab)}
              x2={xOf(DATA[hover].vocab)}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={0.2}
              strokeDasharray="0.6 0.6"
            />
          )}
        </svg>

        {/* 图例 + 详情 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-violet-500 dark:bg-violet-400 rounded" />
              <span className="text-muted-foreground">压缩率</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded" />
              <span className="text-muted-foreground">训练时间</span>
            </span>
          </div>
          {hover !== null && (
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span>vocab=<span className="text-foreground">{DATA[hover].vocab}</span></span>
              <span className="text-violet-600 dark:text-violet-400">
                {DATA[hover].ratio.toFixed(2)}×
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {DATA[hover].trainSec}s
              </span>
            </div>
          )}
        </div>

        {/* 数据明细表 */}
        <div className="grid grid-cols-5 gap-1 mt-1 text-xs font-mono">
          {DATA.map((p, i) => (
            <button
              key={`tile-${i}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-1.5 py-2 rounded border transition-colors text-center",
                hover === i
                  ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40"
                  : "border-neutral-200 dark:border-neutral-800 bg-transparent"
              )}
            >
              <span className="text-muted-foreground">vocab</span>
              <span className="text-foreground font-semibold">{p.vocab}</span>
              <span className="text-violet-600 dark:text-violet-400 mt-0.5">
                {p.ratio.toFixed(2)}×
              </span>
            </button>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
