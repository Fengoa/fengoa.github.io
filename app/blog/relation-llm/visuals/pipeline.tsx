"use client";

import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "口语输入", sub: "一句笔记" },
  { label: "LLM 抽取", sub: "三分类" },
  { label: "归一化", sub: "农历 / 实体" },
  { label: "PostgreSQL", sub: "三表 + 向量" },
  { label: "召回", sub: "SQL · CTE · 向量" },
];

function StepBox({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[4.5rem] w-full flex-col items-center justify-center rounded-lg border px-2 py-3 text-center sm:min-h-[5rem] sm:flex-1",
        "border-neutral-200 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-900/50"
      )}
    >
      <span className="text-sm font-medium leading-tight">{label}</span>
      <span className="mt-1 font-mono text-xs text-muted-foreground">{sub}</span>
    </div>
  );
}

export function MemoryPipeline() {
  return (
    <figure className="my-8 not-prose">
      <div
        data-no-zoom
        className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:p-5"
      >
        <div className="hidden sm:flex sm:items-center sm:gap-1">
          {STEPS.map((step, i) => (
            <Fragment key={step.label}>
              <StepBox {...step} />
              {i < STEPS.length - 1 && (
                <div className="flex shrink-0 text-muted-foreground/45" aria-hidden>
                  <ChevronRight className="size-4 sm:size-5" strokeWidth={2} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="flex flex-col sm:hidden">
          {STEPS.map((step, i) => (
            <Fragment key={step.label}>
              <StepBox {...step} />
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-0.5 text-muted-foreground/45" aria-hidden>
                  <ChevronDown className="size-4" strokeWidth={2} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-center font-mono text-xs text-muted-foreground">
        非结构化输入 → 抽取与归一化 → 结构化存储与召回
      </figcaption>
    </figure>
  );
}
