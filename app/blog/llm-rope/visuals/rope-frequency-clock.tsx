"use client";

import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

// 时钟类比：秒针 / 分针 / 时针 共同确定时间点
// 把"位置 m"想成时刻，每根针的频率不同
const HANDS = [
  { name: "秒针", periodSec: 60, color: "stroke-violet-500", length: 36 },
  { name: "分针", periodSec: 3600, color: "stroke-sky-500", length: 28 },
  { name: "时针", periodSec: 43200, color: "stroke-emerald-500", length: 18 },
];

export function RopeFrequencyClock() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      // 把真实秒压缩，让分针、时针在演示时间内也走得见
      const compressed = ((t - start) / 1000) * 60;
      setNow(compressed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <VisualFrame title="高频针 + 低频针组合，唯一确定一个时刻">
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 100 100" className="w-full max-w-xs h-auto">
          {/* 表盘 */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            className="stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth={0.6}
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = 50 + Math.cos(a) * 40;
            const y1 = 50 + Math.sin(a) * 40;
            const x2 = 50 + Math.cos(a) * 44;
            const y2 = 50 + Math.sin(a) * 44;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-neutral-400 dark:stroke-neutral-600"
                strokeWidth={0.6}
              />
            );
          })}
          {/* 三根针 */}
          {HANDS.map((h, i) => {
            const angle = ((now / h.periodSec) % 1) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * h.length;
            const y = 50 + Math.sin(angle) * h.length;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                className={h.color}
                strokeWidth={1.2 + (HANDS.length - i) * 0.4}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx="50" cy="50" r="1.5" className="fill-foreground" />
        </svg>

        <div className="grid grid-cols-3 gap-3 w-full max-w-md text-xs font-mono">
          {HANDS.map((h, i) => {
            const cycles = now / h.periodSec;
            const dotColor = ["bg-violet-500", "bg-sky-500", "bg-emerald-500"][i];
            return (
              <div
                key={h.name}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="text-foreground">{h.name}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  {cycles.toFixed(3)} 圈
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs font-mono text-muted-foreground leading-relaxed text-center max-w-md">
          只看秒针，时间会每分钟重复。只看时针，分辨率太粗。三根针组合起来，
          每个时刻都对应唯一的指针配置。RoPE 的多频率旋转就是同一个把戏。
        </p>
      </div>
    </VisualFrame>
  );
}
