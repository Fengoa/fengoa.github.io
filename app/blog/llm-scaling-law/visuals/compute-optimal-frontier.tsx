"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";
import { cn } from "@/lib/utils";

// =============================================================================
// ComputeOptimalFrontier：固定算力 C，loss = f(N, D=C/(6N))，画出 U 形曲线
// 拖动 C 滑块看最低点（compute-optimal）如何沿 N=D/20 的射线移动
// =============================================================================

// 用 Chinchilla 简化形式：L(N, D) = E + A/N^α + B/D^β
const E = 1.69;
const A = 406.4;
const B = 410.7;
const ALPHA = 0.34;
const BETA = 0.28;

function lossOf(N: number, D: number) {
  return E + A / Math.pow(N, ALPHA) + B / Math.pow(D, BETA);
}

const W = 100;
const H = 56;
const PAD = { l: 11, r: 6, t: 5, b: 11 };

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

function yOf(loss: number, lossMin: number, lossMax: number) {
  return (
    H -
    PAD.b -
    ((loss - lossMin) / (lossMax - lossMin)) * (H - PAD.t - PAD.b)
  );
}

const C_PRESETS = [
  { value: 6e18, label: "10¹⁸·⁸ FLOPs" },
  { value: 6e20, label: "10²⁰·⁸ FLOPs" },
  { value: 6e22, label: "10²²·⁸ FLOPs (≈ GPT-3)" },
  { value: 6e24, label: "10²⁴·⁸ FLOPs (≈ GPT-4 量级)" },
];

export function ComputeOptimalFrontier() {
  const [cIdx, setCIdx] = useState(2);
  const C = C_PRESETS[cIdx].value;

  const { path, optN, optD, optLoss, lossMin, lossMax } = useMemo(() => {
    const samples = 200;
    const points: { N: number; loss: number }[] = [];
    for (let i = 0; i <= samples; i++) {
      const lN =
        Math.log10(N_MIN) +
        ((Math.log10(N_MAX) - Math.log10(N_MIN)) * i) / samples;
      const N = Math.pow(10, lN);
      const D = C / (6 * N);
      if (D < 1e6) continue;
      points.push({ N, loss: lossOf(N, D) });
    }
    const lossMin = Math.min(...points.map((p) => p.loss));
    const lossMax = Math.max(...points.map((p) => p.loss));
    let opt = points[0];
    for (const p of points) if (p.loss < opt.loss) opt = p;
    const path = points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${xOf(p.N).toFixed(2)} ${yOf(
            p.loss,
            lossMin,
            lossMax
          ).toFixed(2)}`
      )
      .join(" ");
    return {
      path,
      optN: opt.N,
      optD: C / (6 * opt.N),
      optLoss: opt.loss,
      lossMin,
      lossMax,
    };
  }, [C]);

  const ratio = optD / optN;

  return (
    <VisualFrame title="固定一笔算力，把它分给 N（多）还是 D（多）？U 形曲线的底部就是 Chinchilla 最优点">
      <div className="flex flex-col gap-3">
        {/* C 选择 */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {C_PRESETS.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setCIdx(i)}
              className={cn(
                "px-3 py-1 rounded border transition-colors",
                cIdx === i
                  ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-foreground"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto font-mono"
          preserveAspectRatio="none"
        >
          {/* 网格：log N */}
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

          {/* y 轴 loss */}
          <text
            x={PAD.l - 0.5}
            y={PAD.t + 1.5}
            textAnchor="end"
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            loss
          </text>
          <text
            x={PAD.l - 0.5}
            y={H - PAD.b}
            textAnchor="end"
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            {lossMin.toFixed(2)}
          </text>
          <text
            x={W - PAD.r - 1}
            y={H - PAD.b - 1}
            textAnchor="end"
            fontSize={2.4}
            className="fill-muted-foreground"
          >
            参数量 N
          </text>

          {/* U 形曲线 */}
          <motion.path
            key={cIdx}
            d={path}
            fill="none"
            className="stroke-violet-500 dark:stroke-violet-400"
            strokeWidth={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* 最优点 */}
          <motion.circle
            key={`opt-${cIdx}`}
            cx={xOf(optN)}
            cy={yOf(optLoss, lossMin, lossMax)}
            r={1.6}
            className="fill-amber-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          />
          <text
            x={xOf(optN)}
            y={yOf(optLoss, lossMin, lossMax) - 2.2}
            textAnchor="middle"
            fontSize={2.6}
            className="fill-amber-700 dark:fill-amber-400 font-semibold"
          >
            optimal
          </text>
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800">
            <div className="text-muted-foreground">最优参数量 N*</div>
            <div className="text-foreground text-sm">
              {optN.toExponential(2)}
            </div>
          </div>
          <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800">
            <div className="text-muted-foreground">最优数据量 D*</div>
            <div className="text-foreground text-sm">
              {optD.toExponential(2)}
            </div>
          </div>
          <div className="px-3 py-2 rounded border border-amber-200 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="text-muted-foreground">D / N 比值</div>
            <div className="text-amber-700 dark:text-amber-400 text-sm">
              {ratio.toFixed(1)} ≈ 20
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
