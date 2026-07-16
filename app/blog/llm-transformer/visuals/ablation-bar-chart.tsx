"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// AblationBarChart：消融实验的 val loss 柱状图 + hover 看训练曲线
// =============================================================================

type Variant = {
  key: string;
  name: string;
  finalLoss: number;
  delta: number; // 相对 baseline
  decay: number; // 越小越收敛慢
  baseline?: boolean;
  blurb: string;
};

const VARIANTS: Variant[] = [
  {
    key: "full",
    name: "完整 Transformer",
    finalLoss: 1.7,
    delta: 0,
    decay: 4.0,
    baseline: true,
    blurb: "残差 + LayerNorm + Attention + FFN 全在",
  },
  {
    key: "no-ffn",
    name: "去掉 FFN",
    finalLoss: 1.91,
    delta: 0.21,
    decay: 3.4,
    blurb: "缺少对 attention 输出做进一步非线性变换的模块",
  },
  {
    key: "no-residual",
    name: "去掉残差连接",
    finalLoss: 2.03,
    delta: 0.33,
    decay: 2.8,
    blurb: "深层信息被一层层覆盖，梯度难传",
  },
  {
    key: "no-pos",
    name: "去掉位置编码",
    finalLoss: 2.15,
    delta: 0.45,
    decay: 2.5,
    blurb: "模型分不出谁前谁后",
  },
  {
    key: "no-ln",
    name: "去掉 LayerNorm",
    finalLoss: 2.25,
    delta: 0.55,
    decay: 1.6,
    blurb: "数值幅度不可控，训练经常崩",
  },
];

const START_LOSS = 4.3;
const W = 380;
const H = 160;
const PAD = { l: 28, r: 12, t: 12, b: 24 };

function buildCurve(v: Variant) {
  const N = 60;
  const points: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const loss =
      v.finalLoss +
      (START_LOSS - v.finalLoss) * Math.exp(-v.decay * t) +
      Math.sin(t * 18 + v.decay) * 0.04 * (1 - t);
    const x = PAD.l + t * (W - PAD.l - PAD.r);
    const yMin = 1.4;
    const yMax = 4.5;
    const y =
      PAD.t + ((yMax - loss) / (yMax - yMin)) * (H - PAD.t - PAD.b);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function AblationBarChart() {
  const [hovered, setHovered] = useState<string | null>(null);
  const baseline = VARIANTS.find((v) => v.baseline)!;
  const maxLoss = Math.max(...VARIANTS.map((v) => v.finalLoss));
  const minLoss = Math.min(...VARIANTS.map((v) => v.finalLoss));

  return (
    <VisualFrame title="消融实验：逐一去掉一个组件，val loss 各自往上抬多少">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-stretch">
        {/* 柱状图 */}
        <div className="space-y-2">
          {VARIANTS.map((v) => {
            const isHover = hovered === v.key;
            const range = maxLoss - minLoss + 0.05;
            const filled = ((v.finalLoss - minLoss + 0.05) / range) * 100;
            return (
              <button
                key={v.key}
                onMouseEnter={() => setHovered(v.key)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "w-full grid grid-cols-[140px_1fr_60px] items-center gap-3 px-2 py-1.5 rounded transition-all text-left",
                  isHover && "bg-violet-50 dark:bg-violet-950/30"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs",
                    v.baseline
                      ? "text-violet-600 dark:text-violet-400 font-semibold"
                      : "text-foreground"
                  )}
                >
                  {v.name}
                </span>
                <div className="relative h-5 rounded bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${filled}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded",
                      v.baseline
                        ? "bg-violet-500 dark:bg-violet-400"
                        : "bg-amber-500/80 dark:bg-amber-400/80"
                    )}
                  />
                </div>
                <div className="text-right font-mono text-xs tabular-nums">
                  <span className="text-foreground">{v.finalLoss.toFixed(2)}</span>
                  {!v.baseline && (
                    <span className="ml-1 text-amber-600 dark:text-amber-400">
                      +{v.delta.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 训练曲线 */}
        <div className="lg:w-100 flex flex-col">
          <div className="text-xs font-mono text-muted-foreground mb-1 text-center">
            训练曲线
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* 网格 */}
            {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((v) => {
              const yMin = 1.4;
              const yMax = 4.5;
              const y =
                PAD.t + ((yMax - v) / (yMax - yMin)) * (H - PAD.t - PAD.b);
              return (
                <g key={v}>
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth={0.4}
                    strokeDasharray="2 2"
                  />
                  <text
                    x={PAD.l - 4}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[8px] font-mono fill-muted-foreground"
                  >
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* baseline 永远画 */}
            <path
              d={buildCurve(baseline)}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={1.6}
            />
            {/* hovered 单独画 */}
            {hovered && hovered !== baseline.key && (
              <path
                d={buildCurve(VARIANTS.find((v) => v.key === hovered)!)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={1.6}
              />
            )}
            <text
              x={W / 2}
              y={H - 4}
              textAnchor="middle"
              className="text-[9px] font-mono fill-muted-foreground"
            >
              training steps
            </text>
          </svg>
          <div className="mt-2 text-xs font-mono text-center text-muted-foreground min-h-10">
            {hovered ? (
              <>
                <span className="text-foreground">
                  {VARIANTS.find((v) => v.key === hovered)!.name}
                </span>
                ：{VARIANTS.find((v) => v.key === hovered)!.blurb}
              </>
            ) : (
              "鼠标移到任意一项，看它和 baseline 的训练曲线对比"
            )}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
