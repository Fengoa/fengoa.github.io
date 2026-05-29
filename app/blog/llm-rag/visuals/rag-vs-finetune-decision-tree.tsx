"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

type NodeId =
  | "start"
  | "knowledge"
  | "behavior"
  | "rag"
  | "finetune"
  | "both"
  | "prompt";

type DecisionNode = {
  id: NodeId;
  type: "question" | "leaf";
  text: string;
  hint?: string;
  yes?: NodeId;
  no?: NodeId;
  yesLabel?: string;
  noLabel?: string;
  // 对叶子节点
  verdict?: "rag" | "finetune" | "both" | "prompt";
};

const TREE: Record<NodeId, DecisionNode> = {
  start: {
    id: "start",
    type: "question",
    text: "需要的是模型不知道的信息吗？",
    hint: "比如最新事件、内部文档、私域数据",
    yes: "knowledge",
    no: "behavior",
    yesLabel: "是",
    noLabel: "否",
  },
  knowledge: {
    id: "knowledge",
    type: "question",
    text: "信息会经常变吗？",
    hint: "每天 / 每周更新一次以上",
    yes: "rag",
    no: "both",
    yesLabel: "经常变",
    noLabel: "几乎不变",
  },
  behavior: {
    id: "behavior",
    type: "question",
    text: "需要改变模型的输出风格或能力吗？",
    hint: "比如让它说话更礼貌、学会用某种格式",
    yes: "finetune",
    no: "prompt",
    yesLabel: "是",
    noLabel: "否",
  },
  rag: {
    id: "rag",
    type: "leaf",
    text: "用 RAG",
    verdict: "rag",
  },
  finetune: {
    id: "finetune",
    type: "leaf",
    text: "做微调（SFT 或 LoRA）",
    verdict: "finetune",
  },
  both: {
    id: "both",
    type: "leaf",
    text: "RAG 起步，量级大了再考虑微调",
    verdict: "both",
  },
  prompt: {
    id: "prompt",
    type: "leaf",
    text: "调整 prompt 就够了",
    verdict: "prompt",
  },
};

const VERDICT_DESC: Record<string, { color: string; reason: string }> = {
  rag: {
    color: "#10b981",
    reason: "外部知识库改文档即可同步，模型不动",
  },
  finetune: {
    color: "#8b5cf6",
    reason: "改变模型行为，数据准备 + 训练成本高但效果稳",
  },
  both: {
    color: "#f59e0b",
    reason: "数据稳定时微调能更准，但前期 RAG 见效快",
  },
  prompt: {
    color: "#0ea5e9",
    reason: "可能只是没把要求说清楚，先优化 system prompt",
  },
};

export function RagVsFinetuneDecisionTree() {
  const [path, setPath] = useState<NodeId[]>(["start"]);
  const current = TREE[path[path.length - 1]];

  function answer(yes: boolean) {
    if (current.type !== "question") return;
    const next = yes ? current.yes! : current.no!;
    setPath([...path, next]);
  }

  function reset() {
    setPath(["start"]);
  }

  return (
    <VisualFrame title="决定该用 RAG 还是微调，先问自己几个问题">
      <div className="space-y-4">
        {/* 路径面包屑 */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          {path.map((id, i) => {
            const n = TREE[id];
            const isLast = i === path.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded border",
                    isLast
                      ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                      : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
                  )}
                >
                  {n.type === "leaf" ? n.text : `Q${i + 1}`}
                </span>
                {!isLast && <span className="text-muted-foreground">→</span>}
              </span>
            );
          })}
          {path.length > 1 && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              重新选
            </button>
          )}
        </div>

        {current.type === "question" ? (
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 p-4">
            <div className="text-base font-medium mb-1">{current.text}</div>
            {current.hint && (
              <div className="text-xs text-muted-foreground mb-3">{current.hint}</div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => answer(true)}
                className="px-3 py-1.5 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm font-mono hover:scale-[1.02] transition-transform"
              >
                {current.yesLabel}
              </button>
              <button
                type="button"
                onClick={() => answer(false)}
                className="px-3 py-1.5 rounded border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm font-mono hover:scale-[1.02] transition-transform"
              >
                {current.noLabel}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg border-2 p-5"
            style={{
              borderColor: VERDICT_DESC[current.verdict!].color + "88",
              backgroundColor: VERDICT_DESC[current.verdict!].color + "10",
            }}
          >
            <div className="text-[11px] font-mono mb-1" style={{ color: VERDICT_DESC[current.verdict!].color }}>
              建议
            </div>
            <div className="text-lg font-semibold mb-2">{current.text}</div>
            <div className="text-sm text-secondary-foreground">
              {VERDICT_DESC[current.verdict!].reason}
            </div>
          </div>
        )}
      </div>
    </VisualFrame>
  );
}
