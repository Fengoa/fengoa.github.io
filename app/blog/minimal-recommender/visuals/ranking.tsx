"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 04 — RankingComparison：精排前后排名变化
// =============================================================================

const RECALL_ORDER = [
  { name: "Raiders of the Lost Ark", recallRank: 1, finalRank: 2, avgRating: 8.5, ratingCount: 180 },
  { name: "Shawshank Redemption", recallRank: 2, finalRank: 1, avgRating: 9.1, ratingCount: 310 },
  { name: "The Godfather", recallRank: 3, finalRank: 3, avgRating: 9.2, ratingCount: 240 },
  { name: "Pulp Fiction", recallRank: 4, finalRank: 4, avgRating: 8.8, ratingCount: 170 },
  { name: "Godfather: Part II", recallRank: 6, finalRank: 5, avgRating: 8.7, ratingCount: 210 },
];

const FINAL_ORDER = [...RECALL_ORDER].sort((a, b) => a.finalRank - b.finalRank);

type View = "recall" | "final";

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function RankingComparison() {
  const [view, setView] = useState<View>("recall");

  useEffect(() => {
    const timer = setInterval(() => {
      setView((v) => (v === "recall" ? "final" : "recall"));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const list = view === "recall"
    ? [...RECALL_ORDER].sort((a, b) => a.recallRank - b.recallRank)
    : FINAL_ORDER;

  return (
    <VisualFrame title="精排：引入物品质量信号后的排名变化">
      <div className="flex flex-col gap-4">
        {/* 切换标签 */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {(["recall", "final"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1 rounded border transition-all",
                view === v
                  ? "border-emerald-500 dark:border-emerald-400 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-emerald-950"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "recall" ? "召回排序" : "精排后"}
            </button>
          ))}
          <span className="text-muted-foreground/60 ml-1 hidden sm:inline">
            {view === "recall"
              ? "仅按召回置信度排序"
              : "叠加均分与评分人数"}
          </span>
        </div>

        {/* 排名列表 */}
        <div className="space-y-2 min-h-75">
          <AnimatePresence mode="popLayout">
            {list.map((movie, i) => {
              const rank = view === "recall" ? movie.recallRank : movie.finalRank;
              const rankChange = movie.recallRank - movie.finalRank;
              const isUp = rankChange > 0;
              const isDown = rankChange < 0;

              return (
                <motion.div
                  key={movie.name}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md border transition-colors",
                    rank === 1
                      ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-neutral-100 dark:border-neutral-900"
                  )}
                >
                  {/* 排名 */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold shrink-0",
                      rank === 1
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-100 dark:bg-neutral-900 text-muted-foreground"
                    )}
                  >
                    {rank}
                  </div>

                  {/* 电影名 + 指标 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate">{movie.name}</span>
                      {/* 排名变化指示（精排后才显示） */}
                      {view === "final" && rankChange !== 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-mono shrink-0",
                            isUp ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"
                          )}
                        >
                          {isUp ? `↑${rankChange}` : `↓${Math.abs(rankChange)}`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0">
                          均分
                        </span>
                        <ScoreBar value={movie.avgRating} max={10} color="#10b981" />
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tabular-nums w-6 shrink-0">
                          {movie.avgRating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-mono text-muted-foreground w-10 shrink-0">
                          热度
                        </span>
                        <ScoreBar value={movie.ratingCount} max={320} color="#34d399" />
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tabular-nums w-8 shrink-0">
                          {movie.ratingCount}万
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 公式说明：固定最小高度，避免两行/单行切换时跳动 */}
        <div className="text-xs font-mono text-muted-foreground border-t border-neutral-100 dark:border-neutral-900 pt-3 min-h-9">
          {view === "recall" ? (
            <span>排序依据：召回置信度（recall_score_norm）</span>
          ) : (
            <span>
              <span className="text-emerald-600 dark:text-emerald-400">final</span>
              {" = 0.5 × recall + "}
              <span className="text-emerald-600 dark:text-emerald-400">0.3 × avg_rating</span>
              {" + 0.2 × popularity"}
            </span>
          )}
        </div>
      </div>
    </VisualFrame>
  );
}
