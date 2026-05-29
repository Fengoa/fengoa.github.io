"use client";

import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

// 通用能力 vs 指令遵循随训练步数的双曲线
// 高亮「最佳停止点」

export function CatastrophicForgettingPlot() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) return 0;
        return Math.min(1, p + 0.012);
      });
    }, 60);
    return () => clearInterval(t);
  }, []);

  const W = 460;
  const H = 220;
  const PAD = { l: 44, r: 16, t: 16, b: 36 };

  // 横轴 0~1 = 训练步数 0~5000
  // 指令遵循：从 0.2 sigmoid 上升到 0.92
  const inst = (t: number) =>
    0.2 + (0.92 - 0.2) / (1 + Math.exp(-10 * (t - 0.3)));
  // 通用能力：从 0.85 缓慢下降，过了某点加速下降
  const general = (t: number) => 0.85 - 0.05 * t - 0.45 * Math.pow(t, 3.2);

  // 综合分数 = 0.5*inst + 0.5*general，求峰值
  const N = 80;
  let best = 0;
  let bestT = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const score = 0.5 * inst(t) + 0.5 * general(t);
    if (score > best) {
      best = score;
      bestT = t;
    }
  }

  const xScale = (t: number) => PAD.l + t * (W - PAD.l - PAD.r);
  const yScale = (v: number) =>
    PAD.t + (1 - v) * (H - PAD.t - PAD.b);

  const buildPath = (fn: (t: number) => number) => {
    const upTo = Math.floor(N * progress);
    const pts: string[] = [];
    for (let i = 0; i <= upTo; i++) {
      const t = i / N;
      pts.push(`${i === 0 ? "M" : "L"} ${xScale(t).toFixed(2)} ${yScale(fn(t)).toFixed(2)}`);
    }
    return pts.join(" ");
  };

  return (
    <VisualFrame title="灾难性遗忘：训练越久，通用能力下滑、指令遵循上升，找到甜点">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto flex-1"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 网格 */}
          {[0.2, 0.4, 0.6, 0.8].map((v) => (
            <g key={v}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={yScale(v)}
                y2={yScale(v)}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth={0.5}
                strokeDasharray="2 2"
              />
              <text
                x={PAD.l - 6}
                y={yScale(v) + 3}
                textAnchor="end"
                className="text-[8px] font-mono fill-muted-foreground"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}
          {/* 轴 */}
          <line
            x1={PAD.l}
            x2={PAD.l}
            y1={PAD.t}
            y2={H - PAD.b}
            className="stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth={0.8}
          />
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={H - PAD.b}
            y2={H - PAD.b}
            className="stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth={0.8}
          />
          <text
            x={(PAD.l + W - PAD.r) / 2}
            y={H - 8}
            textAnchor="middle"
            className="text-[10px] font-mono fill-muted-foreground"
          >
            训练步数
          </text>

          {/* 最佳点垂直线 */}
          {progress > bestT && (
            <line
              x1={xScale(bestT)}
              x2={xScale(bestT)}
              y1={PAD.t}
              y2={H - PAD.b}
              className="stroke-amber-500"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.8}
            />
          )}

          {/* 指令遵循（上升）*/}
          <path
            d={buildPath(inst)}
            fill="none"
            stroke="#10b981"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          {/* 通用能力（下降）*/}
          <path
            d={buildPath(general)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={1.8}
            strokeLinecap="round"
          />

          {/* 最佳点 */}
          {progress >= bestT && (
            <g>
              <circle
                cx={xScale(bestT)}
                cy={yScale(inst(bestT))}
                r={3}
                fill="#10b981"
              />
              <circle
                cx={xScale(bestT)}
                cy={yScale(general(bestT))}
                r={3}
                fill="#94a3b8"
              />
              <text
                x={xScale(bestT) + 6}
                y={PAD.t + 12}
                className="text-[10px] font-mono fill-amber-600 dark:fill-amber-400"
              >
                早停甜点
              </text>
            </g>
          )}
        </svg>

        <div className="lg:w-48 space-y-3 text-xs font-mono">
          <Item color="#10b981" label="指令遵循" desc="SFT 训练目标，单调上升" />
          <Item
            color="#94a3b8"
            label="通用能力"
            desc="预训练学到的知识 / 写作流畅度"
          />
          <Item color="#f59e0b" label="早停" desc="综合得分最高的步数" />
        </div>
      </div>
    </VisualFrame>
  );
}

function Item({
  color,
  label,
  desc,
}: {
  color: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="text-foreground font-medium">{label}</div>
        <div className="text-muted-foreground/80 mt-0.5 leading-snug">{desc}</div>
      </div>
    </div>
  );
}
