"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 03 — NormalizationMerge：三路召回分数归一化合并
// =============================================================================

const CHANNELS = [
  {
    name: "热门召回",
    en: "popular",
    color: "#059669",
    borderClass: "border-emerald-600 dark:border-emerald-500",
    textClass: "text-emerald-800 dark:text-emerald-200",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    weight: 0.2,
    rawLabel: "评分人数",
    rawUnit: "人",
  },
  {
    name: "类型召回",
    en: "genre",
    color: "#10b981",
    borderClass: "border-emerald-500 dark:border-emerald-400",
    textClass: "text-emerald-700 dark:text-emerald-300",
    bgClass: "bg-emerald-50/80 dark:bg-emerald-950/25",
    weight: 0.3,
    rawLabel: "类型权重×均分",
    rawUnit: "",
  },
  {
    name: "ItemCF",
    en: "itemcf",
    color: "#34d399",
    borderClass: "border-emerald-400 dark:border-emerald-300",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50/60 dark:bg-emerald-950/20",
    weight: 0.5,
    rawLabel: "相似度累加",
    rawUnit: "",
  },
];

// 五部候选电影，各渠道的原始分（量纲差异很大）
const MOVIES = [
  {
    name: "肖申克的救赎",
    raw: [3100, 8.9, 2.4],
    norm: [0.92, 0.96, 0.88],
  },
  {
    name: "搏击俱乐部",
    raw: [2400, 7.2, 1.8],
    norm: [0.68, 0.68, 0.62],
  },
  {
    name: "美丽心灵",
    raw: [1200, 8.2, 0.9],
    norm: [0.28, 0.84, 0.28],
  },
  {
    name: "黑暗骑士",
    raw: [2900, 6.5, 2.1],
    norm: [0.85, 0.58, 0.74],
  },
  {
    name: "辛德勒名单",
    raw: [1800, 9.0, 1.5],
    norm: [0.45, 0.98, 0.50],
  },
];

type Phase = "raw" | "normalized" | "merged";

function mergedScore(m: typeof MOVIES[number]) {
  return CHANNELS.reduce((sum, ch, ci) => sum + ch.weight * m.norm[ci], 0);
}

export function NormalizationMerge() {
  const [phase, setPhase] = useState<Phase>("raw");

  useEffect(() => {
    const phases: Phase[] = ["raw", "normalized", "merged", "raw"];
    let i = 0;
    const delays = [2000, 2200, 2400];
    let timer: ReturnType<typeof setTimeout>;

    function next() {
      i = (i + 1) % (phases.length - 1);
      setPhase(phases[i]);
      timer = setTimeout(next, delays[i] ?? 2200);
    }

    timer = setTimeout(next, delays[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VisualFrame title="归一化合并：消除量纲差异，按权重融合三路分数">
      <div className="flex flex-col gap-4">
        {/* 阶段指示 */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {(["raw", "normalized", "merged"] as Phase[]).map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/50">→</span>}
              <span
                className={cn(
                  "px-2 py-0.5 rounded transition-colors",
                  phase === p
                    ? "bg-emerald-600 dark:bg-emerald-400 text-white dark:text-emerald-950 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {p === "raw" ? "原始分" : p === "normalized" ? "归一化" : "加权合并"}
              </span>
            </div>
          ))}
        </div>

        {/* 表头 */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
          <div className="w-24 shrink-0">电影</div>
          {phase !== "merged" &&
            CHANNELS.map((ch) => (
              <div key={ch.en} className={cn("flex-1 text-center", ch.textClass)}>
                {phase === "raw" ? ch.rawLabel : ch.name}
              </div>
            ))}
          {phase === "merged" && (
            <div className="flex-1 text-center text-emerald-600 dark:text-emerald-400 font-medium">
              merged_score
            </div>
          )}
        </div>

        {/* 数据行 */}
        <div className="space-y-2">
          {MOVIES.map((movie) => {
            const ms = mergedScore(movie);
            return (
              <div key={movie.name} className="flex items-center gap-2 min-h-9">
                <div className="w-24 shrink-0 text-xs font-mono text-foreground/80 truncate">
                  {movie.name}
                </div>

                {phase === "raw" &&
                  movie.raw.map((v, ci) => (
                    <div key={ci} className="flex-1 text-center">
                      <span
                        className={cn("font-mono text-xs tabular-nums", CHANNELS[ci].textClass)}
                      >
                        {v.toLocaleString()}
                        {CHANNELS[ci].rawUnit}
                      </span>
                    </div>
                  ))}

                {phase === "normalized" &&
                  movie.norm.map((v, ci) => (
                    <div key={ci} className="flex-1 flex flex-col gap-0.5">
                      <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${v * 100}%` }}
                          transition={{ duration: 0.5, delay: ci * 0.08 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: CHANNELS[ci].color }}
                        />
                      </div>
                      <div className={cn("text-[10px] font-mono text-center tabular-nums", CHANNELS[ci].textClass)}>
                        {v.toFixed(2)}
                      </div>
                    </div>
                  ))}

                {phase === "merged" && (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ms * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                      />
                    </div>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 tabular-nums w-10 text-right">
                      {ms.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 权重说明：始终占位，避免出现时撑高布局 */}
        <motion.div
          animate={{ opacity: phase === "merged" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-mono text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 min-h-5"
        >
          {CHANNELS.map((ch) => (
            <span key={ch.en}>
              <span className={ch.textClass}>{ch.name}</span>
              {" × "}
              <span className="text-foreground/70">{ch.weight}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </VisualFrame>
  );
}
