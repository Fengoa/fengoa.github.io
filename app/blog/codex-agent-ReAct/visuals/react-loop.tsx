"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

const STEPS = [
  { id: "think", label: "推理", sub: "Thought" },
  { id: "act", label: "行动", sub: "Action" },
  { id: "obs", label: "观测", sub: "Observation" },
];

export function ReactLoop() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % STEPS.length), 2200);
    return () => clearInterval(timer);
  }, []);

  const active = STEPS[idx];
  const next = STEPS[(idx + 1) % STEPS.length];

  return (
    <VisualFrame title="ReAct：小决策 → 小行动 → 小观测，循环直到任务收敛">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {STEPS.map((step, i) => {
            const on = i === idx;
            return (
              <div key={step.id} className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  animate={{ scale: on ? 1.03 : 1 }}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[5.5rem] px-3 py-2.5 rounded-md border font-mono transition-colors",
                    on
                      ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
                      : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
                  )}
                >
                  <span className="text-sm font-medium">{step.label}</span>
                  <span className="text-xs opacity-70">{step.sub}</span>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <span className="text-muted-foreground/50 font-mono text-xs hidden sm:inline">
                    →
                  </span>
                )}
              </div>
            );
          })}
          <span className="text-muted-foreground/50 font-mono text-xs">↻</span>
        </div>

        <div className="w-full max-w-lg rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-3 text-xs font-mono text-muted-foreground text-center">
          当前阶段：<span className="text-foreground">{active.label}</span>
          <span className="mx-2 opacity-40">·</span>
          下一步进入 <span className="text-foreground">{next.label}</span>
        </div>
      </div>
    </VisualFrame>
  );
}
