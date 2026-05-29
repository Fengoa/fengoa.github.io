"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 模拟一个语义空间：每个 chunk 一个 (x, y) 坐标，标注它的主题。
// query 用一个不同形状的点高亮，按欧氏距离取 top-k。

type Chunk = {
  id: number;
  text: string;
  topic: string;
  x: number;
  y: number;
};

const CHUNKS: Chunk[] = [
  // 集群 A：LLaMA 模型介绍
  { id: 1, text: "LLaMA 3 用了 GQA 注意力", topic: "LLaMA", x: 0.18, y: 0.22 },
  { id: 2, text: "LLaMA 3 在 15T tokens 训练", topic: "LLaMA", x: 0.24, y: 0.28 },
  { id: 3, text: "LLaMA 系列采用 RMSNorm", topic: "LLaMA", x: 0.16, y: 0.32 },
  { id: 4, text: "上下文长度提到 8K", topic: "LLaMA", x: 0.22, y: 0.18 },

  // 集群 B：训练框架 / 工程
  { id: 5, text: "DeepSpeed 做 ZeRO 优化", topic: "训练工程", x: 0.62, y: 0.18 },
  { id: 6, text: "torch.compile 静态图加速", topic: "训练工程", x: 0.7, y: 0.22 },
  { id: 7, text: "TP + PP 并行训练", topic: "训练工程", x: 0.68, y: 0.3 },

  // 集群 C：RAG / 向量库
  { id: 8, text: "向量数据库存 embedding", topic: "RAG", x: 0.82, y: 0.7 },
  { id: 9, text: "BM25 关键词检索", topic: "RAG", x: 0.78, y: 0.78 },
  { id: 10, text: "re-ranker 做精排", topic: "RAG", x: 0.86, y: 0.62 },

  // 集群 D：硬件 / 推理
  { id: 11, text: "A100 显卡 80 GB 显存", topic: "推理硬件", x: 0.32, y: 0.78 },
  { id: 12, text: "vLLM PagedAttention", topic: "推理硬件", x: 0.4, y: 0.7 },
  { id: 13, text: "INT4 量化省显存", topic: "推理硬件", x: 0.28, y: 0.7 },
];

const QUERIES = [
  { text: "LLaMA 3 有什么新特性？", x: 0.2, y: 0.25 },
  { text: "怎么部署省显存？", x: 0.3, y: 0.74 },
  { text: "向量检索是怎么做的？", x: 0.83, y: 0.72 },
];

export function Embedding2DProjection() {
  const [qIdx, setQIdx] = useState(0);
  const [k, setK] = useState(3);

  const query = QUERIES[qIdx];

  const ranked = useMemo(() => {
    return CHUNKS.map((c) => {
      const dx = c.x - query.x;
      const dy = c.y - query.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return { ...c, dist };
    }).sort((a, b) => a.dist - b.dist);
  }, [query.x, query.y]);

  const topK = ranked.slice(0, k);
  const topKSet = new Set(topK.map((c) => c.id));

  // 颜色按 topic
  const topicColor: Record<string, string> = {
    LLaMA: "#8b5cf6",
    训练工程: "#10b981",
    RAG: "#f59e0b",
    推理硬件: "#ef4444",
  };

  const W = 520;
  const H = 320;
  const PAD = 24;

  const sx = (v: number) => PAD + v * (W - 2 * PAD);
  const sy = (v: number) => PAD + v * (H - 2 * PAD);

  return (
    <VisualFrame title="语义空间投影：query 周围最近的 k 个 chunk 就是检索结果">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">尝试不同的问题：</span>
          {QUERIES.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQIdx(i)}
              className={cn(
                "px-2 py-1 rounded border transition-colors",
                i === qIdx
                  ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
            >
              {q.text}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <label className="text-muted-foreground">top-k</label>
          <input
            type="range"
            min="1"
            max="6"
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="flex-1 max-w-40 accent-violet-500"
          />
          <span className="tabular-nums w-6 text-right">{k}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
          {/* 2D 散点图 */}
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* 背景网格 */}
            {[0.25, 0.5, 0.75].map((g) => (
              <g key={g}>
                <line
                  x1={sx(g)}
                  x2={sx(g)}
                  y1={PAD}
                  y2={H - PAD}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                  strokeDasharray="2 3"
                  strokeWidth={0.5}
                />
                <line
                  x1={PAD}
                  x2={W - PAD}
                  y1={sy(g)}
                  y2={sy(g)}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                  strokeDasharray="2 3"
                  strokeWidth={0.5}
                />
              </g>
            ))}

            {/* 连接 query 与 top-k */}
            {topK.map((c) => (
              <line
                key={`l-${c.id}`}
                x1={sx(query.x)}
                y1={sy(query.y)}
                x2={sx(c.x)}
                y2={sy(c.y)}
                stroke="#8b5cf6"
                strokeWidth={1}
                strokeOpacity={0.4}
                strokeDasharray="2 2"
              />
            ))}

            {/* chunks */}
            {CHUNKS.map((c) => {
              const isTop = topKSet.has(c.id);
              return (
                <g key={c.id}>
                  <circle
                    cx={sx(c.x)}
                    cy={sy(c.y)}
                    r={isTop ? 7 : 4.5}
                    fill={topicColor[c.topic]}
                    fillOpacity={isTop ? 0.95 : 0.4}
                    stroke={topicColor[c.topic]}
                    strokeWidth={isTop ? 1.5 : 0}
                  />
                </g>
              );
            })}

            {/* query 点 */}
            <g>
              <circle
                cx={sx(query.x)}
                cy={sy(query.y)}
                r={11}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="3 2"
              >
                <animate
                  attributeName="r"
                  from="11"
                  to="16"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={sx(query.x)}
                cy={sy(query.y)}
                r={6}
                fill="#8b5cf6"
                stroke="white"
                strokeWidth={2}
                className="dark:stroke-neutral-950"
              />
            </g>
          </svg>

          {/* 右侧 top-k 列表 */}
          <div className="lg:w-72 space-y-1.5">
            <div className="text-xs font-mono text-muted-foreground mb-1">
              top-{k} 检索结果
            </div>
            {topK.map((c, i) => (
              <div
                key={c.id}
                className="flex items-start gap-2 px-2 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40"
              >
                <span className="text-xs font-mono text-muted-foreground w-3 shrink-0 mt-0.5">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs leading-tight">{c.text}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: topicColor[c.topic] }}
                    />
                    <span className="text-xs font-mono text-muted-foreground">
                      {c.topic}（sim {(1 - c.dist).toFixed(2)}）
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono pt-1 border-t border-neutral-200 dark:border-neutral-800">
          {Object.entries(topicColor).map(([t, c]) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              <span className="text-muted-foreground">{t}</span>
            </span>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
