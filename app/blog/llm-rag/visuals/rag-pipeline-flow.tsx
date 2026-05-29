"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

const STEPS = [
  {
    key: "query",
    title: "用户提问",
    desc: "原始自然语言",
    payload: `LLaMA 3 有什么新特性？`,
    color: "#0ea5e9",
  },
  {
    key: "embed",
    title: "Embedding",
    desc: "把文本变成向量",
    payload: `[0.012, -0.34, 0.78, …, 0.02]
1024 维稠密向量`,
    color: "#8b5cf6",
  },
  {
    key: "retrieve",
    title: "检索",
    desc: "找最相似的 k 条",
    payload: `top-3 chunks (sim ↓):
• "LLaMA 3 用 GQA 和更大词表…"  0.91
• "在 15T tokens 上训练…"        0.87
• "上下文长度扩展到 8K…"         0.83`,
    color: "#10b981",
  },
  {
    key: "augment",
    title: "拼接 prompt",
    desc: "原问题 + 检索内容",
    payload: `根据以下信息回答：
[1] LLaMA 3 用 GQA 和更大词表…
[2] 在 15T tokens 上训练…
[3] 上下文长度扩展到 8K…

问题：LLaMA 3 有什么新特性？`,
    color: "#f59e0b",
  },
  {
    key: "generate",
    title: "生成回答",
    desc: "模型基于 context 作答",
    payload: `LLaMA 3 在三个方面做了升级：
1. 注意力换成 GQA，KV 显存更省
2. 训练数据扩大到 15T tokens
3. 上下文长度从 4K 提到 8K`,
    color: "#ec4899",
  },
];

export function RagPipelineFlow() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [auto]);

  return (
    <VisualFrame title="RAG 完整流程：点击任意一步查看中间产物">
      <div className="space-y-4">
        {/* 流程图 */}
        <div className="flex items-stretch gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const isActive = i === active;
            return (
              <div key={s.key} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAuto(false);
                    setActive(i);
                  }}
                  className={cn(
                    "px-3 py-2 rounded border text-left transition-all min-w-28",
                    isActive
                      ? "shadow-sm scale-[1.02]"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 opacity-60 hover:opacity-100"
                  )}
                  style={
                    isActive
                      ? {
                          borderColor: s.color,
                          backgroundColor: s.color + "12",
                        }
                      : {}
                  }
                >
                  <div
                    className="text-xs font-mono"
                    style={{ color: isActive ? s.color : undefined }}
                  >
                    step {i + 1}
                  </div>
                  <div
                    className="text-sm font-medium leading-tight mt-0.5"
                    style={{ color: isActive ? s.color : undefined }}
                  >
                    {s.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.desc}
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="px-1 text-muted-foreground/60">→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 当前步骤的中间产物 */}
        <div
          className="rounded-lg border-2 p-4 transition-colors"
          style={{
            borderColor: STEPS[active].color + "55",
            backgroundColor: STEPS[active].color + "08",
          }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: STEPS[active].color }}>
            {STEPS[active].title} 的输出
          </div>
          <AnimatePresence mode="wait">
            <motion.pre
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-xs whitespace-pre-wrap text-foreground leading-relaxed"
            >
              {STEPS[active].payload}
            </motion.pre>
          </AnimatePresence>
        </div>

        <div className="text-xs font-mono text-muted-foreground text-center">
          {auto ? "自动播放中" : "点击任意步骤切换"} ·{" "}
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {auto ? "暂停" : "继续"}
          </button>
        </div>
      </div>
    </VisualFrame>
  );
}
