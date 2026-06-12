"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

const EVENTS = [
  { label: "文字开始流出", detail: "「我需要先截图查看当前页面状态...」" },
  { label: "检测到 tool_call", detail: "UI 显示「正在截图...」" },
  { label: "参数流式积累", detail: "JSON 片段拼接中，尚不可执行" },
  { label: "参数完整", detail: "真正调用截图工具" },
  { label: "返回 Observation", detail: "进入下一轮 Loop" },
];

export function StreamingTimeline() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % EVENTS.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <VisualFrame title="流式输出时序：文字实时渲染，tool_call 参数攒齐后才执行">
      <div className="space-y-0 max-w-xl mx-auto">
        {EVENTS.map((ev, i) => {
          const done = i < step;
          const on = i === step;
          return (
            <div key={ev.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: on ? 1.15 : 1 }}
                  className={cn(
                    "size-2.5 rounded-full border-2 shrink-0 mt-1.5",
                    on
                      ? "border-emerald-500 bg-emerald-500"
                      : done
                        ? "border-emerald-400/60 bg-emerald-400/40"
                        : "border-neutral-300 dark:border-neutral-700 bg-transparent"
                  )}
                />
                {i < EVENTS.length - 1 && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-6 my-0.5",
                      done ? "bg-emerald-400/50" : "bg-neutral-200 dark:bg-neutral-800"
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-4", on ? "opacity-100" : done ? "opacity-70" : "opacity-40")}>
                <div className="font-mono text-xs text-foreground">{ev.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ev.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </VisualFrame>
  );
}
