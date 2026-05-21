"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const stages = [
  { name: "全量物品", count: "3706 部", color: "border-neutral-500" },
  { name: "召回", count: "120 部", detail: "热门 / 类型 / ItemCF", color: "border-cyan-500" },
  { name: "合并去重", count: "50 部", color: "border-violet-500" },
  { name: "精排", count: "20 部", color: "border-green-500" },
];

export function RecommenderPipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="my-10 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center gap-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={cn(
                "flex-1 rounded-md border px-3 py-3 transition-all duration-500",
                i === active
                  ? `${stage.color} bg-neutral-100 dark:bg-neutral-900`
                  : "border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium transition-colors duration-500",
                  i === active ? "text-foreground" : "text-neutral-500"
                )}
              >
                {stage.name}
              </div>
              <div
                className={cn(
                  "text-xs mt-0.5 font-mono transition-colors duration-500",
                  i === active ? "text-foreground" : "text-neutral-500"
                )}
              >
                {stage.count}
              </div>
              {stage.detail && (
                <div className="text-[10px] mt-1 text-neutral-500">
                  {stage.detail}
                </div>
              )}
            </div>
            {i < stages.length - 1 && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={cn(
                  "shrink-0 transition-colors duration-500",
                  i === active ? "text-foreground" : "text-neutral-400 dark:text-neutral-700"
                )}
              >
                <path
                  d="M3 8h8m0 0L8 5m3 3L8 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-full rounded-md border px-3 py-3 transition-all duration-500",
                i === active
                  ? `${stage.color} bg-neutral-100 dark:bg-neutral-900`
                  : "border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div className="flex justify-between items-baseline">
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-500",
                    i === active ? "text-foreground" : "text-neutral-500"
                  )}
                >
                  {stage.name}
                </span>
                <span
                  className={cn(
                    "text-xs font-mono transition-colors duration-500",
                    i === active ? "text-foreground" : "text-neutral-500"
                  )}
                >
                  {stage.count}
                </span>
              </div>
              {stage.detail && (
                <div className="text-[10px] mt-1 text-neutral-500">
                  {stage.detail}
                </div>
              )}
            </div>
            {i < stages.length - 1 && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="text-neutral-400 dark:text-neutral-700"
              >
                <path
                  d="M8 3v8m0 0l-3-3m3 3l3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
