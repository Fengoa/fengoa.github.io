"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

const CHANNELS = [
  {
    id: "visual",
    label: "视觉编码",
    sub: "screenshot",
    pros: "布局完整，适合确认状态",
    cons: "token 贵",
  },
  {
    id: "struct",
    label: "结构编码",
    sub: "DOM / JSON",
    pros: "数据精确，适合提取表格",
    cons: "丢失视觉关系",
  },
  {
    id: "text",
    label: "文本编码",
    sub: "stdout / logs",
    pros: "轻量，适合 CLI",
    cons: "只有文字信息",
  },
];

export function ObservationEncoding() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % CHANNELS.length), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <VisualFrame title="Observation 三种编码互补：先截图确认，再 DOM 提取精确数据">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHANNELS.map((ch, i) => {
          const on = i === idx;
          return (
            <div
              key={ch.id}
              className={cn(
                "rounded-md border p-3 transition-all",
                on
                  ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-400/30"
                  : "border-neutral-200 dark:border-neutral-800 opacity-70"
              )}
            >
              <div className="font-mono text-sm mb-0.5">{ch.label}</div>
              <div className="text-xs font-mono text-muted-foreground mb-2">{ch.sub}</div>
              <div className="text-xs text-secondary-foreground">✓ {ch.pros}</div>
              <div className="text-xs text-muted-foreground mt-1">△ {ch.cons}</div>
            </div>
          );
        })}
      </div>
    </VisualFrame>
  );
}
