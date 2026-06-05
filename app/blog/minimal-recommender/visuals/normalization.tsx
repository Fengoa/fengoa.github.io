"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 归一化合并 — 三阶段：量纲差异 → 逐路归一化 → 加权合并
// =============================================================================

const CHANNELS = [
  {
    id: "popular" as const,
    name: "热门召回",
    weight: 0.2,
    rawLabel: "评分人数",
    unit: "",
    color: "#059669",
    textClass: "text-emerald-800 dark:text-emerald-200",
  },
  {
    id: "genre" as const,
    name: "类型召回",
    weight: 0.3,
    rawLabel: "权重×均分",
    unit: "",
    color: "#10b981",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "itemcf" as const,
    name: "ItemCF",
    weight: 0.5,
    rawLabel: "相似度累加",
    unit: "",
    color: "#34d399",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
] as const;

const MOVIES = [
  { name: "肖申克的救赎", raw: [3100, 8.9, 2.4] },
  { name: "搏击俱乐部", raw: [2400, 7.2, 1.8] },
  { name: "美丽心灵", raw: [1200, 8.2, 0.9] },
  { name: "黑暗骑士", raw: [2900, 6.5, 2.1] },
  { name: "辛德勒名单", raw: [1800, 9.0, 1.5] },
] as const;

const SPOTLIGHT = "黑暗骑士";

const PHASES = [
  { id: "problem" as const, label: "① 量纲不同" },
  { id: "normalize" as const, label: "② 归一化" },
  { id: "merge" as const, label: "③ 加权合并" },
] as const;

type Phase = (typeof PHASES)[number]["id"];

const PHASE_DELAYS: Record<Phase, number> = {
  problem: 2800,
  normalize: 3200,
  merge: 3000,
};

const PHASE_ORDER: Phase[] = ["problem", "normalize", "merge"];

type MovieRow = {
  name: string;
  raw: readonly [number, number, number];
  norm: [number, number, number];
  merged: number;
};

function channelBounds(ci: number) {
  const vals = MOVIES.map((m) => m.raw[ci]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return { min, max, range: max - min || 1 };
}

function normalizeRaw(raw: number, min: number, max: number) {
  const range = max - min;
  return range === 0 ? 1 : (raw - min) / range;
}

function extremumMovies(ci: number) {
  let minMovie: (typeof MOVIES)[number] = MOVIES[0];
  let maxMovie: (typeof MOVIES)[number] = MOVIES[0];
  for (const m of MOVIES) {
    if (m.raw[ci] < minMovie.raw[ci]) minMovie = m;
    if (m.raw[ci] > maxMovie.raw[ci]) maxMovie = m;
  }
  return { minMovie, maxMovie };
}

function buildRows(): MovieRow[] {
  const bounds = CHANNELS.map((_, ci) => channelBounds(ci));

  return MOVIES.map((movie) => {
    const norm = movie.raw.map((raw, ci) =>
      normalizeRaw(raw, bounds[ci].min, bounds[ci].max),
    ) as [number, number, number];

    const merged = CHANNELS.reduce(
      (sum, ch, ci) => sum + ch.weight * norm[ci],
      0,
    );

    return { ...movie, norm, merged };
  });
}

export function NormalizationMerge() {
  const [phase, setPhase] = useState<Phase>("problem");
  const [paused, setPaused] = useState(false);

  const rows = useMemo(() => buildRows(), []);
  const bounds = useMemo(() => CHANNELS.map((_, ci) => channelBounds(ci)), []);
  const spotlight = rows.find((m) => m.name === SPOTLIGHT)!;

  const naiveSum = spotlight.raw.reduce((a, b) => a + b, 0);
  const popularShare = ((spotlight.raw[0] / naiveSum) * 100).toFixed(1);

  const ranked = useMemo(
    () => [...rows].sort((a, b) => b.merged - a.merged),
    [rows],
  );

  useEffect(() => {
    if (paused) return;

    let idx = PHASE_ORDER.indexOf(phase);
    let timer: ReturnType<typeof setTimeout>;

    function next() {
      idx = (idx + 1) % PHASE_ORDER.length;
      setPhase(PHASE_ORDER[idx]);
      timer = setTimeout(next, PHASE_DELAYS[PHASE_ORDER[idx]]);
    }

    timer = setTimeout(next, PHASE_DELAYS[phase]);
    return () => clearTimeout(timer);
  }, [paused, phase]);

  return (
    <VisualFrame title="归一化合并：量纲对齐后，按权重融合三路分数">
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        {/* 阶段指示 */}
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs font-mono">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/40">→</span>}
              <span
                className={cn(
                  "px-2 py-0.5 rounded transition-colors duration-300 cursor-pointer select-none",
                  phase === p.id
                    ? "bg-emerald-600 dark:bg-emerald-400 text-white dark:text-emerald-950 font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onMouseEnter={() => {
                  setPhase(p.id);
                  setPaused(true);
                }}
                onMouseLeave={() => setPaused(false)}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* 主内容：固定高度，三阶段切换时不跳动 */}
        <div className="h-[400px] rounded-md border border-emerald-300/80 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "problem" && (
              <PhasePanel key="problem">
                <PanelTitle>
                  以《{SPOTLIGHT}》为例：三路原始分量纲悬殊，不能直接相加
                </PanelTitle>

                <div className="mt-3 flex-1 flex flex-col justify-center space-y-3">
                  {CHANNELS.map((ch, ci) => {
                    const raw = spotlight.raw[ci];
                    const { max } = bounds[ci];
                    const pct = (raw / max) * 100;

                    return (
                      <div key={ch.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={cn("font-medium", ch.textClass)}>
                            {ch.name}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            {ch.rawLabel} = {raw.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, delay: ci * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: ch.color }}
                          />
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/70 text-right tabular-nums">
                          该路范围 0 ~ {max.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 shrink-0 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2.5 text-xs font-mono leading-relaxed">
                  <span className="text-muted-foreground">直接相加 </span>
                  <span className="text-foreground/80 tabular-nums">
                    {spotlight.raw[0]} + {spotlight.raw[1]} + {spotlight.raw[2]} ={" "}
                    {naiveSum.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">，其中热门占 </span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums">
                    {popularShare}%
                  </span>
                </div>
              </PhasePanel>
            )}

            {phase === "normalize" && (
              <PhasePanel key="normalize">
                <PanelTitle>
                  每路独立归一化：该路最低 → 0，最高 → 1
                </PanelTitle>

                <div className="mt-3 flex-1 flex flex-col justify-between gap-2 min-h-0">
                  {CHANNELS.map((ch, ci) => {
                    const { min, max } = bounds[ci];
                    const raw = spotlight.raw[ci];
                    const norm = spotlight.norm[ci];
                    const { minMovie, maxMovie } = extremumMovies(ci);
                    const isMax = raw === max;
                    const isMin = raw === min;

                    return (
                      <div
                        key={ch.id}
                        className="flex-1 min-h-0 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/30 px-3 py-2 flex flex-col justify-center"
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className={cn("font-medium", ch.textClass)}>
                            {ch.name}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            min={min.toLocaleString()} max={max.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-center text-foreground/80 tabular-nums mb-0.5">
                          ({raw.toLocaleString()} − {min.toLocaleString()}) ÷ (
                          {max.toLocaleString()} − {min.toLocaleString()}) ={" "}
                          <span className={cn("font-semibold", ch.textClass)}>
                            {norm.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground text-center mb-1 leading-relaxed">
                          {isMax
                            ? `《${SPOTLIGHT}》为该路最高分，归一化后恒为 1`
                            : isMin
                              ? `《${SPOTLIGHT}》为该路最低分（${raw}），归一化后为 0`
                              : `该路最高为《${maxMovie.name}》（${maxMovie.raw[ci]}）`}
                        </p>

                        {/* 该路 5 部电影在 0~1 轴上的位置 */}
                        <div className="relative h-3 rounded-full bg-neutral-100 dark:bg-neutral-900">
                          {rows.map((m) => {
                            const v = m.norm[ci];
                            const isSpot = m.name === SPOTLIGHT;
                            return (
                              <div
                                key={m.name}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                                style={{ left: `${v * 100}%` }}
                              >
                                <div
                                  className={cn(
                                    "rounded-full",
                                    isSpot
                                      ? "w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 ring-2 ring-white dark:ring-neutral-950"
                                      : "w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600",
                                  )}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60 mt-0.5">
                          <span className="truncate max-w-[38%]">
                            0 ← {minMovie.name}
                          </span>
                          <span className="truncate max-w-[38%] text-right">
                            {maxMovie.name} → 1
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PhasePanel>
            )}

            {phase === "merge" && (
              <PhasePanel key="merge">
                <PanelTitle>三路归一化分数处于同一量纲，按权重加权求和</PanelTitle>

                {/* 展开计算 */}
                <div className="mt-3 shrink-0 rounded-md border border-emerald-300/60 dark:border-emerald-700/60 bg-white/60 dark:bg-neutral-950/40 px-3 py-2.5">
                  <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-medium mb-2">
                    《{SPOTLIGHT}》
                  </div>
                  <div className="space-y-1">
                    {CHANNELS.map((ch, ci) => (
                      <div
                        key={ch.id}
                        className="flex items-center justify-between text-xs font-mono tabular-nums"
                      >
                        <span className={ch.textClass}>{ch.name}</span>
                        <span className="text-foreground/80">
                          {spotlight.norm[ci].toFixed(2)} × {ch.weight} ={" "}
                          <span className={cn("font-semibold", ch.textClass)}>
                            {(spotlight.norm[ci] * ch.weight).toFixed(2)}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">merged_score</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums text-sm">
                      {spotlight.merged.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 全部候选排名 */}
                <div className="mt-3 flex-1 min-h-0 flex flex-col justify-center gap-1.5">
                  {ranked.map((m, i) => (
                    <div key={m.name} className="flex items-center gap-2 h-7">
                      <span
                        className={cn(
                          "w-4 text-xs font-mono tabular-nums shrink-0 text-center",
                          i === 0
                            ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "text-muted-foreground/60",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          "w-20 shrink-0 text-xs font-mono truncate",
                          m.name === SPOTLIGHT
                            ? "text-emerald-700 dark:text-emerald-300 font-medium"
                            : "text-foreground/70",
                        )}
                      >
                        {m.name}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.merged * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.06 }}
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                        />
                      </div>
                      <span className="w-8 text-xs font-mono text-emerald-700 dark:text-emerald-300 tabular-nums text-right shrink-0">
                        {m.merged.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </PhasePanel>
            )}
          </AnimatePresence>
        </div>

        <p
          className={cn(
            "text-xs text-center font-mono leading-relaxed transition-colors duration-300",
            phase === "merge"
              ? "text-muted-foreground"
              : "text-muted-foreground/50",
          )}
        >
          合并后剔除用户已观看的电影，候选集进入排序环节
        </p>
      </div>
    </VisualFrame>
  );
}

function PhasePanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35 }}
      className="h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="shrink-0 text-xs text-center text-muted-foreground font-mono leading-relaxed min-h-9 flex items-center justify-center">
      {children}
    </p>
  );
}
