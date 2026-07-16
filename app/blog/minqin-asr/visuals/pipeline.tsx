"use client";

import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "原始素材", sub: "音视频", color: "border-sky-300/60 bg-sky-50/70 dark:border-sky-800/50 dark:bg-sky-950/40" },
  { label: "标注", sub: "txt + srt", color: "border-violet-300/60 bg-violet-50/70 dark:border-violet-800/50 dark:bg-violet-950/40" },
  { label: "Demucs", sub: "人声 wav", color: "border-emerald-300/60 bg-emerald-50/70 dark:border-emerald-800/50 dark:bg-emerald-950/40" },
  { label: "切分", sub: "≤30s 段", color: "border-amber-300/60 bg-amber-50/70 dark:border-amber-800/50 dark:bg-amber-950/40" },
  { label: "Whisper", sub: "微调", color: "border-rose-300/60 bg-rose-50/70 dark:border-rose-800/50 dark:bg-rose-950/40" },
];

function StepBox({ label, sub, color }: (typeof STEPS)[number]) {
  return (
    <div
      className={cn(
        "flex min-h-[4.5rem] w-full flex-col items-center justify-center rounded-lg border px-2 py-3 text-center sm:min-h-[5rem] sm:flex-1",
        color
      )}
    >
      <span className="text-sm font-medium leading-tight">{label}</span>
      <span className="mt-1 font-mono text-[11px] text-muted-foreground">{sub}</span>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-muted-foreground/45",
        className
      )}
      aria-hidden
    >
      <ChevronRight className="size-4 sm:size-5" strokeWidth={2} />
    </div>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center py-0.5 text-muted-foreground/45",
        className
      )}
      aria-hidden
    >
      <ChevronDown className="size-4" strokeWidth={2} />
    </div>
  );
}

export function DataPipeline() {
  return (
    <figure className="my-8 not-prose">
      <div
        data-no-zoom
        className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60 sm:p-5"
      >
        {/* 桌面：单行横排，箭头在节点之间 */}
        <div className="hidden sm:flex sm:items-center sm:gap-1">
          {STEPS.map((step, i) => (
            <Fragment key={step.label}>
              <StepBox {...step} />
              {i < STEPS.length - 1 && <Arrow />}
            </Fragment>
          ))}
        </div>

        {/* 移动：纵向堆叠，箭头居中 */}
        <div className="flex flex-col sm:hidden">
          {STEPS.map((step, i) => (
            <Fragment key={step.label}>
              <StepBox {...step} />
              {i < STEPS.length - 1 && <ArrowDown />}
            </Fragment>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-center font-mono text-xs text-muted-foreground">
        数据工程 → 切分对齐 → Whisper 微调
      </figcaption>
    </figure>
  );
}
