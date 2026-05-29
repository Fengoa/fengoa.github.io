"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// LossCurveChart：train / val 双曲线 + 最低点标记 + early stopping 区间高亮
// 数据来自正文中描述的真实训练日志（4M MiniGPT，Shakespeare，10k step）
// =============================================================================

type Row = { step: number; train: number; val: number };

const DATA: Row[] = [
  { step: 0, train: 8.35, val: 8.35 },
  { step: 250, train: 6.6, val: 6.95 },
  { step: 500, train: 5.4, val: 5.98 },
  { step: 750, train: 4.95, val: 5.85 },
  { step: 1000, train: 4.71, val: 5.79 },
  { step: 1500, train: 4.13, val: 5.77 },
  { step: 2000, train: 3.54, val: 5.88 },
  { step: 3000, train: 2.45, val: 6.32 },
  { step: 4000, train: 1.62, val: 6.74 },
  { step: 5000, train: 1.12, val: 7.12 },
  { step: 6000, train: 0.84, val: 7.42 },
  { step: 7000, train: 0.64, val: 7.61 },
  { step: 8000, train: 0.55, val: 7.74 },
  { step: 9000, train: 0.49, val: 7.84 },
  { step: 10000, train: 0.46, val: 7.9 },
];

const BEST_INDEX = DATA.findIndex(
  (d) => d.val === Math.min(...DATA.map((x) => x.val))
);

const W = 100;
const H = 56;
const PAD = { l: 9, r: 9, t: 4, b: 10 };

const stepMin = DATA[0].step;
const stepMax = DATA[DATA.length - 1].step;
const lossMax = 9;
const lossMin = 0;

function xOf(step: number) {
  return (
    PAD.l +
    ((step - stepMin) / (stepMax - stepMin)) * (W - PAD.l - PAD.r)
  );
}
function yOf(loss: number) {
  return (
    H -
    PAD.b -
    ((loss - lossMin) / (lossMax - lossMin)) * (H - PAD.t - PAD.b)
  );
}

function pathOf(key: "train" | "val") {
  return DATA.map(
    (d, i) =>
      `${i === 0 ? "M" : "L"} ${xOf(d.step).toFixed(2)} ${yOf(d[key]).toFixed(2)}`
  ).join(" ");
}

export function LossCurveChart() {
  const [hover, setHover] = useState<number | null>(BEST_INDEX);

  const trainPath = useMemo(() => pathOf("train"), []);
  const valPath = useMemo(() => pathOf("val"), []);

  const best = DATA[BEST_INDEX];
  const cur = hover !== null ? DATA[hover] : best;
  const gap = (cur.val - cur.train).toFixed(2);

  return (
    <VisualFrame title="train loss 一路下行，val loss 在 step 1500 见底后反弹——典型的过拟合形状">
      <div className="flex flex-col gap-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto font-mono"
          preserveAspectRatio="none"
        >
          {/* early-stopping 推荐区间高亮 */}
          <rect
            x={xOf(1000)}
            y={PAD.t}
            width={xOf(2000) - xOf(1000)}
            height={H - PAD.t - PAD.b}
            className="fill-amber-200/40 dark:fill-amber-500/10"
          />
          <text
            x={(xOf(1000) + xOf(2000)) / 2}
            y={PAD.t + 2.5}
            textAnchor="middle"
            fontSize={2.4}
            className="fill-amber-700 dark:fill-amber-400"
          >
            early stopping
          </text>

          {/* 网格 */}
          {[2, 4, 6, 8].map((g) => (
            <line
              key={`g-${g}`}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yOf(g)}
              y2={yOf(g)}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
          ))}

          {/* X 轴标签 */}
          {[0, 2000, 4000, 6000, 8000, 10000].map((s) => (
            <text
              key={`x-${s}`}
              x={xOf(s)}
              y={H - 1.5}
              textAnchor="middle"
              fontSize={2.4}
              className="fill-muted-foreground"
            >
              {s >= 1000 ? `${s / 1000}k` : s}
            </text>
          ))}

          {/* train 曲线（emerald） */}
          <motion.path
            d={trainPath}
            fill="none"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />
          {/* val 曲线（violet） */}
          <motion.path
            d={valPath}
            fill="none"
            className="stroke-violet-500 dark:stroke-violet-400"
            strokeWidth={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          />

          {/* 最佳点星标 */}
          <circle
            cx={xOf(best.step)}
            cy={yOf(best.val)}
            r={1.4}
            className="fill-amber-500"
          />
          <text
            x={xOf(best.step)}
            y={yOf(best.val) - 2.2}
            textAnchor="middle"
            fontSize={2.4}
            className="fill-amber-700 dark:fill-amber-400 font-semibold"
          >
            best val 5.77
          </text>

          {/* hover 触发列 */}
          {DATA.map((d, i) => (
            <rect
              key={`hot-${i}`}
              x={xOf(d.step) - 3}
              y={PAD.t}
              width={6}
              height={H - PAD.t - PAD.b}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(BEST_INDEX)}
              className="cursor-pointer"
            />
          ))}

          {/* hover 竖线 */}
          {hover !== null && (
            <line
              x1={xOf(DATA[hover].step)}
              x2={xOf(DATA[hover].step)}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={0.2}
              strokeDasharray="0.6 0.6"
            />
          )}
          {hover !== null &&
            (["train", "val"] as const).map((k) => (
              <circle
                key={k}
                cx={xOf(DATA[hover].step)}
                cy={yOf(DATA[hover][k])}
                r={1.0}
                className={cn(
                  k === "train"
                    ? "fill-emerald-500 dark:fill-emerald-400"
                    : "fill-violet-500 dark:fill-violet-400"
                )}
              />
            ))}
        </svg>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded" />
              <span className="text-muted-foreground">train</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-violet-500 dark:bg-violet-400 rounded" />
              <span className="text-muted-foreground">val</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-amber-200/70 dark:bg-amber-500/20 rounded" />
              <span className="text-muted-foreground">建议早停区间</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span>
              step <span className="text-foreground">{cur.step}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              train {cur.train.toFixed(2)}
            </span>
            <span className="text-violet-600 dark:text-violet-400">
              val {cur.val.toFixed(2)}
            </span>
            <span>gap <span className="text-foreground">{gap}</span></span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
