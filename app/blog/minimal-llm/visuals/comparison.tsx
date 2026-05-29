"use client";

import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

// =============================================================================
// 05 — ModelComparison：三个模型 loss 曲线对比
// =============================================================================

export function ModelComparison() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const HOLD_MS = 2500; // 到达终点后停留时长
    const STEP_MS = 60;
    const STEP = 0.01;
    let holdUntil = 0;

    const timer = setInterval(() => {
      const now = Date.now();
      setProgress((p) => {
        if (p >= 1) {
          if (holdUntil === 0) holdUntil = now + HOLD_MS;
          if (now < holdUntil) return 1;
          holdUntil = 0;
          return 0;
        }
        return Math.min(1, p + STEP);
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  // 三条 loss 曲线（指数衰减到不同终值）
  const models = [
    {
      name: "Bigram",
      finalLoss: 2.53,
      decay: 2.5,
      color: "#94a3b8", // slate
      colorClass: "text-slate-500",
      params: "4K",
      ctx: "1 char",
    },
    {
      name: "MLP",
      finalLoss: 1.78,
      decay: 3.5,
      color: "#f59e0b", // amber
      colorClass: "text-amber-500",
      params: "350K",
      ctx: "16 chars",
    },
    {
      name: "MiniGPT",
      finalLoss: 1.58,
      decay: 4.0,
      color: "#10b981", // emerald
      colorClass: "text-emerald-500",
      params: "420K",
      ctx: "64 chars",
    },
  ];

  const startLoss = 4.3;
  const W = 400;
  const H = 200;
  const PAD = { l: 36, r: 48, t: 16, b: 28 };
  const yMin = 1.2;
  const yMax = 4.6;

  const xScale = (t: number) =>
    PAD.l + t * (W - PAD.l - PAD.r);
  // SVG 坐标系 y 向下，需要反转：v 越大，y 越小（顶部）
  const yScale = (v: number) =>
    PAD.t + ((yMax - v) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  return (
    <VisualFrame title="三个模型的训练曲线：上下文越长、动态关注 → loss 越低">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 网格 */}
            {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={yScale(v)}
                  y2={yScale(v)}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
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
              stroke="currentColor"
              className="text-neutral-300 dark:text-neutral-700"
              strokeWidth={0.8}
            />
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={H - PAD.b}
              y2={H - PAD.b}
              stroke="currentColor"
              className="text-neutral-300 dark:text-neutral-700"
              strokeWidth={0.8}
            />
            <text
              x={W / 2}
              y={H - 6}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
            >
              training steps
            </text>
            <text
              x={10}
              y={H / 2}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
              transform={`rotate(-90, 10, ${H / 2})`}
            >
              val loss
            </text>

            {/* 三条曲线 */}
            {models.map((m, mi) => {
              const N = 80;
              const lossAt = (t: number) =>
                m.finalLoss +
                (startLoss - m.finalLoss) * Math.exp(-m.decay * t) +
                Math.sin(t * 24 + mi * 1.7) * 0.04 * (1 - t);
              const points: string[] = [];
              const upTo = Math.floor(N * progress);
              for (let i = 0; i <= upTo; i++) {
                const t = i / N;
                const x = xScale(t);
                const y = yScale(lossAt(t));
                points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
              }
              const lastT = upTo / N;
              const lastX = xScale(lastT);
              const lastY = yScale(lossAt(lastT));
              return (
                <g key={m.name}>
                  <path
                    d={points.join(" ")}
                    fill="none"
                    stroke={m.color}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {progress > 0 && (
                    <circle
                      cx={lastX}
                      cy={lastY}
                      r={2.5}
                      fill={m.color}
                    />
                  )}
                  {/* 终值标签 */}
                  {progress >= 0.99 && (
                    <text
                      x={lastX + 6}
                      y={lastY + 3}
                      className="text-[9px] font-mono"
                      fill={m.color}
                    >
                      {m.finalLoss.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 图例 */}
        <div className="lg:w-56 lg:shrink-0 space-y-5">
          {models.map((m) => (
            <div key={m.name} className="flex items-start gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-medium leading-snug">
                  {m.name}
                </div>
                <div className="mt-1 text-xs font-mono text-muted-foreground/80 leading-relaxed">
                  <div>{m.params} 参数</div>
                  <div>上下文 {m.ctx}</div>
                  <div>
                    val loss <span className="text-foreground/70">{m.finalLoss}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
