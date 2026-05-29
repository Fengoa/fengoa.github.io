"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 一段固定文本，用四种策略各切一次，可视化展示边界
const TEXT = `Transformer 是一种基于自注意力的神经网络架构。它由编码器和解码器组成。每个编码器层包含两个子层：多头自注意力和前馈网络。

Transformer 的关键创新是自注意力机制。它允许模型在处理一个 token 时同时考虑序列中的其他所有 token。这比 RNN 的顺序处理更高效。

注意力权重是动态计算的。Q、K、V 三个矩阵决定了每个位置看哪里。这是模型学到的，而不是硬编码的。`;

type Chunk = { text: string; tag?: string };

function chunkFixed(text: string, size: number): Chunk[] {
  const out: Chunk[] = [];
  for (let i = 0; i < text.length; i += size) {
    out.push({ text: text.slice(i, i + size) });
  }
  return out;
}

function chunkParagraph(text: string): Chunk[] {
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((p) => ({ text: p }));
}

function chunkRecursive(text: string, size: number): Chunk[] {
  // 先按段切；超长段再按句号切
  const out: Chunk[] = [];
  for (const para of text.split(/\n\n+/).filter((p) => p.trim())) {
    if (para.length <= size) {
      out.push({ text: para });
    } else {
      // 按 。或 . 切句
      const sents = para.split(/(?<=[。.])/).filter((s) => s.trim());
      let buf = "";
      for (const s of sents) {
        if ((buf + s).length > size && buf) {
          out.push({ text: buf });
          buf = s;
        } else {
          buf += s;
        }
      }
      if (buf) out.push({ text: buf });
    }
  }
  return out;
}

function chunkSemantic(): Chunk[] {
  // 模拟：按主题边界切（手工标注：三段恰好对应三个主题）
  return [
    { text: "Transformer 是一种基于自注意力的神经网络架构。它由编码器和解码器组成。每个编码器层包含两个子层：多头自注意力和前馈网络。", tag: "架构" },
    { text: "Transformer 的关键创新是自注意力机制。它允许模型在处理一个 token 时同时考虑序列中的其他所有 token。这比 RNN 的顺序处理更高效。", tag: "自注意力" },
    { text: "注意力权重是动态计算的。Q、K、V 三个矩阵决定了每个位置看哪里。这是模型学到的，而不是硬编码的。", tag: "权重" },
  ];
}

const STRATEGIES = [
  {
    key: "fixed",
    name: "定长切分",
    desc: "每 80 字符一刀",
    pros: "实现最简单，速度快",
    cons: "容易切到句子或词中间",
    build: (t: string) => chunkFixed(t, 80),
    color: "#94a3b8",
  },
  {
    key: "paragraph",
    name: "按段落",
    desc: "按 \\n\\n 切",
    pros: "保留语义完整性",
    cons: "段落长度差异大",
    build: chunkParagraph,
    color: "#0ea5e9",
  },
  {
    key: "recursive",
    name: "递归切分",
    desc: "段过长就再按句切",
    pros: "兼顾长度均衡和语义",
    cons: "实现略复杂",
    build: (t: string) => chunkRecursive(t, 80),
    color: "#f59e0b",
  },
  {
    key: "semantic",
    name: "语义切分",
    desc: "按主题相似度",
    pros: "每块一个主题，最干净",
    cons: "需要 embedding 计算，慢",
    build: chunkSemantic,
    color: "#10b981",
  },
];

export function ChunkStrategyComparator() {
  const [active, setActive] = useState(0);
  const strat = STRATEGIES[active];
  const chunks = strat.build(TEXT);

  return (
    <VisualFrame title="同一段文本，四种切法效果完全不同">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {STRATEGIES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "px-3 py-1.5 rounded border text-xs font-mono transition-all",
                i === active
                  ? "shadow-sm scale-[1.02]"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
              style={
                i === active
                  ? { borderColor: s.color, backgroundColor: s.color + "12", color: s.color }
                  : {}
              }
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
          <span className="text-muted-foreground">{strat.desc}</span>
          <span>
            <span className="text-emerald-500">优</span> {strat.pros}
          </span>
          <span>
            <span className="text-rose-500">缺</span> {strat.cons}
          </span>
          <span className="ml-auto text-muted-foreground">
            切成 {chunks.length} 块，平均{" "}
            {Math.round(chunks.reduce((s, c) => s + c.text.length, 0) / chunks.length)} 字
          </span>
        </div>

        {/* 切分结果 */}
        <div className="space-y-1.5 max-h-72 overflow-auto pr-1">
          {chunks.map((c, i) => (
            <div
              key={i}
              className="rounded border-l-4 px-3 py-2 text-xs leading-relaxed"
              style={{
                borderLeftColor: strat.color,
                backgroundColor: strat.color + "08",
              }}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: strat.color }}
                >
                  chunk {i + 1}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {c.text.length} 字
                </span>
                {c.tag && (
                  <span
                    className="text-xs font-mono px-1.5 rounded"
                    style={{
                      backgroundColor: strat.color + "22",
                      color: strat.color,
                    }}
                  >
                    {c.tag}
                  </span>
                )}
              </div>
              <div className="font-mono whitespace-pre-wrap">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
