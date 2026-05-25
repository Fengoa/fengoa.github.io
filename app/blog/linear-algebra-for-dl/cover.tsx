"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * 线性代数封面：旋转的坐标轴 + 向量投影动画
 */
export function LinearAlgebraCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 360), 40);
    return () => clearInterval(timer);
  }, []);

  const rad = (t * Math.PI) / 180;
  // 旋转的向量
  const vx = 30 * Math.cos(rad * 0.5);
  const vy = 30 * Math.sin(rad * 0.5);
  // 第二个向量（慢速旋转）
  const ux = 25 * Math.cos(rad * 0.3 + 1.2);
  const uy = 25 * Math.sin(rad * 0.3 + 1.2);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fff7ed] dark:from-[#1c1a0f] dark:via-[#1e1808] dark:to-[#1c1610]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 网格 */}
        {[20, 30, 40, 50, 60, 70, 80].map((v) => (
          <g key={v}>
            <line
              x1={v} y1="20" x2={v} y2="80"
              stroke="currentColor"
              className="text-amber-200/50 dark:text-amber-800/30"
              strokeWidth="0.2"
            />
            <line
              x1="20" y1={v} x2="80" y2={v}
              stroke="currentColor"
              className="text-amber-200/50 dark:text-amber-800/30"
              strokeWidth="0.2"
            />
          </g>
        ))}

        {/* 坐标轴 */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" className="text-amber-300 dark:text-amber-700" strokeWidth="0.5" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" className="text-amber-300 dark:text-amber-700" strokeWidth="0.5" />

        {mounted && (
          <>
            {/* 向量 v（蓝紫色） */}
            <line
              x1="50" y1="50"
              x2={50 + vx} y2={50 - vy}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle
              cx={50 + vx} cy={50 - vy}
              r="2"
              fill="#6366f1"
              opacity="0.9"
            />

            {/* 向量 u（绿色） */}
            <line
              x1="50" y1="50"
              x2={50 + ux} y2={50 - uy}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle
              cx={50 + ux} cy={50 - uy}
              r="2"
              fill="#10b981"
              opacity="0.9"
            />

            {/* 投影虚线 */}
            <line
              x1={50 + vx} y1={50 - vy}
              x2={50 + vx} y2="50"
              stroke="#6366f1"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <line
              x1={50 + vx} y1={50 - vy}
              x2="50" y2={50 - vy}
              stroke="#6366f1"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
          </>
        )}

        {/* 原点 */}
        <circle cx="50" cy="50" r="1.5" className="fill-amber-500 dark:fill-amber-400" opacity="0.8" />

        {/* 标签 */}
        <text x="82" y="52" className="text-[5px] font-mono fill-amber-500/60">x</text>
        <text x="48" y="18" className="text-[5px] font-mono fill-amber-500/60">y</text>
      </svg>
    </div>
  );
}
