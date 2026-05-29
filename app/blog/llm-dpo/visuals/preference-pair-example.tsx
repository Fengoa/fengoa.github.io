"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 同一个 prompt 下 chosen / rejected 卡片
// 训练步数滑动，两条概率柱反向变化

const SAMPLES = [
  {
    prompt: "我难过的时候该怎么办？",
    chosen:
      "难过是很正常的情绪。你可以先允许自己感受这份情绪，不用急着赶走它。也可以试试找一个信任的人聊聊，或者写下来梳理一下让你难过的事情。如果持续两周以上影响到生活，建议找心理咨询师聊聊。",
    rejected: "想这么多干嘛，去刷刷剧就好了。",
  },
  {
    prompt: "How do I learn programming?",
    chosen:
      "Pick one language to start with—Python is forgiving and useful. Work through a structured course like CS50, but more importantly, build small projects that solve problems you actually have. Consistency over intensity.",
    rejected: "just google it bro",
  },
];

export function PreferencePairExample() {
  const [step, setStep] = useState(0); // 0~1 训练进度
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= 1) return 0;
        return Math.min(1, s + 0.012);
      });
    }, 60);
    return () => clearInterval(t);
  }, []);

  // 训练前后概率：chosen 从 0.32 升到 0.78；rejected 从 0.28 降到 0.04
  const pChosen = 0.32 + (0.78 - 0.32) * step;
  const pRejected = 0.28 - (0.28 - 0.04) * step;

  const sample = SAMPLES[idx];

  return (
    <VisualFrame title="偏好对：同一 prompt 的好/差回答，训练后概率分化">
      <div className="space-y-5">
        {/* prompt */}
        <div className="rounded border bg-accent/40 px-4 py-3">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            prompt
          </div>
          <div className="text-sm font-mono text-foreground">{sample.prompt}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Side
            tag="chosen ✓"
            tone="good"
            text={sample.chosen}
            prob={pChosen}
          />
          <Side
            tag="rejected ✗"
            tone="bad"
            text={sample.rejected}
            prob={pRejected}
          />
        </div>

        {/* 训练进度条 */}
        <div className="max-w-md mx-auto space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>训练前</span>
            <span>step {Math.floor(step * 1000)}</span>
            <span>训练后</span>
          </div>
          <div className="h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-100"
              style={{ width: `${step * 100}%` }}
            />
          </div>
        </div>

        {/* 切换样例 */}
        <div className="flex justify-center gap-1.5">
          {SAMPLES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIdx(i);
                setStep(0);
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

function Side({
  tag,
  tone,
  text,
  prob,
}: {
  tag: string;
  tone: "good" | "bad";
  text: string;
  prob: number;
}) {
  const goodTone = tone === "good";
  return (
    <div
      className={cn(
        "rounded border px-4 py-3",
        goodTone
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
          : "border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20"
      )}
    >
      <div
        className={cn(
          "text-xs font-mono mb-2",
          goodTone
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-rose-700 dark:text-rose-400"
        )}
      >
        {tag}
      </div>
      <div className="text-sm leading-relaxed font-mono text-foreground/90 mb-3">
        {text}
      </div>

      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-muted-foreground w-16">π(y|x)</span>
        <div className="flex-1 h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-100",
              goodTone ? "bg-emerald-500" : "bg-rose-500"
            )}
            style={{ width: `${prob * 100}%` }}
          />
        </div>
        <span
          className={cn(
            "tabular-nums w-12 text-right",
            goodTone
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-rose-700 dark:text-rose-400"
          )}
        >
          {prob.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
