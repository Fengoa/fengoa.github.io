"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CX = 50;
const CY = 48;
const R = 26;
const DOT_R = 2.8;

function vertex(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

/** Goal → Capability → Experiment → Result 学习环 */
const NODES = [
  {
    ...vertex(-90),
    label: "Goal",
    sub: "目标",
    color: "#0d9488",
    labelSide: "top" as const,
  },
  {
    ...vertex(0),
    label: "Capability",
    sub: "能力",
    color: "#0284c7",
    labelSide: "right" as const,
  },
  {
    ...vertex(90),
    label: "Experiment",
    sub: "实验",
    color: "#d97706",
    labelSide: "bottom" as const,
  },
  {
    ...vertex(180),
    label: "Result",
    sub: "结果",
    color: "#059669",
    labelSide: "left" as const,
  },
];

function labelPos(node: (typeof NODES)[number]) {
  const gap = 8.5;
  switch (node.labelSide) {
    case "top":
      return { x: node.x, y: node.y - gap - DOT_R, anchor: "middle" as const };
    case "bottom":
      return { x: node.x, y: node.y + gap + DOT_R, anchor: "middle" as const };
    case "left":
      return { x: node.x - gap - DOT_R, y: node.y, anchor: "end" as const };
    case "right":
      return { x: node.x + gap + DOT_R, y: node.y, anchor: "start" as const };
  }
}

function subPos(node: (typeof NODES)[number]) {
  const base = labelPos(node);
  const dy =
    node.labelSide === "top" ? -4.2 : node.labelSide === "bottom" ? 4.2 : 0;
  const dx =
    node.labelSide === "left" ? -0.5 : node.labelSide === "right" ? 0.5 : 0;
  return { x: base.x + dx, y: base.y + dy, anchor: base.anchor };
}

/**
 * AI-native Company 封面：组织基本单位从「员工」换成 Goal×Capability×实验环。
 */
export function AiNativeCompanyCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setT((v) => (v + 1) % 120), 50);
    return () => clearInterval(timer);
  }, []);

  const active = Math.floor(t / 30) % NODES.length;
  const from = NODES[active];
  const to = NODES[(active + 1) % NODES.length];
  const prog = (t % 30) / 30;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        {/* 外环：能力平台边界 */}
        <circle
          cx={CX}
          cy={CY}
          r={R + 7}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="0.4"
          strokeDasharray="1.4 1.8"
          className="dark:stroke-neutral-800"
        />

        {/* 四边：目标→能力→实验→结果 */}
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
              strokeWidth={on ? 1.1 : 0.55}
              opacity={on ? 0.85 : 0.35}
              strokeLinecap="round"
            />
          );
        })}

        {/* 中心：AIOS */}
        <text
          x={CX}
          y={CY - 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-neutral-500 font-mono text-[5px] font-semibold dark:fill-neutral-400"
        >
          AIOS
        </text>
        <text
          x={CX}
          y={CY + 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-neutral-400 font-mono text-[3px] dark:fill-neutral-600"
        >
          Goal × Capability
        </text>

        {/* 节点 */}
        {NODES.map((node, i) => {
          const on = i === active;
          const lp = labelPos(node);
          const sp = subPos(node);
          return (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={on ? 7 : 5.6}
                fill={node.color}
                opacity={on ? 0.16 : 0.08}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={DOT_R}
                fill={node.color}
                opacity={on ? 1 : 0.5}
              />
              <text
                x={lp.x}
                y={lp.y}
                textAnchor={lp.anchor}
                dominantBaseline="central"
                className="font-mono text-[3.8px] font-medium"
                fill={on ? "#3f3f46" : "#a1a1aa"}
              >
                {node.label}
              </text>
              <text
                x={sp.x}
                y={sp.y}
                textAnchor={sp.anchor}
                dominantBaseline="central"
                className="font-sans text-[3px]"
                fill={on ? node.color : "#c4c4c8"}
                opacity={0.95}
              >
                {node.sub}
              </text>
            </g>
          );
        })}

        {/* 沿环脉冲：学习循环在转 */}
        <circle
          cx={from.x + (to.x - from.x) * prog}
          cy={from.y + (to.y - from.y) * prog}
          r="1.9"
          fill={from.color}
          opacity={0.95}
        />

        <text
          x="50"
          y="94"
          textAnchor="middle"
          className="fill-neutral-400 font-mono text-[3.5px] dark:fill-neutral-600"
        >
          AI-native Company
        </text>
      </svg>
    </div>
  );
}
