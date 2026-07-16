"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// FFNExpansion：128 → 512 → 128 的维度变化 + GELU 非线性可视化
// =============================================================================

const STEPS = [
  {
    id: "in",
    label: "输入",
    dim: 128,
    desc: "attention 出来的隐藏状态",
  },
  {
    id: "fc1",
    label: "fc1（升维）",
    dim: 512,
    desc: "Linear(128 → 512)：把 128 维拉到 4 倍宽",
  },
  {
    id: "act",
    label: "GELU",
    dim: 512,
    desc: "非线性激活，让模型能拟合复杂函数",
  },
  {
    id: "fc2",
    label: "fc2（降维）",
    dim: 128,
    desc: "Linear(512 → 128)：再压回原维度，方便和残差相加",
  },
] as const;

function gelu(x: number) {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
}

function GeluCurve() {
  const W = 200;
  const H = 80;
  const PAD = 8;
  const xs = Array.from({ length: 60 }, (_, i) => -3 + (i / 59) * 6);
  const points = xs.map((x) => {
    const y = gelu(x);
    const px = PAD + ((x + 3) / 6) * (W - 2 * PAD);
    const py = H - PAD - ((y + 0.5) / 4) * (H - 2 * PAD);
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-50">
      <line
        x1={PAD}
        x2={W - PAD}
        y1={H - PAD - (0.5 / 4) * (H - 2 * PAD)}
        y2={H - PAD - (0.5 / 4) * (H - 2 * PAD)}
        stroke="currentColor"
        className="text-neutral-300 dark:text-neutral-700"
        strokeWidth={0.4}
      />
      <line
        x1={PAD + (3 / 6) * (W - 2 * PAD)}
        x2={PAD + (3 / 6) * (W - 2 * PAD)}
        y1={PAD}
        y2={H - PAD}
        stroke="currentColor"
        className="text-neutral-300 dark:text-neutral-700"
        strokeWidth={0.4}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={W - PAD}
        y={H - PAD - (0.5 / 4) * (H - 2 * PAD) - 3}
        textAnchor="end"
        className="text-[7px] font-mono fill-muted-foreground"
      >
        x
      </text>
      <text
        x={PAD + (3 / 6) * (W - 2 * PAD) + 3}
        y={PAD + 4}
        className="text-[7px] font-mono fill-muted-foreground"
      >
        GELU(x)
      </text>
    </svg>
  );
}

function Vec({ dim, active }: { dim: number; active: boolean }) {
  // 把 dim 用色块条形可视化（按比例缩短）
  const cells = Math.min(40, Math.round(dim / 16));
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="font-mono text-xs text-muted-foreground">
        dim = {dim}
      </div>
      <div className="flex gap-px">
        {Array.from({ length: cells }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: active ? 1 : 0.4,
              backgroundColor: active
                ? `hsl(${260 + (i % 8) * 5}, 70%, ${50 + (i % 5) * 5}%)`
                : `hsl(0, 0%, 60%)`,
            }}
            transition={{ duration: 0.3, delay: i * 0.005 }}
            className="w-1.5 h-6 rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}

export function FFNExpansion() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIdx((s) => (s + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const current = STEPS[stepIdx];

  return (
    <VisualFrame title="FFN：128 → 512 → 128，先扩张腾出空间，过 GELU 非线性，再压回原尺寸">
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setStepIdx(i)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded border transition-all",
                  stepIdx === i
                    ? "border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <div className="font-mono text-xs font-semibold">
                  {s.label}
                </div>
                <Vec dim={s.dim} active={stepIdx === i} />
              </button>
              {i < STEPS.length - 1 && (
                <span className="text-muted-foreground/60 font-mono">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-xs font-mono text-muted-foreground max-w-md text-center"
        >
          <span className="text-foreground font-semibold">{current.label}</span>
          ：{current.desc}
        </motion.div>

        {current.id === "act" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1 mt-2"
          >
            <GeluCurve />
            <div className="font-mono text-xs text-muted-foreground">
              GELU(x) = x · Φ(x)，负值平滑衰减，不会直接截断为 0
            </div>
          </motion.div>
        )}
      </div>
    </VisualFrame>
  );
}
