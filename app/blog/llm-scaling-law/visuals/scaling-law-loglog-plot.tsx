"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// ScalingLawLoglogPlot：参数量 N、数据量 D、算力 C 的幂律 L = (X_c / X)^α
// 三个 tab 切换横轴；同一张图内既画本项目实验数据，也画拟合曲线
// =============================================================================

type Axis = "N" | "D" | "C";

const AXIS_META: Record<
  Axis,
  {
    label: string;
    xUnit: string;
    alpha: number;
    Xc: number;
    samples: { x: number; loss: number; tag: string }[];
    tabName: string;
    blurb: string;
  }
> = {
  N: {
    label: "参数量 N",
    xUnit: "params",
    alpha: 0.076,
    Xc: 8.8e13,
    tabName: "参数量",
    blurb: "固定数据 + 步数，扫不同模型大小",
    samples: [
      { x: 53e3, loss: 2.07, tag: "tiny 53K" },
      { x: 228e3, loss: 1.88, tag: "small 228K" },
      { x: 403e3, loss: 1.75, tag: "base 403K" },
      { x: 1.8e6, loss: 1.52, tag: "medium 1.8M" },
      { x: 3.2e6, loss: 1.51, tag: "large 3.2M" },
      { x: 10.7e6, loss: 1.68, tag: "xlarge 10.7M ← 过拟合" },
    ],
  },
  D: {
    label: "数据量 D",
    xUnit: "tokens",
    alpha: 0.095,
    Xc: 5.4e13,
    tabName: "数据量",
    blurb: "固定 base 模型，扫不同数据量",
    samples: [
      { x: 50e3, loss: 2.7, tag: "5%  50K" },
      { x: 100e3, loss: 2.24, tag: "10%  100K" },
      { x: 201e3, loss: 2.05, tag: "20%  201K" },
      { x: 502e3, loss: 1.91, tag: "50%  502K" },
      { x: 1.0e6, loss: 1.76, tag: "100% 1.0M" },
    ],
  },
  C: {
    label: "算力 C (FLOPs)",
    xUnit: "FLOPs",
    alpha: 0.05,
    Xc: 3.1e8,
    tabName: "算力",
    blurb: "FLOPs ≈ 6ND，沿 Chinchilla 配比走的轨迹",
    samples: [
      { x: 6e9, loss: 2.4, tag: "10⁹·6" },
      { x: 6e10, loss: 2.05, tag: "10¹⁰·6" },
      { x: 6e11, loss: 1.85, tag: "10¹¹·6" },
      { x: 6e12, loss: 1.65, tag: "10¹²·6" },
    ],
  },
};

const W = 100;
const H = 56;
const PAD = { l: 11, r: 6, t: 5, b: 11 };

function buildScales(samples: { x: number; loss: number }[]) {
  const xs = samples.map((s) => Math.log10(s.x));
  const ys = samples.map((s) => Math.log10(s.loss));
  const xMin = Math.floor(Math.min(...xs) - 0.3);
  const xMax = Math.ceil(Math.max(...xs) + 0.3);
  const yMin = Math.floor(Math.min(...ys) - 0.1);
  const yMax = Math.ceil(Math.max(...ys) + 0.1);
  return { xMin, xMax, yMin, yMax };
}

export function ScalingLawLoglogPlot() {
  const [axis, setAxis] = useState<Axis>("N");
  const [hover, setHover] = useState<number | null>(null);
  const meta = AXIS_META[axis];

  const scales = buildScales(meta.samples);

  const xOf = (x: number) =>
    PAD.l +
    ((Math.log10(x) - scales.xMin) / (scales.xMax - scales.xMin)) *
      (W - PAD.l - PAD.r);
  const yOf = (loss: number) =>
    H -
    PAD.b -
    ((Math.log10(loss) - scales.yMin) / (scales.yMax - scales.yMin)) *
      (H - PAD.t - PAD.b);

  // 拟合直线：log L = α(log Xc - log X)
  const fitLoss = (x: number) => Math.pow(meta.Xc / x, meta.alpha);
  const xLo = Math.pow(10, scales.xMin);
  const xHi = Math.pow(10, scales.xMax);
  const fitSamples = 80;
  const fitPts: string[] = [];
  for (let i = 0; i <= fitSamples; i++) {
    const lx = scales.xMin + ((scales.xMax - scales.xMin) * i) / fitSamples;
    const x = Math.pow(10, lx);
    if (x < xLo / 1.5 || x > xHi * 1.5) continue;
    const lo = fitLoss(x);
    fitPts.push(
      `${fitPts.length === 0 ? "M" : "L"} ${xOf(x).toFixed(2)} ${yOf(lo).toFixed(2)}`
    );
  }
  const fitPath = fitPts.join(" ");

  return (
    <VisualFrame title={`log-log 坐标下，loss 与 ${meta.label} 呈一条直线 —— 这就是幂律`}>
      <div className="flex flex-col gap-3">
        {/* tab 切换 */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {(Object.keys(AXIS_META) as Axis[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                setAxis(k);
                setHover(null);
              }}
              className={cn(
                "px-3 py-1 rounded border transition-colors",
                axis === k
                  ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-foreground"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
            >
              {AXIS_META[k].tabName}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          {meta.blurb} · α = {meta.alpha}
        </p>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto font-mono"
          preserveAspectRatio="none"
        >
          {/* x 轴 log 刻度 */}
          {Array.from(
            { length: scales.xMax - scales.xMin + 1 },
            (_, i) => scales.xMin + i
          ).map((p) => (
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
              <text
                x={xOf(Math.pow(10, p))}
                y={H - 2}
                textAnchor="middle"
                fontSize={2.4}
                className="fill-muted-foreground"
              >
                10^{p}
              </text>
            </g>
          ))}
          {/* y 轴 log 刻度 */}
          {Array.from(
            { length: scales.yMax - scales.yMin + 1 },
            (_, i) => scales.yMin + i
          ).map((p) => (
            <g key={`yg-${p}`}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={yOf(Math.pow(10, p))}
                y2={yOf(Math.pow(10, p))}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth={0.15}
                strokeDasharray="0.6 0.6"
              />
              <text
                x={PAD.l - 1}
                y={yOf(Math.pow(10, p)) + 0.8}
                textAnchor="end"
                fontSize={2.4}
                className="fill-muted-foreground"
              >
                10^{p}
              </text>
            </g>
          ))}

          {/* 拟合直线 */}
          <motion.path
            key={`fit-${axis}`}
            d={fitPath}
            fill="none"
            className="stroke-violet-400/60 dark:stroke-violet-400/50"
            strokeWidth={0.5}
            strokeDasharray="1.2 0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* 数据点 */}
          {meta.samples.map((s, i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={xOf(s.x)}
                cy={yOf(s.loss)}
                r={hover === i ? 1.4 : 1}
                className="fill-emerald-500 dark:fill-emerald-400 transition-all cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              {hover === i && (
                <text
                  x={xOf(s.x)}
                  y={yOf(s.loss) - 2}
                  textAnchor="middle"
                  fontSize={2.4}
                  className="fill-foreground"
                >
                  loss {s.loss}
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs font-mono">
          {meta.samples.map((s, i) => (
            <button
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "px-2 py-1 rounded border text-left transition-colors",
                hover === i
                  ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40"
                  : "border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div className="text-muted-foreground text-xs">{s.tag}</div>
              <div className="text-foreground">loss {s.loss}</div>
            </button>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
