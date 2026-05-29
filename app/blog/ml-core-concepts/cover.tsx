"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function MLConceptsCover({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 40), 150);
    return () => clearInterval(timer);
  }, []);

  // 模拟梯度下降：一个小球沿着 loss 曲面下滑
  const getY = (x: number) => 2.5 * Math.pow(x - 0.5, 2) + 0.3 + Math.sin(x * 6) * 0.08;
  const ballX = 0.1 + (step / 39) * 0.8;
  const ballY = getY(ballX);

  // 曲线路径点（Y 轴：上=大 loss，下=小 loss）
  const curvePoints = Array.from({ length: 50 }, (_, i) => {
    const x = i / 49;
    const px = 15 + x * 70;
    const py = 15 + (1 - getY(x)) * 55 + 10;
    return `${i === 0 ? "M" : "L"}${px},${py}`;
  }).join(" ");

  return (
    <div className={cn(
      "relative aspect-square w-full overflow-hidden rounded-2xl",
      "bg-[#0f172a] dark:bg-[#020617]",
      className
    )}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 网格 */}
        {[20, 35, 50, 65, 80].map((v) => (
          <g key={v}>
            <line x1={v} y1="15" x2={v} y2="85" stroke="#1e293b" strokeWidth="0.3" />
            <line x1="15" y1={v} x2="85" y2={v} stroke="#1e293b" strokeWidth="0.3" />
          </g>
        ))}

        {/* Loss 曲面 */}
        <path d={curvePoints} fill="none" stroke="url(#mlGrad)" strokeWidth="2" strokeLinecap="round" />

        {/* 小球 */}
        <circle
          cx={15 + ballX * 70}
          cy={15 + (1 - ballY) * 55 + 10}
          r="3"
          fill="#f59e0b"
        >
          <animate attributeName="r" values="3;3.8;3" dur="0.8s" repeatCount="indefinite" />
        </circle>

        {/* 梯度箭头（指向下坡方向） */}
        {step > 2 && step < 38 && (
          <line
            x1={15 + ballX * 70}
            y1={15 + (1 - ballY) * 55 + 10}
            x2={15 + ballX * 70 + 6}
            y2={15 + (1 - ballY) * 55 + 10 + (ballX < 0.5 ? 4 : -4)}
            stroke="#f59e0b"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
            markerEnd="url(#arrowhead)"
          />
        )}

        {/* 标签 */}
        <text x="50" y="95" textAnchor="middle" className="text-[6px] font-mono" fill="#64748b">parameters</text>
        <text x="8" y="50" textAnchor="middle" className="text-[6px] font-mono" fill="#64748b" transform="rotate(-90,8,50)">loss</text>

        {/* 最低点标记：圆点画在曲线"下方一点点"避免被覆盖；用引导线把它和真实最低点连起来 */}
        {(() => {
          const minX = 15 + 0.5 * 70;
          const curveY = 15 + (1 - getY(0.5)) * 55 + 10;
          const markY = curveY + 6;   // 标记点往下偏移
          const labelY = markY + 5;   // 标签再往下
          return (
            <g>
              {/* 引导线：曲线最低点 → 标记点 */}
              <line
                x1={minX}
                y1={curveY}
                x2={minX}
                y2={markY}
                stroke="#10b981"
                strokeWidth="0.5"
                strokeDasharray="1 1"
                opacity="0.6"
              />
              {/* 标记点：实心 + 边框 */}
              <circle
                cx={minX}
                cy={markY}
                r="1.6"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="0.8"
              />
              {/* min 标签 */}
              <text
                x={minX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="hanging"
                className="text-[4.5px] font-mono"
                fill="#10b981"
              >
                min
              </text>
            </g>
          );
        })()}

        <defs>
          <linearGradient id="mlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#f59e0b" opacity="0.6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
