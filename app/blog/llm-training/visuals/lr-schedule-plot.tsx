"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// LRSchedulePlot：warmup + cosine decay 学习率曲线
// 用户可调 warmup 步数、最大/最小 LR，曲线和拐点同步更新
// =============================================================================

const TOTAL = 10000;

function lrAt(step: number, warmup: number, maxLr: number, minLr: number) {
  if (step < warmup) {
    return (maxLr * step) / warmup;
  }
  const progress = (step - warmup) / (TOTAL - warmup);
  const cos = 0.5 * (1 + Math.cos(Math.PI * progress));
  return minLr + (maxLr - minLr) * cos;
}

const W = 100;
const H = 50;
const PAD = { l: 9, r: 6, t: 4, b: 10 };

function xOf(step: number) {
  return PAD.l + (step / TOTAL) * (W - PAD.l - PAD.r);
}

export function LRSchedulePlot() {
  const [warmup, setWarmup] = useState(200);
  const [maxLr, setMaxLr] = useState(3e-4);
  const [minLr, setMinLr] = useState(3e-5);

  const path = useMemo(() => {
    const yMax = maxLr * 1.05;
    const yMin = 0;
    const samples = 200;
    const pts: string[] = [];
    for (let i = 0; i <= samples; i++) {
      const step = (i / samples) * TOTAL;
      const lr = lrAt(step, warmup, maxLr, minLr);
      const y =
        H - PAD.b - ((lr - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);
      pts.push(`${i === 0 ? "M" : "L"} ${xOf(step).toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(" ");
  }, [warmup, maxLr, minLr]);

  const yMax = maxLr * 1.05;
  const peakX = xOf(warmup);
  const peakY =
    H - PAD.b - ((maxLr - 0) / (yMax - 0)) * (H - PAD.t - PAD.b);

  return (
    <VisualFrame title="warmup 把 LR 从 0 抬上去，cosine decay 再平滑收回——拖动滑块看形状如何变">
      <div className="flex flex-col gap-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto font-mono"
          preserveAspectRatio="none"
        >
          {/* warmup 区间高亮 */}
          <rect
            x={PAD.l}
            y={PAD.t}
            width={peakX - PAD.l}
            height={H - PAD.t - PAD.b}
            className="fill-blue-100/50 dark:fill-blue-500/10"
          />
          {/* 网格 */}
          {[0.25, 0.5, 0.75, 1.0].map((r) => (
            <line
              key={r}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={H - PAD.b - r * (H - PAD.t - PAD.b)}
              y2={H - PAD.b - r * (H - PAD.t - PAD.b)}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
          ))}

          {/* X 轴标签 */}
          {[0, 2500, 5000, 7500, 10000].map((s) => (
            <text
              key={s}
              x={xOf(s)}
              y={H - 1.5}
              textAnchor="middle"
              fontSize={2.4}
              className="fill-muted-foreground"
            >
              {s >= 1000 ? `${s / 1000}k` : s}
            </text>
          ))}

          {/* 曲线 */}
          <motion.path
            key={`${warmup}-${maxLr}-${minLr}`}
            d={path}
            fill="none"
            className="stroke-violet-500 dark:stroke-violet-400"
            strokeWidth={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* peak 标注 */}
          <circle
            cx={peakX}
            cy={peakY}
            r={1.0}
            className="fill-amber-500"
          />
          <text
            x={peakX}
            y={peakY - 2}
            textAnchor="middle"
            fontSize={2.4}
            className="fill-amber-700 dark:fill-amber-400 font-semibold"
          >
            peak
          </text>
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              warmup steps:{" "}
              <span className="text-foreground">{warmup}</span>
            </span>
            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={warmup}
              onChange={(e) => setWarmup(parseInt(e.target.value))}
              className="accent-violet-500"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              max lr:{" "}
              <span className="text-foreground">{maxLr.toExponential(1)}</span>
            </span>
            <input
              type="range"
              min={1e-5}
              max={1e-3}
              step={1e-5}
              value={maxLr}
              onChange={(e) => setMaxLr(parseFloat(e.target.value))}
              className="accent-violet-500"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              min lr:{" "}
              <span className="text-foreground">{minLr.toExponential(1)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={maxLr * 0.5}
              step={1e-6}
              value={minLr}
              onChange={(e) => setMinLr(parseFloat(e.target.value))}
              className="accent-violet-500"
            />
          </label>
        </div>
      </div>
    </VisualFrame>
  );
}
