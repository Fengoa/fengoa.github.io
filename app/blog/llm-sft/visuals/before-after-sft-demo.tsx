"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 同一 prompt 在 base 模型 vs SFT 后输出对比
// 自动循环切换 prompt，左右两栏并排展示

const SAMPLES = [
  {
    prompt: "What is 2+2?",
    base: "What is 2+2? What is 3+3? What is the meaning of these arithmetic exercises in elementary education research...",
    sft: "2+2 equals 4.",
  },
  {
    prompt: "用一句话总结《活着》。",
    base: "用一句话总结《活着》。请阅读以下文本并回答问题。题目一：……（继续生成更多题干）",
    sft: "福贵在动荡年代里失去所有亲人，最终孤身一人，与一头老牛相依为命。",
  },
  {
    prompt: "Write a haiku about autumn.",
    base: "Write a haiku about autumn. Write a haiku about winter. Write a haiku about a topic you find inspiring...",
    sft: "Leaves drift to the ground / Cold wind whispers through bare trees / Autumn says goodbye.",
  },
];

export function BeforeAfterSftDemo() {
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTyping((p) => {
        if (p >= 1) {
          return p;
        }
        return Math.min(1, p + 0.04);
      });
    }, 50);
    return () => clearInterval(t);
  }, [idx]);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SAMPLES.length);
      setTyping(0);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const sample = SAMPLES[idx];
  const baseLen = Math.floor(sample.base.length * typing);
  const sftLen = Math.floor(sample.sft.length * typing);

  return (
    <VisualFrame title="同一 prompt：base 模型续写 vs SFT 后回答">
      <div className="space-y-4">
        <div className="rounded border bg-accent/40 px-4 py-3">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            prompt
          </div>
          <div className="text-sm font-mono text-foreground">
            {sample.prompt}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card
            tag="base 模型"
            tone="muted"
            text={sample.base.slice(0, baseLen)}
            note="续写训练分布里的相似句式"
          />
          <Card
            tag="SFT 后"
            tone="primary"
            text={sample.sft.slice(0, sftLen)}
            note="按指令模板停下来回答"
          />
        </div>

        <div className="flex justify-center gap-1.5 pt-1">
          {SAMPLES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIdx(i);
                setTyping(0);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx
                  ? "w-6 bg-emerald-500"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              aria-label={`example ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function Card({
  tag,
  tone,
  text,
  note,
}: {
  tag: string;
  tone: "muted" | "primary";
  text: string;
  note: string;
}) {
  return (
    <div
      className={cn(
        "rounded border px-4 py-3 min-h-35",
        tone === "primary"
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
          : "border-neutral-200 dark:border-neutral-800 bg-stone-50/60 dark:bg-stone-900/30"
      )}
    >
      <div
        className={cn(
          "text-xs font-mono mb-2",
          tone === "primary"
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {tag}
      </div>
      <div
        className={cn(
          "text-sm leading-relaxed font-mono whitespace-pre-wrap wrap-break-word",
          tone === "primary"
            ? "text-foreground"
            : "text-secondary-foreground/80"
        )}
      >
        {text}
        <span className="inline-block w-1 h-3.5 ml-0.5 bg-current opacity-70 align-middle animate-pulse" />
      </div>
      <div className="mt-2 text-xs text-muted-foreground/80 font-mono">
        {note}
      </div>
    </div>
  );
}
