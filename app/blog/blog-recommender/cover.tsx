"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * 博客推荐系统封面：节点间连线形成推荐网络
 */
export function BlogRecommenderCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 120), 50);
    return () => clearInterval(timer);
  }, []);

  // 节点位置
  const nodes = [
    { x: 50, y: 30, color: "#6366f1", label: "A" },
    { x: 28, y: 50, color: "#10b981", label: "B" },
    { x: 72, y: 50, color: "#f59e0b", label: "C" },
    { x: 35, y: 72, color: "#ec4899", label: "D" },
    { x: 65, y: 72, color: "#06b6d4", label: "E" },
  ];

  // 连线（表示相似度关系），按强度排列
  const edges = [
    { from: 0, to: 1, strength: 0.9 },
    { from: 0, to: 2, strength: 0.8 },
    { from: 1, to: 3, strength: 0.85 },
    { from: 2, to: 4, strength: 0.75 },
    { from: 3, to: 4, strength: 0.6 },
    { from: 1, to: 2, strength: 0.4 },
  ];

  // 脉冲动画：某条边在"传递推荐"
  const activeEdge = Math.floor(t / 20) % edges.length;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "bg-[#0f172a] dark:bg-[#020617]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {mounted && (
          <>
            {/* 连线 */}
            {edges.map((edge, i) => {
              const from = nodes[edge.from];
              const to = nodes[edge.to];
              const isActive = i === activeEdge;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isActive ? "#818cf8" : "#334155"}
                  strokeWidth={isActive ? 1.2 : 0.5}
                  opacity={isActive ? 0.9 : edge.strength * 0.5}
                  strokeDasharray={isActive ? "none" : "2 2"}
                />
              );
            })}

            {/* 脉冲粒子 */}
            {(() => {
              const edge = edges[activeEdge];
              const from = nodes[edge.from];
              const to = nodes[edge.to];
              const prog = (t % 20) / 20;
              const px = from.x + (to.x - from.x) * prog;
              const py = from.y + (to.y - from.y) * prog;
              return (
                <circle cx={px} cy={py} r="1.5" fill="#818cf8" opacity={0.9}>
                  <animate attributeName="r" values="1;2;1" dur="0.5s" repeatCount="indefinite" />
                </circle>
              );
            })()}

            {/* 节点 */}
            {nodes.map((node, i) => (
              <g key={i}>
                <circle
                  cx={node.x} cy={node.y}
                  r="6"
                  fill={node.color}
                  opacity="0.15"
                />
                <circle
                  cx={node.x} cy={node.y}
                  r="3.5"
                  fill={node.color}
                  opacity="0.9"
                />
                <text
                  x={node.x} y={node.y + 1.5}
                  textAnchor="middle"
                  className="text-[4px] font-mono font-bold"
                  fill="white"
                >
                  {node.label}
                </text>
              </g>
            ))}

            {/* 标签 */}
            <text x="50" y="92" textAnchor="middle" className="text-[5px] font-mono" fill="#64748b" opacity="0.6">
              similarity graph
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
