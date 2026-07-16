"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// TransformerBlockFlow：一个 block 内 x 的流动
// x → LN → Attention → +x → LN → FFN → +x → out
// 分步播放，每一步高亮当前活动节点和数据流
// =============================================================================

type Step = {
  id: string;
  label: string;
  desc: string;
  // 哪些块在亮
  active: string[];
  // 流向：from → to
  flow?: { from: string; to: string }[];
};

const STEPS: Step[] = [
  {
    id: "input",
    label: "输入 x",
    desc: "上一个 block 给过来的隐藏状态，形状 (B, T, n_embd)",
    active: ["x"],
  },
  {
    id: "ln1",
    label: "LayerNorm",
    desc: "先把每个位置的向量归一化到均值 0、方差 1，避免幅度失控",
    active: ["x", "ln1"],
    flow: [{ from: "x", to: "ln1" }],
  },
  {
    id: "attn",
    label: "Multi-Head Attention",
    desc: "Q/K/V 投影、点积、softmax、加权 Value，让每个位置看到历史",
    active: ["ln1", "attn"],
    flow: [{ from: "ln1", to: "attn" }],
  },
  {
    id: "res1",
    label: "残差连接",
    desc: "把原始 x 加回来，attention 只是“增量”，原信息得以保留",
    active: ["x", "attn", "res1"],
    flow: [
      { from: "attn", to: "res1" },
      { from: "x", to: "res1" },
    ],
  },
  {
    id: "ln2",
    label: "LayerNorm",
    desc: "进 FFN 前再 normalize 一次，理由同上",
    active: ["res1", "ln2"],
    flow: [{ from: "res1", to: "ln2" }],
  },
  {
    id: "ffn",
    label: "FFN",
    desc: "两层 MLP，128 → 512 → 128，加非线性让模型“消化”刚才看到的内容",
    active: ["ln2", "ffn"],
    flow: [{ from: "ln2", to: "ffn" }],
  },
  {
    id: "res2",
    label: "残差连接",
    desc: "再加一次原信息，输出送给下一个 block",
    active: ["res1", "ffn", "out"],
    flow: [
      { from: "ffn", to: "out" },
      { from: "res1", to: "out" },
    ],
  },
];

// 块的位置（百分比坐标，方便 SVG 画线）
const NODES: Record<
  string,
  { x: number; y: number; label: string; kind: "io" | "norm" | "module" | "add" }
> = {
  x: { x: 10, y: 50, label: "x", kind: "io" },
  ln1: { x: 28, y: 30, label: "LN", kind: "norm" },
  attn: { x: 46, y: 30, label: "Multi-Head Attn", kind: "module" },
  res1: { x: 64, y: 50, label: "+", kind: "add" },
  ln2: { x: 64, y: 30, label: "LN", kind: "norm" },
  ffn: { x: 80, y: 30, label: "FFN", kind: "module" },
  out: { x: 92, y: 50, label: "out", kind: "io" },
};

// 块的尺寸
const NODE_W: Record<string, number> = {
  x: 6,
  out: 6,
  ln1: 6,
  ln2: 6,
  attn: 16,
  ffn: 6,
  res1: 4,
};

function nodeColor(
  kind: "io" | "norm" | "module" | "add",
  isActive: boolean
) {
  if (!isActive) {
    if (kind === "io") return "fill-neutral-200 dark:fill-neutral-800";
    if (kind === "norm") return "fill-amber-200/40 dark:fill-amber-900/30";
    if (kind === "module") return "fill-violet-200/40 dark:fill-violet-900/30";
    return "fill-emerald-200/40 dark:fill-emerald-900/30";
  }
  if (kind === "io") return "fill-neutral-400 dark:fill-neutral-500";
  if (kind === "norm") return "fill-amber-400 dark:fill-amber-500";
  if (kind === "module") return "fill-violet-400 dark:fill-violet-500";
  return "fill-emerald-400 dark:fill-emerald-500";
}

