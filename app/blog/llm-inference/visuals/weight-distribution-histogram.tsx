"use client";

import { useMemo, useState } from "react";
import { VisualFrame } from "./frame";

// 模拟一个真实 LLaMA 风格的权重分布：均值 0、标准差 ~0.04 的近似高斯，
// 长尾很轻。直方图覆盖 [-0.2, 0.2]，再叠加 INT4 的 16 个量化点。

const N_BINS = 60;
const RANGE_MIN = -0.2;
const RANGE_MAX = 0.2;

function gaussian(x: number, sigma: number) {
  return Math.exp(-(x * x) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
}

export function WeightDistributionHistogram() {
  // INT4 范围由滑块控制：[-clip, clip] 等分成 16 格
  const [clip, setClip] = useState(0.1);

  const bins = useMemo(() => {
    const arr: number[] = [];
    const step = (RANGE_MAX - RANGE_MIN) / N_BINS;
    for (let i = 0; i < N_BINS; i++) {
      const center = RANGE_MIN + (i + 0.5) * step;
      // 主体高斯 + 一点点尾部
      const v = 0.92 * gaussian(center, 0.04) + 0.08 * gaussian(center, 0.12);
      arr.push(v);
    }
    const max = Math.max(...arr);
    return arr.map((v) => v / max);
  }, []);

  // 16 个量化格点
  const quantPoints = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < 16; i++) {
      // 把 [-clip, clip] 等分成 16 个层级（典型对称量化）
      points.push(-clip + (i + 0.5) * ((2 * clip) / 16));
    }
    return points;
  }, [clip]);

  // 估算被 clip 截断的尾部占比（数值积分）
  const clippedRatio = useMemo(() => {
    const step = (RANGE_MAX - RANGE_MIN) / 1000;
    let total = 0;
    let inside = 0;
    for (let i = 0; i < 1000; i++) {
      const x = RANGE_MIN + (i + 0.5) * step;
      const v = 0.92 * gaussian(x, 0.04) + 0.08 * gaussian(x, 0.12);
      total += v;
      if (Math.abs(x) <= clip) inside += v;
    }
    return Math.max(0, 1 - inside / total);
  }, [clip]);

  const W = 600;
  const H = 200;
  const PAD = { l: 32, r: 16, t: 16, b: 32 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const xScale = (v: number) =>
    PAD.l + ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * innerW;
  const yScale = (v: number) => PAD.t + (1 - v) * innerH;

  const barW = innerW / N_BINS;

  return (
    <VisualFrame title="LLaMA 风格的权重分布：90% 集中在 [-0.1, 0.1]，INT4 量化只需要把这一段切成 16 份">
      <div className="space-y-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* 横轴 */}
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={H - PAD.b}
            y2={H - PAD.b}
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth={0.8}
          />
          {/* 横轴刻度 */}
          {[-0.2, -0.1, 0, 0.1, 0.2].map((v) => (
            <g key={v}>
              <line
                x1={xScale(v)}
                x2={xScale(v)}
                y1={H - PAD.b}
                y2={H - PAD.b + 4}
                stroke="currentColor"
                className="text-neutral-300 dark:text-neutral-700"
                strokeWidth={0.8}
              />
              <text
                x={xScale(v)}
                y={H - PAD.b + 14}
                textAnchor="middle"
                className="text-[9px] font-mono fill-muted-foreground"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {/* 直方图 */}
          {bins.map((h, i) => {
            const center = RANGE_MIN + (i + 0.5) * ((RANGE_MAX - RANGE_MIN) / N_BINS);
            const inside = Math.abs(center) <= clip;
            return (
              <rect
                key={i}
                x={xScale(center) - barW / 2 + 0.5}
                y={yScale(h)}
                width={barW - 1}
                height={(1 - (yScale(h) - PAD.t) / innerH) * innerH}
                fill={inside ? "#8b5cf6" : "#cbd5e1"}
                opacity={inside ? 0.85 : 0.6}
                className={inside ? "" : "dark:fill-[#475569]"}
              />
            );
          })}

          {/* clip 边界 */}
          {[-clip, clip].map((c) => (
            <line
              key={c}
              x1={xScale(c)}
              x2={xScale(c)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="#ef4444"
              strokeDasharray="3 2"
              strokeWidth={1}
            />
          ))}

          {/* INT4 量化点 */}
          {quantPoints.map((p, i) => (
            <g key={i}>
              <line
                x1={xScale(p)}
                x2={xScale(p)}
                y1={H - PAD.b - 6}
                y2={H - PAD.b}
                stroke="#10b981"
                strokeWidth={1.2}
              />
              <circle cx={xScale(p)} cy={H - PAD.b - 6} r={1.6} fill="#10b981" />
            </g>
          ))}

          {/* 图例 */}
          <g transform={`translate(${PAD.l}, ${PAD.t - 4})`}>
            <text
              className="text-[10px] font-mono fill-muted-foreground"
              x={0}
              y={0}
            >
              权重值分布
            </text>
          </g>
        </svg>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono">
            <label className="text-muted-foreground shrink-0">
              INT4 范围 ±
            </label>
            <input
              type="range"
              min="0.04"
              max="0.2"
              step="0.005"
              value={clip}
              onChange={(e) => setClip(parseFloat(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <span className="tabular-nums w-10 text-right">{clip.toFixed(3)}</span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-violet-500 inline-block rounded-sm" />
              落在量化范围内
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-400 inline-block rounded-sm" />
              被截断（饱和到边界）
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 inline-block rounded-full" />
              16 个 INT4 格点
            </span>
            <span className="ml-auto">
              截断比例 ≈{" "}
              <span className="text-foreground">
                {(clippedRatio * 100).toFixed(2)}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
