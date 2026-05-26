"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * 论文指南封面：浮动的论文卡片 + 引用连线
 */
export function PaperGuideCover({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 120), 50);
    return () => clearInterval(timer);
  }, []);

  // 三张"论文"卡片的位置，微微浮动
  const cards = [
    { x: 28, y: 32, label: "NeurIPS", color: "#6366f1" },
    { x: 58, y: 48, label: "KDD", color: "#10b981" },
    { x: 40, y: 68, label: "ACL", color: "#f59e0b" },
  ];

  const float = (base: number, offset: number) =>
    base + Math.sin(((t + offset) / 120) * Math.PI * 2) * 2;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f0fdfa] dark:from-[#0a1a14] dark:via-[#0d1f18] dark:to-[#0a1a14]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {mounted && (
          <>
            {/* 引用连线 */}
            <line
              x1={float(cards[0].x, 0)} y1={float(cards[0].y, 0)}
              x2={float(cards[1].x, 40)} y2={float(cards[1].y, 40)}
              stroke="#6366f1" strokeWidth="0.4" opacity="0.4"
              strokeDasharray="2 2"
            />
            <line
              x1={float(cards[1].x, 40)} y1={float(cards[1].y, 40)}
              x2={float(cards[2].x, 80)} y2={float(cards[2].y, 80)}
              stroke="#10b981" strokeWidth="0.4" opacity="0.4"
              strokeDasharray="2 2"
            />
            <line
              x1={float(cards[0].x, 0)} y1={float(cards[0].y, 0)}
              x2={float(cards[2].x, 80)} y2={float(cards[2].y, 80)}
              stroke="#f59e0b" strokeWidth="0.4" opacity="0.3"
              strokeDasharray="2 2"
            />

            {/* 论文卡片 */}
            {cards.map((card, i) => {
              const cx = float(card.x, i * 40);
              const cy = float(card.y, i * 40);
              return (
                <g key={card.label}>
                  <rect
                    x={cx - 10} y={cy - 7}
                    width="20" height="14"
                    rx="2"
                    fill="white"
                    stroke={card.color}
                    strokeWidth="0.6"
                    opacity="0.9"
                    className="dark:fill-neutral-800"
                  />
                  {/* 模拟文字行 */}
                  <line x1={cx - 7} y1={cy - 3} x2={cx + 5} y2={cy - 3} stroke={card.color} strokeWidth="0.8" opacity="0.7" />
                  <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="0.5" />
                  <line x1={cx - 7} y1={cy + 2.5} x2={cx + 3} y2={cy + 2.5} stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="0.5" />
                  {/* 标签 */}
                  <text
                    x={cx} y={cy + 12}
                    textAnchor="middle"
                    fill={card.color}
                    className="text-[4px] font-mono"
                    opacity="0.8"
                  >
                    {card.label}
                  </text>
                </g>
              );
            })}

            {/* 搜索图标暗示 */}
            <circle cx="72" cy="28" r="6" fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="0.6" />
            <line x1="76.5" y1="32.5" x2="80" y2="36" stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="0.8" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}
