"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

const LAYERS = [
  {
    id: "goal",
    label: "用户目标层",
    example: "登录网站，下载上月报表，汇总收入",
  },
  {
    id: "plan",
    label: "步骤层",
    example: "导航 → 登录 → 选日期 → 提取 → CLI 聚合",
  },
  {
    id: "tool",
    label: "工具调用层",
    example: "browser_navigate → screenshot → extract → opencli_exec",
  },
];

export function TaskLayers() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % LAYERS.length), 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <VisualFrame title="任务分解三层：目标、计划、工具调用各司其职，不要混在一层里">
      <div className="space-y-2 max-w-xl mx-auto">
        {LAYERS.map((layer, i) => (
          <div key={layer.id}>
            <div
              className={cn(
                "rounded-md border px-4 py-3 transition-all",
                i === idx
                  ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-400/30"
                  : "border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div className="font-mono text-sm mb-1">{layer.label}</div>
              <div className="text-xs text-muted-foreground font-mono leading-relaxed">
                {layer.example}
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="text-center text-xs font-mono text-muted-foreground py-1">↓</div>
            )}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
