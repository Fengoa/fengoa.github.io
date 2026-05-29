"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 三种 chat template side-by-side
// 分段着色：system / user / assistant / 控制 token

type Seg = { kind: "ctrl" | "user" | "assistant" | "system" | "plain"; text: string };

const TEMPLATES: { name: string; segs: Seg[] }[] = [
  {
    name: "Alpaca",
    segs: [
      { kind: "ctrl", text: "### Instruction:\n" },
      { kind: "user", text: "What is the capital of France?" },
      { kind: "ctrl", text: "\n\n### Response:\n" },
      { kind: "assistant", text: "The capital of France is Paris." },
    ],
  },
  {
    name: "ChatML",
    segs: [
      { kind: "ctrl", text: "<|im_start|>system\n" },
      { kind: "system", text: "You are a helpful assistant." },
      { kind: "ctrl", text: "<|im_end|>\n<|im_start|>user\n" },
      { kind: "user", text: "What is the capital of France?" },
      { kind: "ctrl", text: "<|im_end|>\n<|im_start|>assistant\n" },
      { kind: "assistant", text: "The capital of France is Paris." },
      { kind: "ctrl", text: "<|im_end|>" },
    ],
  },
  {
    name: "LLaMA-2 Chat",
    segs: [
      { kind: "ctrl", text: "<s>[INST] <<SYS>>\n" },
      { kind: "system", text: "You are a helpful assistant." },
      { kind: "ctrl", text: "\n<</SYS>>\n\n" },
      { kind: "user", text: "What is the capital of France?" },
      { kind: "ctrl", text: " [/INST] " },
      { kind: "assistant", text: "The capital of France is Paris." },
      { kind: "ctrl", text: " </s>" },
    ],
  },
];

const TONE: Record<Seg["kind"], string> = {
  ctrl: "text-rose-600 dark:text-rose-400",
  user: "text-sky-700 dark:text-sky-400 bg-sky-50/60 dark:bg-sky-950/30 px-1 rounded",
  assistant:
    "text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 px-1 rounded",
  system:
    "text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 px-1 rounded",
  plain: "text-foreground",
};

export function ChatTemplateComparator() {
  const [showRaw, setShowRaw] = useState(true);

  return (
    <VisualFrame title="三种 Chat Template：标记控制 token vs 实际内容">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
          <Legend dot="bg-rose-500" label="控制 token" />
          <Legend dot="bg-amber-500" label="system" />
          <Legend dot="bg-sky-500" label="user" />
          <Legend dot="bg-emerald-500" label="assistant" />
          <button
            type="button"
            onClick={() => setShowRaw((s) => !s)}
            className="ml-auto rounded border px-2 py-1 text-[11px] hover:bg-accent"
          >
            {showRaw ? "隐藏控制 token" : "显示控制 token"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="rounded border border-neutral-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-stone-900/30 p-3"
            >
              <div className="text-xs font-mono text-foreground font-medium mb-2">
                {t.name}
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap wrap-break-word leading-relaxed">
                {t.segs.map((seg, i) => {
                  if (!showRaw && seg.kind === "ctrl") {
                    // 折叠控制 token 为分隔条
                    return (
                      <span
                        key={i}
                        className="inline-block w-full my-1 border-t border-dashed border-rose-300 dark:border-rose-800"
                      />
                    );
                  }
                  return (
                    <span key={i} className={cn(TONE[seg.kind])}>
                      {seg.text}
                    </span>
                  );
                })}
              </pre>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/80 font-mono text-center">
          训练和推理必须用同一份模板，否则模型不知道何时该「停下来回答」
        </p>
      </div>
    </VisualFrame>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-sm", dot)} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
