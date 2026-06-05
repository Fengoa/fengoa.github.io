"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 02 — ItemCFSimilarity：物品协同过滤相似度矩阵
// 高亮"当前电影 → 最相似电影"的共现权重
// =============================================================================

const MOVIES = ["肖申克", "教父", "黑骑士", "搏击俱乐部", "美丽心灵", "指环王"];

// 基于类型相似度手工构造的共现权重矩阵（对称）
const RAW: number[][] = [
  [1.00, 0.55, 0.38, 0.28, 0.60, 0.22],
  [1.00, 1.00, 0.45, 0.62, 0.40, 0.18],
  [1.00, 1.00, 1.00, 0.72, 0.25, 0.50],
  [1.00, 1.00, 1.00, 1.00, 0.20, 0.30],
  [1.00, 1.00, 1.00, 1.00, 1.00, 0.15],
  [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
];

// 补全下三角
const MATRIX = RAW.map((row, r) =>
  row.map((v, c) => (c < r ? RAW[c][r] : v))
);

export function ItemCFSimilarity() {
  const N = MOVIES.length;
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRow((r) => (r + 1) % N);
    }, 2000);
    return () => clearInterval(timer);
  }, [N]);

  const topSim = useMemo(() => {
    return MATRIX[activeRow]
      .map((v, i) => ({ movie: MOVIES[i], sim: v, i }))
      .filter((x) => x.i !== activeRow)
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 3);
  }, [activeRow]);

  return (
    <VisualFrame title="ItemCF：共现用户越多，物品相似度越高">
      <div className="flex flex-col items-center gap-5">
        {/* 说明 */}
        <div className="text-xs font-mono text-muted-foreground text-center">
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
            {MOVIES[activeRow]}
          </span>{" "}
          → 相似物品检索
        </div>

        {/* 当前行相似度条形 */}
        <div className="w-full max-w-md">
          <div className="flex items-end gap-1.5 h-14 px-4">
            {MATRIX[activeRow].map((sim, c) => (
              <div
                key={`bar-${activeRow}-${c}`}
                className="flex-1 flex flex-col items-center justify-end"
              >
                {c !== activeRow && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, sim * 80)}%` }}
                    transition={{ duration: 0.45, delay: c * 0.04 }}
                    className={cn(
                      "w-full rounded-t",
                      sim > 0.5
                        ? "bg-emerald-600 dark:bg-emerald-400"
                        : sim > 0.3
                        ? "bg-emerald-400 dark:bg-emerald-600"
                        : "bg-neutral-200 dark:bg-neutral-800"
                    )}
                  />
                )}
                {c === activeRow && (
                  <div className="w-full rounded-t bg-neutral-100 dark:bg-neutral-900" style={{ height: "100%" }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 px-4 mt-1">
            {MOVIES.map((m, i) => (
              <div
                key={`label-${i}`}
                className={cn(
                  "flex-1 text-center font-mono text-[10px] transition-colors leading-tight",
                  i === activeRow
                    ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                    : MATRIX[activeRow][i] > 0.5
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground/60"
                )}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* 热力矩阵 */}
        <div className="w-full max-w-sm">
          {/* 列头 */}
          <div className="flex pl-14">
            {MOVIES.map((m, i) => (
              <div
                key={`col-${i}`}
                className={cn(
                  "flex-1 text-[10px] font-mono text-center leading-none py-1 transition-colors",
                  topSim[0]?.i === i
                    ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-muted-foreground/50"
                )}
              >
                {m.slice(0, 2)}
              </div>
            ))}
          </div>
          {/* 矩阵行 */}
          {MATRIX.map((row, r) => (
            <div key={`row-${r}`} className="flex items-center">
              <div
                className={cn(
                  "w-14 text-[10px] font-mono text-right pr-2 shrink-0 leading-none py-0.5 transition-colors",
                  r === activeRow
                    ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-muted-foreground/50"
                )}
              >
                {MOVIES[r]}
              </div>
              <div
                className={cn(
                  "flex flex-1 gap-px transition-all",
                  r === activeRow && "ring-2 ring-emerald-500 dark:ring-emerald-400"
                )}
              >
                {row.map((sim, c) => {
                  const isActive = r === activeRow;
                  const isSelf = r === c;
                  const alpha = isSelf ? 0.12 : isActive ? Math.min(1, Math.pow(sim, 0.6)) : Math.min(0.7, Math.pow(sim, 0.6) * 0.8);
                  return (
                    <div
                      key={`cell-${r}-${c}`}
                      className="flex-1 aspect-square transition-colors"
                      style={{
                        backgroundColor: isSelf
                          ? "rgba(100,100,100,0.12)"
                          : `rgba(16, 185, 129, ${alpha.toFixed(3)})`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Top 相似电影 */}
        <div className="flex items-center gap-2 text-xs font-mono flex-wrap justify-center">
          <span className="text-muted-foreground">相似度 Top 3：</span>
          {topSim.map((t, i) => (
            <div
              key={`${activeRow}-top-${i}`}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded border",
                i === 0
                  ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
              )}
            >
              <span className="font-semibold">{t.movie}</span>
              <span className="opacity-70">{(t.sim * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
