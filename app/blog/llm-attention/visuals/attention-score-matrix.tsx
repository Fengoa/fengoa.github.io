"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// AttentionScoreMatrix：4×4 注意力矩阵的三阶段切换
// raw scores → masked scores → softmax weights
// 点击行可以"高亮"该 query 看每个 key 的权重
// =============================================================================

const TOKENS = ["I", "am", "a", "cat"];

// 原始 scores（Q · K / sqrt(d)），来自原文示例
const RAW_SCORES: number[][] = [
  [-0.98, -0.26, -0.28, -0.35],
  [-0.34, 0.06, -0.15, -0.1],
  [1.03, 0.26, -0.13, 0.18],
  [0.26, 0.12, -0.1, 0.04],
];

const STAGES = [
  { key: "raw", label: "原始分数 Q·Kᵀ / √d", desc: "每对位置的匹配度，正负都有" },
  { key: "masked", label: "加因果 mask", desc: "未来位置设为 -∞，下一步 softmax 会变 0" },
  { key: "softmax", label: "softmax 后的权重", desc: "每行和为 1，就是注意力分配" },
] as const;

type Stage = (typeof STAGES)[number]["key"];

function applyMask(scores: number[][]): number[][] {
  return scores.map((row, i) =>
    row.map((v, j) => (j > i ? Number.NEGATIVE_INFINITY : v))
  );
}

function softmaxRow(row: number[]): number[] {
  const finite = row.filter((v) => Number.isFinite(v));
  const max = Math.max(...finite);
  const exps = row.map((v) => (Number.isFinite(v) ? Math.exp(v - max) : 0));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => (sum > 0 ? e / sum : 0));
}

function computeMatrix(stage: Stage): number[][] {
  if (stage === "raw") return RAW_SCORES;
  const masked = applyMask(RAW_SCORES);
  if (stage === "masked") return masked;
  return masked.map(softmaxRow);
}

function formatCell(v: number, stage: Stage): string {
  if (!Number.isFinite(v)) return "−∞";
  if (stage === "softmax") return v < 0.005 ? "0" : v.toFixed(2);
  return v.toFixed(2);
}

// 每个 stage 都把数值映射到 [0, 1] 来决定色块强度
function cellAlpha(v: number, row: number[], stage: Stage): number {
  if (!Number.isFinite(v)) return 0;
  if (stage === "softmax") return Math.min(1, v);
  // raw / masked：以本行有限值的 [min, max] 做归一
  const finite = row.filter((x) => Number.isFinite(x));
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (max === min) return 0.4;
  // 把负数也变成"低强度"，正数变高强度
  return Math.max(0.05, (v - min) / (max - min));
}

export function AttentionScoreMatrix() {
  const [stage, setStage] = useState<Stage>("raw");
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const matrix = computeMatrix(stage);

  return (
    <VisualFrame title="I am a cat：原始分数 → 加 mask → softmax 三步走">
      <div className="flex flex-col items-center gap-5">
        {/* 阶段切换 */}
        <div className="flex gap-1 rounded border border-neutral-200 dark:border-neutral-800 p-1 bg-neutral-50 dark:bg-neutral-900">
          {STAGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={cn(
                "px-3 py-1 rounded font-mono text-xs transition-colors",
                stage === s.key
                  ? "bg-violet-500 text-white dark:bg-violet-400 dark:text-neutral-900"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 当前阶段说明 */}
        <motion.div
          key={`desc-${stage}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-xs font-mono text-muted-foreground"
        >
          {STAGES.find((s) => s.key === stage)?.desc}
        </motion.div>

        {/* 矩阵本体 */}
        <div className="flex flex-col items-center">
          {/* 列头 */}
          <div className="flex items-end gap-1 mb-2">
            <div className="w-12 text-right font-mono text-xs text-muted-foreground pr-2">
              Q ＼ K
            </div>
            {TOKENS.map((tok) => (
              <div
                key={`col-${tok}`}
                className="w-14 text-center font-mono text-xs text-muted-foreground"
              >
                {tok}
              </div>
            ))}
          </div>

          {/* 行 */}
          {matrix.map((row, i) => {
            const isActive = activeRow === i;
            return (
              <button
                key={`row-${i}`}
                onClick={() =>
                  setActiveRow((prev) => (prev === i ? null : i))
                }
                className={cn(
                  "flex items-center gap-1 mb-1 rounded transition-all",
                  isActive && "ring-2 ring-violet-400/60"
                )}
              >
                <div
                  className={cn(
                    "w-12 text-right font-mono text-xs pr-2",
                    isActive
                      ? "text-violet-600 dark:text-violet-400 font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {TOKENS[i]}
                </div>
                {row.map((v, j) => {
                  const alpha = cellAlpha(v, row, stage);
                  const masked = !Number.isFinite(v);
                  return (
                    <motion.div
                      key={`cell-${stage}-${i}-${j}`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: j * 0.03 }}
                      className={cn(
                        "w-14 h-10 flex items-center justify-center rounded font-mono text-xs border",
                        masked
                          ? "border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-muted-foreground/50"
                          : "border-transparent text-foreground"
                      )}
                      style={
                        masked
                          ? undefined
                          : {
                              backgroundColor: `rgba(139, 92, 246, ${alpha.toFixed(3)})`,
                            }
                      }
                    >
                      {formatCell(v, stage)}
                    </motion.div>
                  );
                })}
              </button>
            );
          })}
        </div>

        {/* 行说明 */}
        <div className="text-xs font-mono text-muted-foreground text-center max-w-md leading-relaxed">
          {activeRow === null
            ? "点击任意一行，看 Q[i] 对每个 K[j] 的关注情况"
            : stage === "softmax"
              ? `${TOKENS[activeRow]} 把注意力按上面权重分给前面的 token`
              : `${TOKENS[activeRow]} 的 query 与各 key 的匹配分数`}
        </div>
      </div>
    </VisualFrame>
  );
}
