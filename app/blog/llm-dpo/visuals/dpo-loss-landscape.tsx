"use client";

import { useState } from "react";
import { VisualFrame } from "./frame";

// DPO loss 沿 chosen-rejected 差值的 sigmoid 曲线
// β slider 调陡峭度

export function DpoLossLandscape() {
  const [beta, setBeta] = useState(0.1);

  const W = 460;
  const H = 220;
  const PAD = { l: 40, r: 16, t: 16, b: 36 };

  // x = β * (log π_θ(chosen)/π_ref(chosen) - log π_θ(rejected)/π_ref(rejected))
  // 简化为模型对 chosen 比 rejected 的相对偏好分数 d ∈ [-3, 3]
  // loss = -log σ(β * d * 10)，β 是滑块
  // 这里把 β 映射成曲线斜率
  const xMin = -3;
  const xMax = 3;
  const yMin = 0;
  const yMax = 3;

  const xScale = (x: number) =>
    PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
  const yScale = (y: number) =>
    PAD.t + (1 - (y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  const lossAt = (d: number) => {
    // β 控制陡峭度：β·d 越大，σ 越接近 1，-log σ 越接近 0
    const z = beta * d * 10;
    return -Math.log(Math.max(1e-6, sigmoid(z)));
  };

  // 路径
  const N = 80;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin);
    const y = lossAt(x);
    pts.push(`${i === 0 ? "M" : "L"} ${xScale(x).toFixed(2)} ${yScale(Math.min(yMax, y)).toFixed(2)}`);
  }

  return (
    <VisualFrame title="DPO loss 形状：β 控制对偏好对的「敏感度」">
      <div className="space-y-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 网格 */}
          {[0, 1, 2, 3].map((v) => (
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
                {v}
              </text>
            </g>
          ))}

          {/* 中线 x=0 */}
          <line
            x1={xScale(0)}
            x2={xScale(0)}
            y1={PAD.t}
            y2={H - PAD.b}
            className="stroke-neutral-300 dark:stroke-neutral-700"
            strokeDasharray="2 2"
            strokeWidth={0.5}
          />

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

          {/* x 轴标签 */}
          <text
            x={(PAD.l + W - PAD.r) / 2}
            y={H - 6}
            textAnchor="middle"
            className="text-[10px] font-mono fill-muted-foreground"
          >
            chosen 对 rejected 的相对偏好分
          </text>
          <text
            x={PAD.l + 4}
            y={H - PAD.b + 14}
            className="text-[9px] font-mono fill-muted-foreground"
          >
            模型偏向 rejected
          </text>
          <text
            x={W - PAD.r - 4}
            y={H - PAD.b + 14}
            textAnchor="end"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            模型偏向 chosen
          </text>

          {/* 曲线 */}
          <path
            d={pts.join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth={1.8}
            strokeLinecap="round"
          />

          {/* loss 标签 */}
          <text
            x={10}
            y={H / 2}
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
            transform={`rotate(-90, 10, ${H / 2})`}
          >
            loss
          </text>
        </svg>

        {/* β 滑块 */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">β</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {beta.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.01}
            max={0.5}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground/70">
            <span>0.01 激进</span>
            <span>0.1 常用</span>
            <span>0.5 保守</span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
