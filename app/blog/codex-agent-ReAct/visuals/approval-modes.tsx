"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { VisualFrame } from "./frame";

const MODES = [
  {
    id: "suggest",
    label: "Suggest",
    zh: "建议模式",
    trust: 20,
    desc: "只出建议，用户逐条确认",
  },
  {
    id: "auto",
    label: "Auto-edit",
    zh: "选择性自动",
    trust: 60,
    desc: "读/截图自动，写/执行需确认",
  },
  {
    id: "full",
    label: "Full-auto",
    zh: "全自动沙箱",
    trust: 90,
    desc: "信任边界，不信任每个决策",
  },
];

export function ApprovalModes() {
  const [active, setActive] = useState("auto");

  const current = MODES.find((m) => m.id === active)!;

  return (
    <VisualFrame title="Approval：信任随场景递进，不可逆操作永远要人工确认">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex sm:flex-col gap-2 sm:w-40">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(m.id)}
              className={cn(
                "text-left px-3 py-2 rounded-md border font-mono text-xs transition-colors",
                active === m.id
                  ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-foreground"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex-1 rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="font-mono text-sm mb-1">{current.zh}</div>
          <div className="text-xs text-muted-foreground mb-4">{current.desc}</div>
          <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
              style={{ width: `${current.trust}%` }}
            />
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-2 tabular-nums">
            自动化程度 {current.trust}%
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
