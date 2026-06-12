"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { VisualFrame } from "./frame";

const MODES = [
  {
    id: "coarse",
    label: "粒度过粗",
    example: "browser_do_everything",
    issue: "自然语言描述具体操作，歧义大",
  },
  {
    id: "fine",
    label: "粒度过细",
    example: "click_by_css / text / xy",
    issue: "调用前就要选定定位方式",
  },
  {
    id: "intent",
    label: "Codex",
    example: "browser_click",
    issue: "表达意图，执行层按优先级尝试",
  },
];

export function ToolGranularity() {
  const [active, setActive] = useState("intent");

  return (
    <VisualFrame title="工具粒度：以「用户意图」为边界，而不是「技术动作」">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(m.id)}
            className={cn(
              "text-left rounded-md border p-3 transition-all",
              active === m.id
                ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-400/20"
                : "border-neutral-200 dark:border-neutral-800"
            )}
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">{m.label}</div>
            <div className="font-mono text-sm mb-2">{m.example}</div>
            <div className="text-xs text-secondary-foreground leading-relaxed">{m.issue}</div>
          </button>
        ))}
      </div>
    </VisualFrame>
  );
}
