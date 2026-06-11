"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 01 — RecallParallel：三路并行召回 → 合并去重
// =============================================================================

const CHANNELS = [
  {
    name: "热门召回",
    shortName: "热门",
    desc: "评分人数 × 均分，覆盖冷启动",
    movies: ["肖申克的救赎", "教父", "黑暗骑士", "指环王", "千与千寻"],
  },
  {
    name: "类型偏好召回",
    shortName: "类型",
    desc: "类型权重 × 均分，按历史偏好筛选",
    movies: ["低俗小说", "搏击俱乐部", "美丽心灵", "心灵捕手", "楚门的世界"],
  },
  {
    name: "ItemCF 召回",
    shortName: "ItemCF",
    desc: "物品协同过滤，按共现相似度查表",
    movies: ["美国往事", "辛德勒名单", "勇敢的心", "泰坦尼克号", "阿甘正传"],
  },
] as const;

const MERGED = [
  "肖申克的救赎", "教父", "黑暗骑士", "美丽心灵",
  "搏击俱乐部", "楚门的世界", "辛德勒名单",
  "阿甘正传", "千与千寻", "泰坦尼克号",
];

type Phase = "recall" | "merging" | "done";

function shortMovieName(name: string) {
  const shorts: Record<string, string> = {
    肖申克的救赎: "肖申克",
    辛德勒名单: "辛德勒",
    泰坦尼克号: "泰坦尼克",
    楚门的世界: "楚门",
    搏击俱乐部: "搏击",
    美丽心灵: "美丽心灵",
  };
  return shorts[name] ?? name;
}

export function RecallParallel() {
  const [phase, setPhase] = useState<Phase>("recall");
  const [mergedVisible, setMergedVisible] = useState(0);

  useEffect(() => {
    const seq: Array<[Phase, number, number]> = [
      ["recall", 0, 1800],
      ["merging", 4, 400],
      ["merging", 7, 400],
      ["merging", 10, 400],
      ["done", 10, 2400],
    ];

    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      const [p, mv, delay] = seq[idx];
      setPhase(p);
      if (p === "merging" || p === "done") {
        setMergedVisible(mv);
      } else {
        setMergedVisible(0);
      }
      idx = (idx + 1) % seq.length;
      timer = setTimeout(step, delay);
    }

    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, []);

  const showMerge = phase === "merging" || phase === "done";

  return (
    <VisualFrame
      title="三路并行召回：各取 40 部候选，合并去重至 ~50 部"
      className="p-3 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* 三路并行：小屏横滑，大屏三列 */}
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHANNELS.map((ch, ci) => (
            <motion.div
              key={ch.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: ci * 0.1 }}
              className={cn(
                "min-w-38 w-[42vw] max-w-44 shrink-0 snap-center sm:min-w-0 sm:w-auto sm:max-w-none",
                "rounded-md border px-2.5 py-2.5 sm:px-3 sm:py-3 transition-colors duration-500 flex flex-col",
                phase === "recall"
                  ? "border-emerald-300/80 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/20"
                  : "border-neutral-200 dark:border-neutral-800 opacity-60",
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium mb-0.5 sm:mb-1 transition-colors duration-500",
                  phase === "recall"
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-neutral-500",
                )}
              >
                <span className="sm:hidden">{ch.shortName}</span>
                <span className="hidden sm:inline">{ch.name}</span>
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-mono mb-2 leading-snug line-clamp-2 min-h-[2lh]">
                {ch.desc}
              </div>
              <div className="space-y-0.5 sm:space-y-1 flex-1">
                {ch.movies.map((m, mi) => (
                  <div
                    key={m}
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] sm:text-xs font-mono pl-0.5 sm:pl-1 transition-colors duration-500",
                      mi >= 3 && "hidden sm:flex",
                      phase === "recall"
                        ? "text-foreground/80"
                        : "text-neutral-400",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full shrink-0 transition-colors duration-500",
                        phase === "recall"
                          ? "bg-emerald-400 dark:bg-emerald-500"
                          : "bg-neutral-300 dark:bg-neutral-700",
                      )}
                    />
                    <span className="truncate">
                      <span className="sm:hidden">{shortMovieName(m)}</span>
                      <span className="hidden sm:inline">{m}</span>
                    </span>
                  </div>
                ))}
                <div className="text-[10px] sm:text-xs font-mono text-muted-foreground/70 pl-2.5 sm:hidden">
                  …等 40 部
                </div>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-muted-foreground mt-2 tabular-nums hidden sm:block">
                共 40 部候选
              </div>
            </motion.div>
          ))}
        </div>

        {/* 汇聚箭头 */}
        <div className="flex justify-center py-0.5">
          <MergeArrows active={showMerge} />
        </div>

        {/* 合并去重结果 */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={showMerge ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "rounded-md border px-2.5 py-2.5 sm:px-3 sm:py-3 transition-colors duration-500",
            showMerge
              ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : "border-neutral-200 dark:border-neutral-800",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "text-xs font-medium transition-colors duration-500",
                showMerge
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-muted-foreground",
              )}
            >
              合并去重
            </span>
            <span
              className={cn(
                "text-xs font-mono tabular-nums transition-colors duration-500",
                showMerge
                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-muted-foreground",
              )}
            >
              {showMerge ? "~50 部" : "—"}
            </span>
          </div>
          <div className="min-h-12 sm:min-h-14 flex items-start">
            {mergedVisible === 0 ? (
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/40">
                等待三路召回完成
              </span>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <AnimatePresence mode="popLayout">
                  {MERGED.slice(0, mergedVisible).map((m, i) => (
                    <motion.span
                      key={m}
                      layout
                      initial={{ opacity: 0, scale: 0.85, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -4 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className="inline-flex items-center justify-center text-[10px] sm:text-xs font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border leading-none border-emerald-300/80 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 max-w-full truncate"
                    >
                      <span className="sm:hidden">{shortMovieName(m)}</span>
                      <span className="hidden sm:inline">{m}</span>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

function MergeArrows({ active }: { active: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 36"
      className={cn(
        "w-28 sm:w-48 h-auto transition-colors duration-500",
        active ? "text-emerald-500 dark:text-emerald-400" : "text-neutral-300 dark:text-neutral-700",
      )}
    >
      <path
        d="M33 2 L33 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 2 L100 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M167 2 L167 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <motion.line
        x1="33"
        y1="18"
        x2="167"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.4, delay: active ? 0.15 : 0 }}
      />
      <motion.path
        d="M100 18 L100 32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: active ? 0.35 : 0 }}
      />
      <motion.path
        d="M95 27 L100 32 L105 27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: active ? 0.5 : 0 }}
      />
    </motion.svg>
  );
}
