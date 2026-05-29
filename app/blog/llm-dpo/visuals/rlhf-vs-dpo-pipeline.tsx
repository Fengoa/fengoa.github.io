"use client";

import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// RLHF 4 模型 pipeline vs DPO 2 模型 pipeline
// 标显存占用对比

export function RlhfVsDpoPipeline() {
  return (
    <VisualFrame title="RLHF 需要 4 个模型同时在显存里，DPO 只要 2 个">
      <div className="space-y-6">
        <Row
          title="RLHF (PPO)"
          tone="muted"
          boxes={[
            { label: "Policy", note: "在训练" },
            { label: "Reference", note: "冻结" },
            { label: "Reward", note: "冻结" },
            { label: "Value", note: "在训练" },
          ]}
          totalNote="≈ 4× 模型显存：70B 模型约 560GB"
        />

        <Divider />

        <Row
          title="DPO"
          tone="primary"
          boxes={[
            { label: "Policy", note: "在训练" },
            { label: "Reference", note: "冻结" },
          ]}
          totalNote="≈ 2× 模型显存：70B 模型约 280GB"
        />

        <p className="text-xs text-muted-foreground/80 font-mono text-center">
          RLHF 还要在训练循环里在线采样 rollouts，DPO 直接吃静态偏好对
        </p>
      </div>
    </VisualFrame>
  );
}

function Row({
  title,
  tone,
  boxes,
  totalNote,
}: {
  title: string;
  tone: "muted" | "primary";
  boxes: { label: string; note: string }[];
  totalNote: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "text-xs font-mono font-medium",
            tone === "primary"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          )}
        >
          {title}
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className="text-xs font-mono text-muted-foreground/80">
          {totalNote}
        </div>
      </div>

      <div className="flex items-stretch gap-2 flex-wrap">
        {boxes.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded border px-3 py-2 min-w-[88px] text-center",
                tone === "primary"
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30"
                  : "border-neutral-300 dark:border-neutral-700 bg-stone-50/60 dark:bg-stone-900/40"
              )}
            >
              <div className="text-xs font-mono font-medium text-foreground">
                {b.label}
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                {b.note}
              </div>
            </div>
            {i < boxes.length - 1 && (
              <span className="text-xs text-muted-foreground/50">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60 uppercase">
      <div className="flex-1 h-px bg-border" />
      <span>简化为</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
