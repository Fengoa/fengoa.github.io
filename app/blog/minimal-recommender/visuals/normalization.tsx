"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 归一化合并 — 三阶段精简版
// =============================================================================

const CHANNELS = [
  {
    id: "popular" as const,
    name: "热门召回",
    shortName: "热门",
    weight: 0.2,
    color: "#059669",
    textClass: "text-emerald-800 dark:text-emerald-200",
  },
  {
    id: "genre" as const,
    name: "类型召回",
    shortName: "类型",
    weight: 0.3,
    color: "#10b981",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "itemcf" as const,
    name: "ItemCF",
    shortName: "ItemCF",
    weight: 0.5,
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
  { id: "problem" as const, label: "① 量纲不同", shortLabel: "① 量纲" },
  { id: "normalize" as const, label: "② 归一化", shortLabel: "② 归一化" },
  { id: "merge" as const, label: "③ 加权合并", shortLabel: "③ 合并" },
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
  return { min, max };
}

function normalizeRaw(raw: number, min: number, max: number) {
  const range = max - min;
  return range === 0 ? 1 : (raw - min) / range;
}

function shortMovieName(name: string) {
  const shorts: Record<string, string> = {
    肖申克的救赎: "肖申克",
    辛德勒名单: "辛德勒",
  };
  return shorts[name] ?? name;
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

function NormBar({
  value,
  color,
  delay = 0,
}: {
  value: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.45, delay }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function NormalizationMerge() {
  const [phase, setPhase] = useState<Phase>("problem");
  const [paused, setPaused] = useState(false);

  const rows = useMemo(() => buildRows(), []);
  const bounds = useMemo(() => CHANNELS.map((_, ci) => channelBounds(ci)), []);
  const spotlight = rows.find((m) => m.name === SPOTLIGHT)!;

  const popularShare = (
    (spotlight.raw[0] /
      spotlight.raw.reduce((a, b) => a + b, 0)) *
    100
  ).toFixed(0);

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

  const phaseHint: Record<Phase, string> = {
    problem: "三路分数单位不同，不能直接相加",
    normalize: "每路独立缩放到 0~1，才能按权重合并",
    merge: "合并后剔除已看电影，进入排序",
  };

  return (
    <VisualFrame
      title="归一化合并：量纲对齐后，按权重融合三路分数"
      className="p-3 sm:p-6"
    >
      <div className="flex flex-col gap-3 max-w-xl mx-auto">
        {/* 阶段 tab */}
        <div className="px-1 sm:px-2">
          <div className="flex items-stretch gap-1 font-mono flex-nowrap w-full">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={cn(
                  "flex-1 min-w-0 whitespace-nowrap text-center text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded transition-colors duration-300 cursor-pointer select-none",
                  phase === p.id
                    ? "bg-emerald-600 dark:bg-emerald-400 text-white dark:text-emerald-950 font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  setPhase(p.id);
                  setPaused(true);
                }}
                onMouseEnter={() => {
                  setPhase(p.id);
                  setPaused(true);
                }}
                onMouseLeave={() => setPaused(false)}
              >
                <span className="sm:hidden">{p.shortLabel}</span>
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容：固定高度槽位，切换不抖动 */}
        <div className="rounded-md border border-emerald-300/80 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-3 sm:px-4 sm:py-4">
          <div className="relative min-h-[168px] sm:min-h-[160px]">
            <AnimatePresence mode="wait">
              {phase === "problem" && (
                <PhasePanel key="problem">
                  <PhaseLayout
                    hint={`《${SPOTLIGHT}》· ${phaseHint.problem}`}
                    footer={
                      <p className="text-xs text-center font-mono text-muted-foreground">
                        直接相加时，热门占{" "}
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums">
                          {popularShare}%
                        </span>
                      </p>
                    }
                  >
                    <div className="space-y-2.5">
                      {CHANNELS.map((ch, ci) => {
                        const raw = spotlight.raw[ci];
                        const { max } = bounds[ci];
                        return (
                          <div key={ch.id} className="flex items-center gap-2 text-xs font-mono">
                            <span className={cn("w-11 shrink-0 font-medium", ch.textClass)}>
                              {ch.shortName}
                            </span>
                            <span className="w-10 shrink-0 text-right tabular-nums text-foreground/80">
                              {raw.toLocaleString()}
                            </span>
                            <NormBar value={raw / max} color={ch.color} delay={ci * 0.08} />
                          </div>
                        );
                      })}
                    </div>
                  </PhaseLayout>
                </PhasePanel>
              )}

              {phase === "normalize" && (
                <PhasePanel key="normalize">
                  <PhaseLayout hint={`《${SPOTLIGHT}》· ${phaseHint.normalize}`}>
                    <div className="space-y-2.5">
                      {CHANNELS.map((ch, ci) => {
                        const raw = spotlight.raw[ci];
                        const norm = spotlight.norm[ci];
                        return (
                          <div key={ch.id} className="flex items-center gap-1.5 text-xs font-mono">
                            <span className={cn("w-11 shrink-0 font-medium", ch.textClass)}>
                              {ch.shortName}
                            </span>
                            <span className="w-9 shrink-0 text-right tabular-nums text-muted-foreground">
                              {raw}
                            </span>
                            <span className="text-muted-foreground/40 shrink-0">→</span>
                            <span
                              className={cn(
                                "w-8 shrink-0 tabular-nums font-semibold",
                                ch.textClass,
                              )}
                            >
                              {norm.toFixed(2)}
                            </span>
                            <NormBar value={norm} color={ch.color} delay={ci * 0.08} />
                          </div>
                        );
                      })}
                    </div>
                  </PhaseLayout>
                </PhasePanel>
              )}

              {phase === "merge" && (
                <PhasePanel key="merge">
                  <PhaseLayout hint={`《${SPOTLIGHT}》· ${phaseHint.merge}`}>
                    <div className="space-y-2">
                      <div className="rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-950/40 px-2 py-1.5 text-xs font-mono tabular-nums text-center text-foreground/80 leading-relaxed">
                        {spotlight.norm.map((n, i) => (
                          <span key={CHANNELS[i].id}>
                            {i > 0 && (
                              <span className="text-muted-foreground"> + </span>
                            )}
                            <span className={CHANNELS[i].textClass}>
                              {n.toFixed(2)}×{CHANNELS[i].weight}
                            </span>
                          </span>
                        ))}
                        <span className="text-muted-foreground"> = </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                          {spotlight.merged.toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {ranked.slice(0, 3).map((m, i) => (
                          <div key={m.name} className="flex items-center gap-2 text-xs font-mono">
                            <span
                              className={cn(
                                "w-4 shrink-0 text-center tabular-nums",
                                i === 0
                                  ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                  : "text-muted-foreground/60",
                              )}
                            >
                              {i + 1}
                            </span>
                            <span
                              className={cn(
                                "w-14 sm:w-16 shrink-0 truncate",
                                m.name === SPOTLIGHT
                                  ? "text-emerald-700 dark:text-emerald-300 font-medium"
                                  : "text-foreground/70",
                              )}
                            >
                              {shortMovieName(m.name)}
                            </span>
                            <NormBar
                              value={m.merged}
                              color="#10b981"
                              delay={i * 0.06}
                            />
                            <span className="w-8 shrink-0 text-right tabular-nums text-emerald-700 dark:text-emerald-300">
                              {m.merged.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PhaseLayout>
                </PhasePanel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function PhasePanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

function PhaseLayout({
  hint,
  children,
  footer,
}: {
  hint: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <p className="shrink-0 min-h-9 flex items-center justify-center text-xs text-center text-muted-foreground font-mono leading-snug px-0.5">
        {hint}
      </p>
      <div className="flex-1 flex flex-col justify-center min-h-0">{children}</div>
      <div className="shrink-0 min-h-6 flex items-center justify-center">
        {footer}
      </div>
    </div>
  );
}
