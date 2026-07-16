"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CX = 50;
const CY = 52;
const R = 24;
const DOT_R = 2.8;

function vertex(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

/** 顶：人；左下：关系边；右下：事实 */
const NODES = [
  {
    ...vertex(-90),
    label: "老高",
    sub: "entity",
    color: "#059669",
    labelSide: "top" as const,
  },
  {
    ...vertex(150),
    label: "小张",
    sub: "介绍来",
    color: "#0ea5e9",
    labelSide: "bottom" as const,
  },
  {
    ...vertex(30),
    label: "生日",
    sub: "农历·六·八",
    color: "#d97706",
    labelSide: "bottom" as const,
  },
];

function labelY(node: (typeof NODES)[number], offset = 8) {
  return node.labelSide === "top"
    ? node.y - offset - DOT_R
    : node.y + offset + DOT_R;
}

export function RelationLLMCover({ className }: { className?: string }) {
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
        "border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        {mounted && (
          <>
            {/* 淡底环：记忆边界 */}
            <circle
              cx={CX}
              cy={CY}
              r={R + 6}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="0.4"
              strokeDasharray="1.2 1.6"
              className="dark:stroke-neutral-800"
            />

            {/* 三角边：口语 → 结构化边 */}
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
                  strokeWidth={on ? 1.05 : 0.55}
                  opacity={on ? 0.8 : 0.35}
                  strokeLinecap="round"
                />
              );
            })}

            {/* 中心：抽取标记 */}
            <text
              x={CX}
              y={CY - 1.5}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-neutral-400 font-mono text-[4.5px] font-semibold dark:fill-neutral-500"
            >
              extract
            </text>
            <text
              x={CX}
              y={CY + 4.5}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-neutral-300 font-mono text-[3.2px] dark:fill-neutral-600"
            >
              口语 → 结构
            </text>

            {/* 节点 */}
            {NODES.map((node, i) => {
              const on = i === active;
              return (
                <g key={node.label}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={on ? 7.2 : 5.8}
                    fill={node.color}
                    opacity={on ? 0.16 : 0.08}
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
                    y={labelY(node, 7.5)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-sans text-[4.5px]"
                    fill={on ? "#3f3f46" : "#a1a1aa"}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={labelY(node, 12.2)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-mono text-[3px]"
                    fill={on ? node.color : "#c4c4c8"}
                    opacity={0.9}
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}

            {/* 沿边脉冲：信息写入 */}
            <circle
              cx={from.x + (to.x - from.x) * prog}
              cy={from.y + (to.y - from.y) * prog}
              r="1.8"
              fill={from.color}
              opacity={0.95}
            />
          </>
        )}
      </svg>
    </div>
  );
}
