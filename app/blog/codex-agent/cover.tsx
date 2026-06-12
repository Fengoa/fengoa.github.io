"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/** ReAct 循环：Think → Act → Observe */
const LOOP_NODES = [
  { x: 50, y: 16, label: "Think", color: "#818cf8" },
  { x: 18, y: 72, label: "Act", color: "#34d399" },
  { x: 82, y: 72, label: "Obs", color: "#fbbf24" },
] as const;

export function CodexAgentCover({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setT((v) => (v + 1) % 90), 50);
    return () => clearInterval(timer);
  }, []);

  const activeEdge = Math.floor(t / 30) % LOOP_NODES.length;
  const from = LOOP_NODES[activeEdge];
  const to = LOOP_NODES[(activeEdge + 1) % LOOP_NODES.length];
  const prog = (t % 30) / 30;
  const pulseX = from.x + (to.x - from.x) * prog;
  const pulseY = from.y + (to.y - from.y) * prog;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "bg-[#0c0c0f] dark:bg-[#050507]",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(90deg,#27272a_1px,transparent_1px),linear-gradient(#27272a_1px,transparent_1px)] bg-size-[10px_10px]" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {mounted && (
          <>
            {LOOP_NODES.map((node, i) => {
              const next = LOOP_NODES[(i + 1) % LOOP_NODES.length];
              const isActive = i === activeEdge;
              return (
                <line
                  key={i}
                  x1={node.x}
                  y1={node.y + (i === 0 ? 5 : 0)}
                  x2={next.x}
                  y2={next.y - (next.label === "Think" ? 5 : 0)}
                  stroke={isActive ? node.color : "#3f3f46"}
                  strokeWidth={isActive ? 1.1 : 0.5}
                  opacity={isActive ? 0.85 : 0.35}
                  strokeDasharray={isActive ? "none" : "2 2"}
                />
              );
            })}

            <rect
              x="36"
              y="40"
              width="28"
              height="18"
              rx="2.5"
              fill="#18181b"
              stroke="#52525b"
              strokeWidth="0.5"
            />
            <text
              x="50"
              y="47.5"
              textAnchor="middle"
              className="text-[3.5px] font-mono font-semibold"
              fill="#a1a1aa"
            >
              LLM
            </text>
            <text
              x="50"
              y="54"
              textAnchor="middle"
              className="text-[3px] font-mono"
              fill="#52525b"
            >
              + Tools
            </text>

            {LOOP_NODES.map((node, i) => {
              const isActive = i === activeEdge || i === (activeEdge + 1) % LOOP_NODES.length;
              const labelY = i === 0 ? node.y - 9 : node.y + 11;
              return (
                <g key={node.label}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 7.5 : 5.5}
                    fill={node.color}
                    opacity={isActive ? 0.2 : 0.08}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="3.2"
                    fill={node.color}
                    opacity={isActive ? 1 : 0.55}
                  />
                  <text
                    x={node.x}
                    y={labelY}
                    textAnchor="middle"
                    className="text-[3.5px] font-mono"
                    fill={isActive ? "#a1a1aa" : "#52525b"}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            <circle cx={pulseX} cy={pulseY} r="2" fill={from.color} opacity={0.95} />

            <text
              x="50"
              y="92"
              textAnchor="middle"
              className="text-[4px] font-mono"
              fill="#52525b"
              opacity="0.7"
            >
              ReAct loop
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
