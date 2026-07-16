"use client";

import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

const LAYERS = [
  { label: "系统提示", share: 12, note: "行为准则，始终置顶" },
  { label: "环境信息", share: 8, note: "URL、步骤数、工作目录" },
  { label: "工具 Schema", share: 18, note: "完整工具列表" },
  { label: "对话历史", share: 62, note: "token 消耗最大，最易超出容量" },
];

export function ContextLayers() {
  return (
    <VisualFrame title="上下文四类内容：历史最占 token，也最需要裁剪策略">
      <div className="space-y-3 max-w-md mx-auto">
        {LAYERS.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-3 min-w-0">
            <span className="w-[4.5rem] shrink-0 font-mono text-xs text-foreground">
              {layer.label}
            </span>
            <div className="flex-1 min-w-0 h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-colors",
                  i === 3
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : "bg-emerald-500/50 dark:bg-emerald-400/50"
                )}
                style={{ width: `${layer.share}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-xs font-mono text-muted-foreground tabular-nums text-right">
              {layer.share}%
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline truncate min-w-0">
              {layer.note}
            </span>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
