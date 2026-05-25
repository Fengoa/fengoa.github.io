"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// =============================================================================
// 01 — 从零搭一个语言模型：字符逐个生成的打字机效果
// =============================================================================

export function MinimalLLMCover({ className }: { className?: string }) {
  const [text, setText] = useState("");
  const fullText = "KING:\nTo be";
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % (fullText.length + 8);
      if (indexRef.current <= fullText.length) {
        setText(fullText.slice(0, indexRef.current));
      } else {
        // 停顿后重置
        if (indexRef.current === fullText.length + 7) {
          setText("");
          indexRef.current = 0;
        }
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#0a0f0d] via-[#0d1117] to-[#101820]",
        className
      )}
    >
      {/* 暗色终端背景 + 光标闪烁效果 */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <pre className="font-mono text-lg text-emerald-400/90 leading-relaxed whitespace-pre-wrap">
          {text}
          <span className="animate-pulse text-emerald-400">_</span>
        </pre>
      </div>
      {/* 微妙的扫描线 */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
      {/* 边缘渐隐 */}
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_40px_20px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

// =============================================================================
// 02 — Tokenizer：文字碎片拆分/合并
// =============================================================================

export function TokenizerCover({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 三个阶段: 字符 → 子词 → 完整词
  const stages = [
    ["t", "h", "e", " ", "k", "i", "n", "g"],
    ["th", "e ", "ki", "ng"],
    ["the ", "king"],
  ];

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#fdf8f4] via-[#fef9f3] to-[#f9f3ed] dark:from-[#1a1510] dark:via-[#1c1712] dark:to-[#181310]",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <AnimatePresence mode="popLayout">
            {stages[phase].map((token, i) => (
              <motion.span
                key={`${phase}-${i}`}
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "inline-flex items-center justify-center px-2 py-1 rounded font-mono text-sm border",
                  phase === 0 && "border-neutral-200 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                  phase === 1 && "border-violet-200/80 bg-violet-50/60 text-violet-600 dark:border-violet-800/60 dark:bg-violet-900/30 dark:text-violet-300",
                  phase === 2 && "border-emerald-200/80 bg-emerald-50/60 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-300"
                )}
              >
                {token}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* 底部标注 */}
      <div className="absolute bottom-[25%] left-0 right-0 text-center">
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {phase === 0 ? "char" : phase === 1 ? "subword" : "token"}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// 03 — Attention：节点之间的注意力连线
// =============================================================================

export function AttentionCover({ className }: { className?: string }) {
  const [activeNode, setActiveNode] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((n) => (n + 1) % 5);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // 5 个节点的位置（相对中心的偏移，圆形排列）
  const nodes = [
    { x: 50, y: 22, label: "I" },
    { x: 78, y: 42, label: "am" },
    { x: 68, y: 72, label: "a" },
    { x: 32, y: 72, label: "cat" },
    { x: 22, y: 42, label: "." },
  ];

  // 注意力权重（activeNode 关注其他节点的程度）
  const getWeight = (from: number, to: number) => {
    if (to >= from) return 0;
    const dist = from - to;
    return Math.max(0, 1 - dist * 0.25);
  };

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#f8f4ff] via-[#f3eeff] to-[#ede4ff] dark:from-[#150f1e] dark:via-[#1a1228] dark:to-[#1e1530]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 连接线 */}
        {nodes.map((target, j) => {
          if (j >= activeNode) return null;
          const weight = getWeight(activeNode, j);
          if (weight <= 0) return null;
          return (
            <motion.line
              key={`line-${j}`}
              x1={nodes[activeNode].x}
              y1={nodes[activeNode].y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
              className="text-violet-400 dark:text-violet-500"
              strokeWidth={weight * 2.5}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: weight * 0.7, pathLength: 1 }}
              transition={{ duration: 0.4, delay: j * 0.08 }}
            />
          );
        })}
        {/* 节点 */}
        {nodes.map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={i === activeNode ? 7 : 5}
              className={cn(
                i === activeNode
                  ? "fill-violet-500 dark:fill-violet-400"
                  : i < activeNode
                    ? "fill-neutral-300 dark:fill-neutral-600"
                    : "fill-neutral-200 dark:fill-neutral-800"
              )}
              animate={{ scale: i === activeNode ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text
              x={node.x}
              y={node.y + 14}
              textAnchor="middle"
              className="text-[6px] font-mono fill-muted-foreground"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// =============================================================================
// 04 — Transformer：堆叠层块 + 数据流
// =============================================================================

export function TransformerCover({ className }: { className?: string }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => (p + 1) % 4);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const layers = [
    { label: "Emb", color: "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" },
    { label: "Attn", color: "bg-violet-50/80 dark:bg-violet-900/30 border-violet-200/80 dark:border-violet-800/60" },
    { label: "FFN", color: "bg-amber-50/60 dark:bg-amber-900/20 border-amber-200/70 dark:border-amber-800/50" },
    { label: "Head", color: "bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200/70 dark:border-emerald-800/50" },
  ];

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#f0f9ff] via-[#ecfeff] to-[#f0fdfa] dark:from-[#0c1520] dark:via-[#0d1a1f] dark:to-[#0c1a18]",
        className
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-14">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            className={cn(
              "w-full rounded border px-3 py-1.5 text-center font-mono text-[10px] transition-all",
              layer.color,
              pulse === i && "ring-2 ring-offset-1 ring-foreground/20"
            )}
            animate={{
              scale: pulse === i ? 1.05 : 1,
              opacity: pulse >= i ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            {layer.label}
          </motion.div>
        ))}
        {/* 箭头指示数据流 */}
        <div className="absolute left-[28%] top-[28%] bottom-[28%] flex flex-col justify-between items-center pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="text-muted-foreground/40 text-[10px]"
              animate={{ opacity: pulse > i ? 1 : 0.3 }}
            >
              ↓
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 05 — 训练：Loss 曲线下降
// =============================================================================

export function TrainingCover({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p + 1) % 60);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // 生成 loss 曲线点（指数衰减 + 噪声）
  const points = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const loss = 4.2 * Math.exp(-3 * t) + 1.5 + Math.sin(i * 0.8) * 0.15 * (1 - t);
    return loss;
  });

  const visiblePoints = points.slice(0, Math.min(progress, 40));
  const maxLoss = 5.5;
  const minLoss = 1.0;

  // SVG path
  const pathD = visiblePoints
    .map((loss, i) => {
      const x = 15 + (i / 39) * 70;
      const y = 20 + ((loss - minLoss) / (maxLoss - minLoss)) * 55;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#fff8f6] via-[#fff5f3] to-[#fef0ec] dark:from-[#1c1210] dark:via-[#1e1412] dark:to-[#201510]",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* 坐标轴 */}
        <line x1="15" y1="20" x2="15" y2="80" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="0.5" />
        <line x1="15" y1="80" x2="88" y2="80" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="0.5" />

        {/* Y 轴刻度 */}
        <text x="10" y="23" className="text-[4px] fill-muted-foreground/60 font-mono" textAnchor="end">4.2</text>
        <text x="10" y="78" className="text-[4px] fill-muted-foreground/60 font-mono" textAnchor="end">1.5</text>

        {/* Loss 曲线 */}
        {visiblePoints.length > 1 && (
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lossGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* 渐变定义 */}
        <defs>
          <linearGradient id="lossGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* 当前点 */}
        {visiblePoints.length > 0 && (
          <circle
            cx={15 + ((visiblePoints.length - 1) / 39) * 70}
            cy={20 + ((visiblePoints[visiblePoints.length - 1] - minLoss) / (maxLoss - minLoss)) * 55}
            r="2"
            className="fill-emerald-500 dark:fill-emerald-400"
          >
            <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* 标签 */}
        <text x="50" y="95" textAnchor="middle" className="text-[5px] font-mono fill-muted-foreground/60">
          steps
        </text>
        <text x="5" y="50" textAnchor="middle" className="text-[5px] font-mono fill-muted-foreground/60" transform="rotate(-90, 5, 50)">
          loss
        </text>
      </svg>
    </div>
  );
}
