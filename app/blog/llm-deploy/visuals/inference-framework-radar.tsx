"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 5 个维度都按 1-5 打分，越高越好
const DIMS = ["吞吐", "低延迟", "易用", "省资源", "生态"];

const FRAMEWORKS = [
  {
    name: "vLLM",
    color: "#8b5cf6",
    scores: [5, 4, 3, 3, 5],
    desc: "PagedAttention + Continuous Batching，生产服务的事实标准",
  },
  {
    name: "TGI",
    color: "#10b981",
    scores: [4, 4, 4, 3, 4],
    desc: "HuggingFace 出品，文档全、和 HF 生态无缝",
  },
  {
    name: "llama.cpp",
    color: "#f59e0b",
    scores: [3, 3, 3, 5, 4],
    desc: "纯 C++，CPU/边缘设备首选，量化方案最齐",
  },
  {
    name: "Ollama",
    color: "#0ea5e9",
    scores: [2, 3, 5, 5, 4],
    desc: "llama.cpp 的傻瓜封装，本地玩最方便",
  },
];

export function InferenceFrameworkRadar() {
  const [active, setActive] = useState<number[]>([0, 1, 2, 3]);

  function toggle(i: number) {
    setActive((arr) =>
      arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i].sort()
    );
  }

  const W = 480;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2 - 10;
  const radius = 110;

  // 五边形顶点角度
  const angles = DIMS.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / DIMS.length);

  function point(score: number, angleIdx: number) {
    const r = (score / 5) * radius;
    const a = angles[angleIdx];
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function poly(scores: number[]) {
    return scores
      .map((s, i) => {
        const [x, y] = point(s, i);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <VisualFrame title="四个主流推理框架的五维比较：没有绝对赢家，看你要什么">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {FRAMEWORKS.map((f, i) => {
            const on = active.includes(i);
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => toggle(i)}
                className={cn(
                  "px-2.5 py-1 rounded border text-xs font-mono transition-all",
                  on ? "shadow-sm" : "opacity-50"
                )}
                style={{
                  borderColor: f.color + (on ? "" : "55"),
                  backgroundColor: on ? f.color + "18" : "transparent",
                  color: on ? f.color : undefined,
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: f.color }}
                />
                {f.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* 同心五边形网格 */}
            {[1, 2, 3, 4, 5].map((s) => (
              <polygon
                key={s}
                points={DIMS.map((_, i) => {
                  const [x, y] = point(s, i);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(" ")}
                fill="none"
                stroke="currentColor"
                className="text-neutral-200 dark:text-neutral-800"
                strokeWidth={0.5}
              />
            ))}

            {/* 轴线 */}
            {DIMS.map((_, i) => {
              const [x, y] = point(5, i);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* 维度标签 */}
            {DIMS.map((d, i) => {
              const [x, y] = point(5.4, i);
              return (
                <text
                  key={d}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-mono fill-muted-foreground"
                >
                  {d}
                </text>
              );
            })}

            {/* 框架多边形 */}
            {FRAMEWORKS.map((f, i) => {
              if (!active.includes(i)) return null;
              return (
                <g key={f.name}>
                  <polygon
                    points={poly(f.scores)}
                    fill={f.color}
                    fillOpacity={0.15}
                    stroke={f.color}
                    strokeWidth={1.6}
                  />
                  {f.scores.map((s, j) => {
                    const [x, y] = point(s, j);
                    return <circle key={j} cx={x} cy={y} r={3} fill={f.color} />;
                  })}
                </g>
              );
            })}
          </svg>

          {/* 描述列表 */}
          <div className="lg:w-72 space-y-2">
            {FRAMEWORKS.filter((_, i) => active.includes(i)).map((f) => (
              <div
                key={f.name}
                className="rounded border px-3 py-2"
                style={{ borderColor: f.color + "55" }}
              >
                <div className="font-mono text-sm font-semibold" style={{ color: f.color }}>
                  {f.name}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {f.desc}
                </div>
              </div>
            ))}
            {active.length === 0 && (
              <div className="text-xs text-muted-foreground italic">
                点上面的标签选择对比项
              </div>
            )}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
