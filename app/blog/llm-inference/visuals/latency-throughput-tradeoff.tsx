"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 模拟数据：batch size 1, 2, 4, 8, 16, 32, 64
// 单 token 延迟（ms）：随 batch 升大体上升（GPU 算力饱和后）
// 吞吐（tokens/s）：先升后趋平

const points = [
  { bs: 1, latency: 35, throughput: 28 },
  { bs: 2, latency: 38, throughput: 52 },
  { bs: 4, latency: 44, throughput: 91 },
  { bs: 8, latency: 56, throughput: 143 },
  { bs: 16, latency: 78, throughput: 205 },
  { bs: 32, latency: 118, throughput: 271 },
  { bs: 64, latency: 195, throughput: 328 },
];

export function LatencyThroughputTradeoff() {
  const [hover, setHover] = useState<number>(3); // 默认高亮 bs=8
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setAuto((i) => (i + 1) % points.length), 1500);
    return () => clearInterval(timer);
  }, []);

  const idx = hover ?? auto;
  const cur = points[idx];

  const W = 600;
  const H = 240;
  const PAD = { l: 44, r: 44, t: 16, b: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const xMax = points.length - 1;
  const latMax = 220;
  const tpMax = 360;

  const xS = (i: number) => PAD.l + (i / xMax) * innerW;
  const yLat = (v: number) => PAD.t + (1 - v / latMax) * innerH;
  const yTp = (v: number) => PAD.t + (1 - v / tpMax) * innerH;

  const latPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xS(i).toFixed(1)} ${yLat(p.latency).toFixed(1)}`)
    .join(" ");
  const tpPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xS(i).toFixed(1)} ${yTp(p.throughput).toFixed(1)}`)
    .join(" ");

  return (
    <VisualFrame title="batch size 越大，吞吐越高，但单条请求的延迟也跟着涨">
      <div className="space-y-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* 网格 */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={PAD.t + f * innerH}
              y2={PAD.t + f * innerH}
              stroke="currentColor"
              className="text-neutral-200 dark:text-neutral-800"
              strokeDasharray="2 2"
              strokeWidth={0.5}
            />
          ))}

          {/* 轴 */}
          <line
            x1={PAD.l}
            x2={PAD.l}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
          />
          <line
            x1={W - PAD.r}
            x2={W - PAD.r}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
          />
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={H - PAD.b}
            y2={H - PAD.b}
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
          />

          {/* 左轴标签 */}
          <text
            x={8}
            y={PAD.t + innerH / 2}
            textAnchor="middle"
            className="text-[9px] font-mono fill-rose-500"
            transform={`rotate(-90, 8, ${PAD.t + innerH / 2})`}
          >
            latency (ms/token)
          </text>
          {/* 左轴刻度 */}
          {[0, 50, 100, 150, 200].map((v) => (
            <g key={v}>
              <text
                x={PAD.l - 6}
                y={yLat(v) + 3}
                textAnchor="end"
                className="text-[9px] font-mono fill-rose-500/70"
              >
                {v}
              </text>
            </g>
          ))}

          {/* 右轴标签 */}
          <text
            x={W - 8}
            y={PAD.t + innerH / 2}
            textAnchor="middle"
            className="text-[9px] font-mono fill-emerald-500"
            transform={`rotate(90, ${W - 8}, ${PAD.t + innerH / 2})`}
          >
            throughput (tokens/s)
          </text>
          {[0, 100, 200, 300].map((v) => (
            <text
              key={v}
              x={W - PAD.r + 6}
              y={yTp(v) + 3}
              textAnchor="start"
              className="text-[9px] font-mono fill-emerald-500/70"
            >
              {v}
            </text>
          ))}

          {/* x 轴 batch size */}
          {points.map((p, i) => (
            <text
              key={i}
              x={xS(i)}
              y={H - PAD.b + 14}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
            >
              {p.bs}
            </text>
          ))}
          <text
            x={W / 2}
            y={H - 4}
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            batch size
          </text>

          {/* 延迟曲线 */}
          <path d={latPath} fill="none" stroke="#ef4444" strokeWidth={1.6} />
          {/* 吞吐曲线 */}
          <path d={tpPath} fill="none" stroke="#10b981" strokeWidth={1.6} />

          {/* hover 圆点 */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={xS(i)} cy={yLat(p.latency)} r={3} fill="#ef4444" />
              <circle cx={xS(i)} cy={yTp(p.throughput)} r={3} fill="#10b981" />
              {/* hit area */}
              <rect
                x={xS(i) - 14}
                y={PAD.t}
                width={28}
                height={innerH}
                fill="transparent"
              />
            </g>
          ))}

          {/* 高亮当前点的竖线 */}
          <line
            x1={xS(idx)}
            x2={xS(idx)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="#8b5cf6"
            strokeDasharray="3 2"
            strokeWidth={0.8}
          />
        </svg>

        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <Card label="batch size" value={`${cur.bs}`} accent="text-violet-500" />
          <Card
            label="单 token 延迟"
            value={`${cur.latency} ms`}
            accent="text-rose-500"
          />
          <Card
            label="吞吐"
            value={`${cur.throughput} tok/s`}
            accent="text-emerald-500"
          />
        </div>

        <div className="text-xs font-mono text-muted-foreground text-center pt-1">
          交互式：鼠标悬停在曲线上的任一点查看具体数值
        </div>
      </div>
    </VisualFrame>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-800 px-3 py-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn("text-base font-semibold mt-0.5 tabular-nums", accent)}>
        {value}
      </div>
    </div>
  );
}
