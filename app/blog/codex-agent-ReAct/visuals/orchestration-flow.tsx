"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

const PATHS = [
  { id: "browser", label: "Browser Engine", items: ["navigate", "screenshot", "extract"] },
  { id: "cli", label: "OpenCLI Engine", items: ["exec", "pipe", "transform"] },
];

export function OrchestrationFlow() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPulse((p) => (p + 1) % 3), 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <VisualFrame title="Browser + OpenCLI：Task Planner 分解目标，Shared State 承接中间数据">
      <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
        <div className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-2.5 text-center">
          <div className="font-mono text-sm">Task Planner</div>
          <div className="text-xs text-muted-foreground mt-0.5">目标分解 → 步骤队列</div>
        </div>

        <div className="flex items-center gap-3 w-full text-xs font-mono text-muted-foreground">
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span>browser ops</span>
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span>cli ops</span>
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {PATHS.map((path) => (
            <div
              key={path.id}
              className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3"
            >
              <div className="font-mono text-sm mb-2">{path.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {path.items.map((item, i) => (
                  <span
                    key={item}
                    className={cn(
                      "px-2 py-0.5 rounded border text-xs font-mono transition-colors",
                      pulse === i
                        ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                        : "border-neutral-200 dark:border-neutral-800"
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full rounded-md border border-emerald-300/60 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2.5 text-center">
          <div className="font-mono text-sm">Shared Task State</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">
            cookies · page_data · extracted_data · checkpoints
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
