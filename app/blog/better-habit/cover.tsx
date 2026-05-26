"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * 培养良好习惯封面：循环箭头逐渐填满，代表习惯形成
 */
export function BetterHabitCover({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p + 1) % 100);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const radius = 28;
  const cx = 50;
  const cy = 50;
  // 4 个阶段标记点
  const stages = ["提示", "渴求", "反应", "奖励"];
  const stageAngles = [0, 90, 180, 270];

  // 环形进度
  const circumference = 2 * Math.PI * radius;
  const fillLength = (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#fdf4ff] via-[#faf5ff] to-[#f5f3ff] dark:from-[#1a0a20] dark:via-[#150a1e] dark:to-[#10081a]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 底层圆环（淡色轨道） */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="currentColor"
          className="text-purple-100 dark:text-purple-900/40"
          strokeWidth="3"
        />

        {/* 进度填充 */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="url(#habitGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${fillLength} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* 4 个阶段点 */}
        {stageAngles.map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const px = cx + radius * Math.cos(rad);
          const py = cy + radius * Math.sin(rad);
          const labelR = radius + 10;
          const lx = cx + labelR * Math.cos(rad);
          const ly = cy + labelR * Math.sin(rad);
          const isActive = progress >= (i / 4) * 100;

          return (
            <g key={i}>
              <circle
                cx={px} cy={py} r="3"
                fill={isActive ? ["#a855f7", "#ec4899", "#f59e0b", "#10b981"][i] : "#e2e8f0"}
                className={isActive ? "" : "dark:fill-neutral-700"}
                opacity={isActive ? 1 : 0.5}
              />
              <text
                x={lx} y={ly + 1.5}
                textAnchor="middle"
                className="text-[4px] font-mono"
                fill={isActive ? ["#a855f7", "#ec4899", "#f59e0b", "#10b981"][i] : "#94a3b8"}
                opacity={isActive ? 0.9 : 0.4}
              >
                {stages[i]}
              </text>
            </g>
          );
        })}

        {/* 中心文字 */}
        <text x={cx} y={cy - 2} textAnchor="middle" className="text-[5px] font-mono" fill="#a855f7" opacity="0.6">
          habit
        </text>
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-[4px] font-mono" fill="#64748b" opacity="0.5">
          loop
        </text>

        <defs>
          <linearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
