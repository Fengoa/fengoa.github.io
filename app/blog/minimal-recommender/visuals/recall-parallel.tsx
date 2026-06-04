"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 01 — RecallParallel：三路召回并行流程
// =============================================================================

const CHANNELS = [
  {
    name: "热门召回",
    en: "popular",
    color: "border-orange-400 dark:border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-400",
    movies: ["肖申克的救赎", "教父", "黑暗骑士", "指环王", "千与千寻"],
    desc: "评分人数 × 均分",
  },
  {
    name: "类型偏好召回",
    en: "genre",
    color: "border-cyan-400 dark:border-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-400",
    movies: ["低俗小说", "搏击俱乐部", "美丽心灵", "心灵捕手", "楚门的世界"],
    desc: "用户类型权重 × 均分",
  },
  {
    name: "ItemCF 召回",
    en: "itemcf",
    color: "border-violet-400 dark:border-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
    movies: ["美国往事", "辛德勒名单", "勇敢的心", "泰坦尼克号", "阿甘正传"],
    desc: "协同过滤相似度",
  },
];

const MERGED = ["肖申克的救赎", "教父", "黑暗骑士", "美丽心灵", "搏击俱乐部", "楚门的世界", "辛德勒名单", "美国往事", "阿甘正传", "千与千寻"];

type Phase = "recall" | "merge" | "done";

export function RecallParallel() {
  const [phase, setPhase] = useState<Phase>("recall");
  const [visibleMovies, setVisibleMovies] = useState<number>(0);
  const [mergedCount, setMergedCount] = useState(0);

  useEffect(() => {
    const seq: Array<[Phase, number, number, number]> = [
      ["recall", 0, 0, 400],
      ["recall", 1, 0, 400],
      ["recall", 2, 0, 400],
      ["recall", 3, 0, 400],
      ["recall", 4, 0, 600],
      ["merge", 0, 0, 300],
      ["merge", 0, 3, 200],
      ["merge", 0, 6, 200],
      ["merge", 0, 10, 800],
      ["done", 0, 10, 2000],
    ];

    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      const [p, mv, mg, delay] = seq[idx];
      setPhase(p);
      if (p === "recall") setVisibleMovies(mv + 1);
      if (p === "merge" || p === "done") setMergedCount(mg);
      idx = (idx + 1) % seq.length;
      if (idx === 0) {
        setVisibleMovies(0);
        setMergedCount(0);
      }
      timer = setTimeout(step, delay);
    }

    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VisualFrame title="三路召回并行：各取 40 部候选，合并去重到 50 部左右">
      <div className="flex flex-col gap-4">
        {/* 三路并行 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CHANNELS.map((ch, ci) => (
            <div
              key={ch.en}
              className={cn(
                "rounded-md border px-3 py-3 transition-all duration-500",
                phase !== "recall" || visibleMovies > 0
                  ? cn(ch.color, ch.bg)
                  : "border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div className={cn("text-xs font-medium mb-0.5 transition-colors", ch.text)}>
                {ch.name}
              </div>
              <div className="text-xs font-mono text-muted-foreground mb-2">
                {ch.desc}
              </div>
              <div className="space-y-1 min-h-32.5">
                {ch.movies.slice(0, phase === "recall" ? visibleMovies : 5).map((m, mi) => (
                  <motion.div
                    key={`${ch.en}-${mi}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: mi * 0.04 }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-mono px-1.5 py-0.5 rounded",
                      mi === 0 ? cn(ch.bg, ch.text) : "text-muted-foreground"
                    )}
                  >
                    <span className={cn("w-1 h-1 rounded-full shrink-0", mi === 0 ? ch.dot : "bg-neutral-300 dark:bg-neutral-700")} />
                    {m}
                  </motion.div>
                ))}
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-2 tabular-nums">
                候选 40 部
              </div>
            </div>
          ))}
        </div>

        {/* 箭头 + 合并区 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex justify-center gap-6">
            {CHANNELS.map((ch) => (
              <svg key={ch.en} width="2" height="24" className={cn("transition-opacity duration-500", mergedCount > 0 ? "opacity-100" : "opacity-30")}>
                <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" className={ch.text} />
              </svg>
            ))}
          </div>
        </div>

        {/* 合并去重结果 */}
        <div
          className={cn(
            "rounded-md border px-3 py-3 transition-all duration-500",
            mergedCount > 0
              ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : "border-neutral-200 dark:border-neutral-800"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              合并去重
            </span>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {mergedCount > 0 ? `${mergedCount} 部` : "—"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-13">
            <AnimatePresence>
              {MERGED.slice(0, mergedCount).map((m, i) => (
                <motion.span
                  key={m}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="text-xs font-mono px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20"
                >
                  {m}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
