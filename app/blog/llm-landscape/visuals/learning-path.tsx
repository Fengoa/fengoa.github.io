"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

type Stage = "basics" | "arch" | "train" | "align" | "infer" | "summary";

type Post = {
  slug: string;
  no: number;
  title: string;
  short: string;
  stage: Stage;
  /** 网格坐标 */
  col: number;
  row: number;
  deps: string[];
  hint: string;
};

const POSTS: Post[] = [
  { slug: "minimal-llm", no: 1, title: "从零搭建一个语言模型", short: "minimal LLM", stage: "basics", col: 0, row: 1, deps: [], hint: "用 42 万参数搭一个能写莎士比亚的小 GPT，串起整条管线。" },
  { slug: "llm-tokenizer", no: 2, title: "Tokenizer：BPE", short: "tokenizer", stage: "basics", col: 1, row: 1, deps: ["minimal-llm"], hint: "为什么字符级不够用，BPE 怎么把『常见组合』并成一个 token。" },
  { slug: "llm-attention", no: 3, title: "Attention 机制", short: "attention", stage: "arch", col: 2, row: 0, deps: ["minimal-llm"], hint: "Q/K/V 三个角色如何决定每个位置看哪些上下文。" },
  { slug: "llm-transformer", no: 4, title: "完整 Transformer", short: "transformer", stage: "arch", col: 3, row: 0, deps: ["llm-attention"], hint: "把多头、FFN、LayerNorm、残差拼成一个 Block，再堆几层。" },
  { slug: "llm-rope", no: 7, title: "位置编码 RoPE", short: "RoPE", stage: "arch", col: 4, row: 0, deps: ["llm-transformer"], hint: "用旋转矩阵将位置编码进 Attention，支撑长度外推。" },
  { slug: "llm-efficient-attention", no: 8, title: "高效注意力", short: "eff. attn", stage: "arch", col: 5, row: 0, deps: ["llm-rope"], hint: "KV Cache、GQA、Flash Attention 使 Attention 可工程化部署。" },
  { slug: "llm-training", no: 5, title: "训练", short: "training", stage: "train", col: 3, row: 2, deps: ["llm-transformer"], hint: "warmup、cosine decay、weight decay 这些训练技巧到底有没有用。" },
  { slug: "llm-scaling-law", no: 6, title: "Scaling Law", short: "scaling law", stage: "train", col: 4, row: 2, deps: ["llm-training"], hint: "参数、数据、算力按多少比例放最划算。" },
  { slug: "llm-sft", no: 9, title: "SFT 微调", short: "SFT", stage: "align", col: 6, row: 1, deps: ["llm-training"], hint: "用指令数据让 base 模型学会回答问题并终止续写，LoRA 让单卡也能微调。" },
  { slug: "llm-dpo", no: 10, title: "DPO 对齐", short: "DPO", stage: "align", col: 7, row: 1, deps: ["llm-sft"], hint: "把人类偏好直接写成损失函数，绕过 RL 的复杂度。" },
  { slug: "llm-inference", no: 11, title: "推理优化", short: "inference", stage: "infer", col: 6, row: 2, deps: ["llm-efficient-attention"], hint: "量化、投机解码、连续批处理把单次请求的成本压下来。" },
  { slug: "llm-deploy", no: 12, title: "部署上线", short: "deploy", stage: "infer", col: 8, row: 2, deps: ["llm-inference"], hint: "vLLM、API 兼容、自部署 vs 调云 API 的成本拐点在哪。" },
  { slug: "llm-rag", no: 13, title: "RAG", short: "RAG", stage: "infer", col: 8, row: 1, deps: ["llm-deploy", "llm-dpo"], hint: "把私有文档接进来，让模型回答它训练时没见过的内容。" },
  { slug: "llm-landscape", no: 14, title: "全景图", short: "landscape", stage: "summary", col: 9, row: 1, deps: ["llm-rag"], hint: "把前 13 篇放回完整的技术栈里，看清还差什么。" },
];

