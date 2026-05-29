"use client";

import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";
import { cn } from "@/lib/utils";

// 三个不同频率的 (q,k) 维度对，共享位置 m。
// 频率 base = theta^(-2i/d)，演示常用值：高、中、低
const FREQS = [
  { name: "维度 0–1", omega: 1.0, color: "violet" },
  { name: "维度 32–33", omega: 0.25, color: "sky" },
  { name: "维度 62–63", omega: 0.04, color: "emerald" },
];

const POSITIONS = 16; // 0..15

export function Rope2dRotation() {
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setPos((p) => (p + 1) % POSITIONS);
    }, 600);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <VisualFrame title="不同维度对应不同旋转频率：低维转得快，高维几乎不动">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">
            位置 m = <span className="text-foreground tabular-nums">{pos}</span>
          </span>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-accent text-muted-foreground"
          >
            {playing ? "暂停" : "播放"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {FREQS.map((f) => {
            const angle = pos * f.omega;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const r = 30;
            const cx = 50;
            const cy = 50;
            const tipX = cx + cos * r;
            const tipY = cy - sin * r;

            // 旋转角的轨迹弧
            const sweep = angle > 0 ? 1 : 0;
            const startX = cx + r;
            const startY = cy;
            const arcLarge = angle > Math.PI ? 1 : 0;

            const colorMap: Record<string, string> = {
              violet: "stroke-violet-500 dark:stroke-violet-400 fill-violet-500 dark:fill-violet-400",
              sky: "stroke-sky-500 dark:stroke-sky-400 fill-sky-500 dark:fill-sky-400",
              emerald:
                "stroke-emerald-500 dark:stroke-emerald-400 fill-emerald-500 dark:fill-emerald-400",
            };

            return (
              <div key={f.name} className="flex flex-col items-center gap-2">
                <svg viewBox="0 0 100 100" className="w-full h-auto">
                  {/* 坐标轴 */}
                  <line
                    x1="10"
                    y1={cy}
                    x2="90"
                    y2={cy}
                    className="stroke-neutral-200 dark:stroke-neutral-800"
                    strokeWidth={0.4}
                  />
                  <line
                    x1={cx}
                    y1="10"
                    x2={cx}
                    y2="90"
                    className="stroke-neutral-200 dark:stroke-neutral-800"
                    strokeWidth={0.4}
                  />
                  {/* 单位圆 */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    className="stroke-neutral-300 dark:stroke-neutral-700"
                    strokeWidth={0.3}
                    strokeDasharray="1 1"
                  />
                  {/* 已扫过的弧 */}
                  {angle > 0.05 && (
                    <path
                      d={`M ${startX} ${startY} A ${r} ${r} 0 ${arcLarge} ${
                        sweep === 1 ? 0 : 1
                      } ${tipX} ${tipY}`}
                      fill="none"
                      className={cn(colorMap[f.color], "opacity-30")}
                      strokeWidth={0.8}
                    />
                  )}
                  {/* 向量 */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={tipX}
                    y2={tipY}
                    className={colorMap[f.color]}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                  />
                  <circle cx={tipX} cy={tipY} r={1.6} className={colorMap[f.color]} />
                  {/* 角度文字 */}
                  <text
                    x="50"
                    y="95"
                    textAnchor="middle"
                    fontSize="6"
                    className="fill-muted-foreground font-mono"
                  >
                    {(angle).toFixed(2)} rad
                  </text>
                </svg>
                <div className="text-xs font-mono text-muted-foreground text-center">
                  {f.name}
                  <br />
                  ω = {f.omega}
                </div>
              </div>
            );
          })}
        </div>

        {/* 位置滑条 */}
        <input
          type="range"
          min="0"
          max={POSITIONS - 1}
          value={pos}
          onChange={(e) => {
            setPlaying(false);
            setPos(Number(e.target.value));
          }}
          className="w-full accent-violet-500"
        />

        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          相同位置 m，每个维度对都被旋转一个独立角度。低频维度几乎不变（捕长距离），
          高频维度转一圈又一圈（捕短距离）。位置信息就藏在这组旋转角里。
        </p>
      </div>
    </VisualFrame>
  );
}
