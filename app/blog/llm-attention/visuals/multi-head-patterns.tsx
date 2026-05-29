"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { VisualFrame } from "./frame";

// =============================================================================
// MultiHeadPatterns：MiniGPT 在 "KING RICHARD:" 上的多头注意力热力图
// tab 切换 layer，hover head 卡片看每个位置 top-3 关注
// =============================================================================

// 输入序列（KING RICHARD: 的字符流，13 个 token）
const SEQ = ["K", "I", "N", "G", " ", "R", "I", "C", "H", "A", "R", "D", ":"];

// 工具：构造下三角注意力矩阵（每行和≈1）
function makeRow(
  size: number,
  builder: (i: number, q: number) => number,
  q: number
): number[] {
  const raw = Array.from({ length: size }, (_, i) =>
    i > q ? 0 : builder(i, q)
  );
  const sum = raw.reduce((a, b) => a + b, 0);
  return sum > 0 ? raw.map((v) => v / sum) : raw;
}

function buildMatrix(
  builder: (i: number, q: number) => number
): number[][] {
  return SEQ.map((_, q) => makeRow(SEQ.length, builder, q));
}

// 四种关注模式的"参数生成器"
const PATTERNS = {
  // 几乎只看前一个位置（局部 / bigram）
  prev: (i: number, q: number) => {
    if (i === q - 1) return 0.85;
    if (i === q) return 0.1;
    if (q - i <= 3) return 0.05;
    return 0.005;
  },
  // 距离衰减（综合上下文）
  decay: (i: number, q: number) => {
    if (i > q) return 0;
    return Math.exp(-(q - i) * 0.4);
  },
  // 总盯着开头几个位置（全局 / 锚点）
  anchor: (i: number, q: number) => {
    if (i > q) return 0;
    if (i <= 1) return 0.5;
    if (i === q) return 0.15;
    return 0.05;
  },
  // 中等距离（跨字符 / 词内结构）
  mid: (i: number, q: number) => {
    if (i > q) return 0;
    const d = q - i;
    if (d === 0) return 0.2;
    if (d >= 2 && d <= 4) return 0.4;
    return 0.1;
  },
} as const;

type Layer = {
  layer: number;
  heads: { id: number; name: string; tag: string; pattern: keyof typeof PATTERNS }[];
};

const LAYERS: Layer[] = [
  {
    layer: 0,
    heads: [
      { id: 0, name: "Head 0", tag: "递减 / 综合上下文", pattern: "decay" },
      { id: 1, name: "Head 1", tag: "递减 / 综合上下文", pattern: "decay" },
      { id: 2, name: "Head 2", tag: "局部 / 看前一个", pattern: "prev" },
      { id: 3, name: "Head 3", tag: "局部 / 看前一个", pattern: "prev" },
    ],
  },
  {
    layer: 1,
    heads: [
      { id: 0, name: "Head 0", tag: "中距离 / 词内结构", pattern: "mid" },
      { id: 1, name: "Head 1", tag: "递减 / 综合上下文", pattern: "decay" },
      { id: 2, name: "Head 2", tag: "全局 / 盯着开头", pattern: "anchor" },
      { id: 3, name: "Head 3", tag: "递减 / 综合上下文", pattern: "decay" },
    ],
  },
];

function topK(row: number[], k: number) {
  return row
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p > 0.001)
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}

function showCh(ch: string) {
  return ch === " " ? "␣" : ch;
}

function HeadHeatmap({ pattern, focusQ }: { pattern: keyof typeof PATTERNS; focusQ: number | null }) {
  const matrix = buildMatrix(PATTERNS[pattern]);
  const N = SEQ.length;
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {matrix.map((row, qi) =>
        row.map((p, ki) => {
          const alpha = p > 0 ? Math.min(1, Math.pow(p, 0.55)) : 0;
          const isFocus = focusQ !== null && qi === focusQ;
          return (
            <div
              key={`c-${qi}-${ki}`}
              className={cn(
                "aspect-square rounded-[1px] transition-all",
                isFocus && "ring-1 ring-violet-500/70"
              )}
              style={{
                backgroundColor:
                  ki > qi
                    ? "transparent"
                    : `rgba(139, 92, 246, ${alpha.toFixed(3)})`,
              }}
            />
          );
        })
      )}
    </div>
  );
}

export function MultiHeadPatterns() {
  const [layerIdx, setLayerIdx] = useState(0);
  const [focusHead, setFocusHead] = useState<number | null>(null);

  const layer = LAYERS[layerIdx];

  // 拿一个有代表性的 query 位置（最后一个）来展示 top-3
  const focusQ = SEQ.length - 1;
  const headForTopK =
    focusHead !== null
      ? layer.heads.find((h) => h.id === focusHead)
      : null;
  const topkRow = headForTopK
    ? buildMatrix(PATTERNS[headForTopK.pattern])[focusQ]
    : null;
  const topk = topkRow ? topK(topkRow, 3) : null;

  return (
    <VisualFrame title="MiniGPT 在 KING RICHARD: 上的注意力——同一层不同 head 学出不同模式">
      <div className="flex flex-col items-center gap-4">
        {/* layer tab */}
        <div className="flex gap-1 rounded border border-neutral-200 dark:border-neutral-800 p-1 bg-neutral-50 dark:bg-neutral-900">
          {LAYERS.map((l, i) => (
            <button
              key={l.layer}
              onClick={() => {
                setLayerIdx(i);
                setFocusHead(null);
              }}
              className={cn(
                "px-3 py-1 rounded font-mono text-xs transition-colors",
                layerIdx === i
                  ? "bg-violet-500 text-white dark:bg-violet-400 dark:text-neutral-900"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Layer {l.layer}
            </button>
          ))}
        </div>

        {/* 4 个 head 横排 */}
        <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-3">
          {layer.heads.map((head) => {
            const isFocus = focusHead === head.id;
            return (
              <button
                key={head.id}
                onMouseEnter={() => setFocusHead(head.id)}
                onMouseLeave={() => setFocusHead(null)}
                onClick={() =>
                  setFocusHead((p) => (p === head.id ? null : head.id))
                }
                className={cn(
                  "flex flex-col items-stretch gap-2 rounded border p-2 transition-all text-left",
                  isFocus
                    ? "border-violet-400 dark:border-violet-500 ring-2 ring-violet-400/30"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {head.name}
                  </span>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {head.tag}
                </div>
                <HeadHeatmap pattern={head.pattern} focusQ={focusQ} />
              </button>
            );
          })}
        </div>

        {/* 序列底标 */}
        <div className="grid w-full max-w-2xl" style={{ gridTemplateColumns: `repeat(${SEQ.length}, 1fr)` }}>
          {SEQ.map((ch, i) => (
            <div
              key={i}
              className="text-center font-mono text-xs text-muted-foreground/70"
            >
              {showCh(ch)}
            </div>
          ))}
        </div>

        {/* top-3 详情 */}
        <div className="min-h-10 text-xs font-mono text-center max-w-xl">
          {headForTopK && topk ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-muted-foreground">
                {headForTopK.name} 在最后位置上的 top-3 关注：
              </span>
              {topk.map((t, k) => (
                <span
                  key={`${headForTopK.id}-${k}`}
                  className={cn(
                    "px-2 py-0.5 rounded border",
                    k === 0
                      ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                      : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
                  )}
                >
                  {`'${showCh(SEQ[t.i])}'`}（{(t.p * 100).toFixed(0)}%）
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground/70">
              鼠标悬停某个 head 查看它在末位的 top-3 关注
            </span>
          )}
        </div>
      </div>
    </VisualFrame>
  );
}