const STAGE_STYLES: Record<Stage, { bg: string; ring: string; label: string }> = {
  basics: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    ring: "ring-blue-300 dark:ring-blue-800",
    label: "基础",
  },
  arch: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-300 dark:ring-violet-800",
    label: "架构",
  },
  train: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    ring: "ring-emerald-300 dark:ring-emerald-800",
    label: "训练",
  },
  align: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    ring: "ring-amber-300 dark:ring-amber-800",
    label: "对齐",
  },
  infer: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    ring: "ring-rose-300 dark:ring-rose-800",
    label: "推理与应用",
  },
  summary: {
    bg: "bg-neutral-100 dark:bg-neutral-800/60",
    ring: "ring-neutral-400 dark:ring-neutral-600",
    label: "收官",
  },
};

const COLS = 10;
const ROWS = 3;
const CELL_W = 110;
const CELL_H = 78;

export function SeriesLearningPathMap() {
  const [hover, setHover] = useState<string | null>(null);

  const map = new Map(POSTS.map((p) => [p.slug, p]));
  const W = COLS * CELL_W;
  const H = ROWS * CELL_H + 24;

  const edges: { from: Post; to: Post; key: string }[] = [];
  for (const p of POSTS) {
    for (const d of p.deps) {
      const from = map.get(d)!;
      edges.push({ from, to: p, key: `${d}->${p.slug}` });
    }
  }

  const cx = (col: number) => col * CELL_W + CELL_W / 2;
  const cy = (row: number) => row * CELL_H + CELL_H / 2 + 12;

  const activePost = hover ? map.get(hover) : null;

  return (
    <VisualFrame title="系列文章知识依赖图（悬停查看本篇要点）">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 720 }}
        >
          <defs>
            <marker
              id="path-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {edges.map((e) => {
            const x1 = cx(e.from.col) + 38;
            const y1 = cy(e.from.row);
            const x2 = cx(e.to.col) - 38;
            const y2 = cy(e.to.row);
            const mx = (x1 + x2) / 2;
            const isActive = hover && (hover === e.from.slug || hover === e.to.slug);
            return (
              <path
                key={e.key}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                strokeWidth={isActive ? 1.6 : 1}
                className={cn(
                  isActive
                    ? "text-violet-500 dark:text-violet-400"
                    : "text-neutral-300 dark:text-neutral-700"
                )}
                stroke="currentColor"
                markerEnd="url(#path-arrow)"
              />
            );
          })}
          {POSTS.map((p) => {
            const x = cx(p.col);
            const y = cy(p.row);
            const s = STAGE_STYLES[p.stage];
            const isActive = hover === p.slug;
            return (
              <g
                key={p.slug}
                transform={`translate(${x - 42} ${y - 22})`}
                className="cursor-pointer"
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
              >
                <rect
                  x={0}
                  y={0}
                  width={84}
                  height={44}
                  rx={6}
                  className={cn(
                    s.bg,
                    isActive ? "stroke-violet-500 dark:stroke-violet-400" : "stroke-neutral-300 dark:stroke-neutral-700"
                  )}
                  strokeWidth={isActive ? 1.5 : 1}
                  fill="currentColor"
                />
                <text
                  x={6}
                  y={14}
                  className="fill-muted-foreground"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  #{p.no}
                </text>
                <text
                  x={42}
                  y={29}
                  textAnchor="middle"
                  className="fill-foreground font-medium"
                  fontSize="11"
                >
                  {p.short}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {(Object.keys(STAGE_STYLES) as Stage[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-muted-foreground">
            <span className={cn("inline-block w-3 h-3 rounded ring-1", STAGE_STYLES[s].bg, STAGE_STYLES[s].ring)} />
            {STAGE_STYLES[s].label}
          </span>
        ))}
      </div>

      <div className="mt-4 min-h-17 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-900/40 text-sm">
        {activePost ? (
          <>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-xs text-muted-foreground">#{activePost.no}</span>
              <span className="font-semibold">{activePost.title}</span>
            </div>
            <div className="text-xs text-secondary-foreground leading-relaxed">
              {activePost.hint}
            </div>
          </>
        ) : (
          <div className="text-xs text-muted-foreground">
            鼠标移到节点上看本篇讲了什么。箭头是阅读建议的依赖顺序，并不强制——基础架构看完后，训练分支和对齐分支可以并行推进。
          </div>
        )}
      </div>
    </VisualFrame>
  );
}