export function TransformerBlockFlow() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2400);
    return () => clearInterval(t);
  }, [auto]);

  const current = STEPS[step];
  const activeSet = new Set(current.active);

  return (
    <VisualFrame title="一个 Transformer block 内部，x 是怎么走完一遍的">
      <div className="flex flex-col items-center gap-3">
        {/* 步骤切换 */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setAuto(false);
                setStep(i);
              }}
              className={cn(
                "px-2.5 py-1 rounded font-mono text-xs transition-colors border",
                step === i
                  ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>

        {/* 主流程 SVG */}
        <svg
          viewBox="0 0 100 80"
          className="w-full max-w-2xl h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 主干横线 (x 到 out 的残差通道) */}
          <line
            x1={NODES.x.x + NODE_W.x / 2}
            x2={NODES.out.x - NODE_W.out / 2}
            y1={NODES.x.y}
            y2={NODES.out.y}
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth={0.4}
            strokeDasharray="1.5 1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* 上方分支：x → ln1 → attn → res1 */}
          <polyline
            points={`
              ${NODES.x.x},${NODES.x.y - 2}
              ${NODES.x.x},${NODES.ln1.y + 4}
              ${NODES.ln1.x - NODE_W.ln1 / 2},${NODES.ln1.y + 4}
            `}
            fill="none"
            stroke="currentColor"
            className={cn(
              activeSet.has("ln1")
                ? "text-violet-500"
                : "text-neutral-300 dark:text-neutral-700"
            )}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={`
              ${NODES.attn.x + NODE_W.attn / 2},${NODES.attn.y + 4}
              ${NODES.res1.x},${NODES.res1.y - 2}
            `}
            fill="none"
            stroke="currentColor"
            className={cn(
              activeSet.has("res1") || activeSet.has("attn")
                ? "text-violet-500"
                : "text-neutral-300 dark:text-neutral-700"
            )}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />

          {/* 下半段分支：res1 → ln2 → ffn → out */}
          <polyline
            points={`
              ${NODES.res1.x},${NODES.res1.y - 2}
              ${NODES.res1.x},${NODES.ln2.y + 4}
            `}
            fill="none"
            stroke="currentColor"
            className={cn(
              activeSet.has("ln2") || activeSet.has("res1")
                ? "text-violet-500"
                : "text-neutral-300 dark:text-neutral-700"
            )}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={`
              ${NODES.ffn.x + NODE_W.ffn / 2},${NODES.ffn.y + 4}
              ${NODES.out.x},${NODES.out.y - 2}
            `}
            fill="none"
            stroke="currentColor"
            className={cn(
              activeSet.has("out") || activeSet.has("ffn")
                ? "text-violet-500"
                : "text-neutral-300 dark:text-neutral-700"
            )}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />

          {/* 节点 */}
          {Object.entries(NODES).map(([key, n]) => {
            const w = NODE_W[key];
            const h = 6;
            const isActive = activeSet.has(key);
            const isCircle = n.kind === "io" || n.kind === "add";
            return (
              <g key={key}>
                {isCircle ? (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={w / 2}
                    className={nodeColor(n.kind, isActive)}
                  />
                ) : (
                  <rect
                    x={n.x - w / 2}
                    y={n.y - h / 2}
                    width={w}
                    height={h}
                    rx={1.2}
                    className={nodeColor(n.kind, isActive)}
                  />
                )}
                <text
                  x={n.x}
                  y={n.y + 1.5}
                  textAnchor="middle"
                  className={cn(
                    "text-[3px] font-mono",
                    isActive
                      ? "fill-white dark:fill-neutral-900"
                      : "fill-neutral-600 dark:fill-neutral-400"
                  )}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 步骤说明 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-mono text-center text-muted-foreground max-w-xl leading-relaxed"
          >
            <span className="text-foreground font-semibold">
              {current.label}
            </span>
            ：{current.desc}
          </motion.div>
        </AnimatePresence>
      </div>
    </VisualFrame>
  );
}
