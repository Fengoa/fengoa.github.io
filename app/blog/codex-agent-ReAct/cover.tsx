"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CX = 50;
const CY = 54;
const R = 22;
const DOT_R = 3;
const LABEL_GAP = 7;

/** 等边三角形三顶点：顶角 -90°，底角 150° / 30° */
function vertex(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

const NODES = [
  { ...vertex(-90), label: "推理", color: "#6366f1", labelSide: "top" as const },
  { ...vertex(150), label: "行动", color: "#059669", labelSide: "bottom" as const },
  { ...vertex(30), label: "观测", color: "#d97706", labelSide: "bottom" as const },
];

function labelY(node: (typeof NODES)[number]) {
  return node.labelSide === "top" ? node.y - LABEL_GAP - DOT_R : node.y + LABEL_GAP + DOT_R;
}

export function CodexAgentReactCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 90), 50);
    return () => clearInterval(timer);
  }, []);

  const active = Math.floor(t / 30) % NODES.length;
  const from = NODES[active];
  const to = NODES[(active + 1) % NODES.length];
  const prog = (t % 30) / 30;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800",
        className
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        {mounted && (
          <>
            {/* 三角边 */}
            {NODES.map((node, i) => {
              const next = NODES[(i + 1) % NODES.length];
              const on = i === active;
              return (
                <line
                  key={`edge-${node.label}`}
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={on ? node.color : "#d4d4d8"}
                  strokeWidth={on ? 1.1 : 0.6}
                  opacity={on ? 0.75 : 0.4}
                  strokeLinecap="round"
                />
              );
            })}

            {/* 中心标题 */}
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[5px] font-mono font-semibold"
              fill="#a1a1aa"
            >
              ReAct
            </text>

            {/* 顶点 + 标签 */}
            {NODES.map((node, i) => {
              const on = i === active;
              return (
                <g key={node.label}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={on ? 7 : 5.5}
                    fill={node.color}
                    opacity={on ? 0.18 : 0.1}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={DOT_R}
                    fill={node.color}
                    opacity={on ? 1 : 0.55}
                  />
                  <text
                    x={node.x}
                    y={labelY(node)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[5px] font-sans"
                    fill={on ? "#52525b" : "#a1a1aa"}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* 沿边运动的脉冲点 */}
            <circle
              cx={from.x + (to.x - from.x) * prog}
              cy={from.y + (to.y - from.y) * prog}
              r="2"
              fill={from.color}
              opacity={0.95}
            />
          </>
        )}
      </svg>
    </div>
  );
}
