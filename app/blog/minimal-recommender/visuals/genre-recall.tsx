"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// 类型偏好召回 — 与同文召回图示主色一致（emerald）
// 分阶段展示：历史 → 权重 → 名额 → 召回分
// =============================================================================

const GENRES = [
  { name: "Drama", label: "剧情", count: 7, weight: 0.7, slots: 28 },
  { name: "Comedy", label: "喜剧", count: 3, weight: 0.3, slots: 12 },
] as const;

const CANDIDATES = [
  { title: "低俗小说", genre: "Drama", weight: 0.7, rating: 4.3 },
  { title: "楚门的世界", genre: "Comedy", weight: 0.3, rating: 4.1 },
] as const;

const TOTAL_HISTORY = 10;
const TOTAL_SLOTS = 40;

const PHASES = [
  { id: "history" as const, label: "① 统计历史" },
  { id: "weights" as const, label: "② 写入权重" },
  { id: "slots" as const, label: "③ 分配名额" },
  { id: "score" as const, label: "④ 计算召回分" },
];

type Phase = (typeof PHASES)[number]["id"];

const PHASE_DELAYS: Record<Phase, number> = {
  history: 2400,
  weights: 2200,
  slots: 2400,
  score: 2800,
};

const PHASE_ORDER: Phase[] = ["history", "weights", "slots", "score"];

export function GenreRecallFlow() {
  const [phase, setPhase] = useState<Phase>("history");
  const [paused, setPaused] = useState(false);

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
    <VisualFrame title="类型偏好召回：从历史到候选的四步流程">
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {/* 阶段指示：hover 某项直接跳转并暂停 */}
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
                onMouseEnter={() => { setPhase(p.id); setPaused(true); }}
                onMouseLeave={() => setPaused(false)}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* 主内容区：固定高度避免切换时跳动 */}
        <div className="min-h-[168px] rounded-md border border-emerald-300/80 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-4">
          <AnimatePresence mode="wait">
            {phase === "history" && (
              <PhasePanel key="history">
                <PanelTitle>从观看历史统计各类型的部数</PanelTitle>
                <div className="space-y-3 mt-3">
                  {GENRES.map((g, gi) => (
                    <GenreRow
                      key={g.name}
                      genre={g}
                      showDots
                      delay={gi * 0.08}
                      trailing={
                        <span className="text-xs font-mono tabular-nums text-muted-foreground shrink-0">
                          {g.count} 部
                        </span>
                      }
                    />
                  ))}
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-3 text-center">
                  共 {TOTAL_HISTORY} 部 → 下一步算各类占比
                </p>
              </PhasePanel>
            )}

            {phase === "weights" && (
              <PhasePanel key="weights">
                <PanelTitle>
                  离线写入权重表
                  <span className="font-normal text-muted-foreground ml-1.5">（占比 = 部数 ÷ 总数）</span>
                </PanelTitle>
                <div className="space-y-3 mt-3">
                  {GENRES.map((g, gi) => (
                    <div
                      key={g.name}
                      className="flex items-center justify-between gap-3 font-mono text-xs"
                    >
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium w-20 shrink-0">
                        {g.label}
                      </span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: gi * 0.12 + 0.1, duration: 0.35 }}
                        className="flex-1 text-center text-foreground/80 tabular-nums"
                      >
                        {g.count} ÷ {TOTAL_HISTORY} =
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: gi * 0.12 + 0.25, duration: 0.35 }}
                        className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums w-10 text-right"
                      >
                        {g.weight}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </PhasePanel>
            )}

            {phase === "slots" && (
              <PhasePanel key="slots">
                <PanelTitle>
                  在线按权重分配 {TOTAL_SLOTS} 个名额
                  <span className="font-normal text-muted-foreground ml-1.5">（⌊40 × w⌋）</span>
                </PanelTitle>
                <div className="space-y-3 mt-3">
                  {GENRES.map((g, gi) => (
                    <div key={g.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {g.label}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          ⌊40 × {g.weight}⌋ ={" "}
                          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                            {g.slots}
                          </span>{" "}
                          部
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(g.slots / TOTAL_SLOTS) * 100}%` }}
                          transition={{ duration: 0.55, delay: gi * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-mono text-center text-emerald-700 dark:text-emerald-300 font-medium mt-3 tabular-nums">
                  28 + 12 = {TOTAL_SLOTS} 部候选
                </p>
              </PhasePanel>
            )}

            {phase === "score" && (
              <PhasePanel key="score">
                <PanelTitle>每部候选的召回分 = 类型权重 × 均分</PanelTitle>
                <motion.table
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-xs font-mono mt-3"
                >
                  <thead>
                    <tr className="text-muted-foreground border-b border-emerald-200/60 dark:border-emerald-800/60">
                      <th className="text-left py-1.5 pr-2 font-normal">电影</th>
                      <th className="text-right py-1.5 px-2 font-normal tabular-nums">权重</th>
                      <th className="text-center py-1.5 px-1 font-normal">×</th>
                      <th className="text-right py-1.5 px-2 font-normal tabular-nums">均分</th>
                      <th className="text-right py-1.5 pl-2 font-normal tabular-nums">召回分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANDIDATES.map((m, i) => {
                      const score = +(m.weight * m.rating).toFixed(2);
                      const top = i === 0;
                      return (
                        <tr
                          key={m.title}
                          className="border-b last:border-0 border-neutral-100 dark:border-neutral-900 tabular-nums"
                        >
                          <td
                            className={cn(
                              "py-2 pr-2",
                              top
                                ? "text-emerald-700 dark:text-emerald-300 font-medium"
                                : "text-foreground/70",
                            )}
                          >
                            {m.title}
                          </td>
                          <td className="py-2 px-2 text-right text-foreground/70">{m.weight}</td>
                          <td className="py-2 px-1 text-center text-muted-foreground/40">×</td>
                          <td className="py-2 px-2 text-right text-foreground/70">{m.rating}</td>
                          <td
                            className={cn(
                              "py-2 pl-2 text-right",
                              top
                                ? "text-emerald-700 dark:text-emerald-300 font-medium"
                                : "text-foreground/70",
                            )}
                          >
                            {score}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </motion.table>
              </PhasePanel>
            )}
          </AnimatePresence>
        </div>

        {/* 新用户兜底：常显，不抢主流程 */}
        <p
          className={cn(
            "text-xs text-center font-mono leading-relaxed transition-colors duration-300",
            phase === "history"
              ? "text-muted-foreground"
              : "text-muted-foreground/50",
          )}
        >
          纯新用户无历史记录，权重为零，此路返回空，由热门召回兜底
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
    >
      {children}
    </motion.div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-center text-muted-foreground font-mono leading-relaxed">
      {children}
    </p>
  );
}

function GenreRow({
  genre,
  showDots,
  delay = 0,
  trailing,
}: {
  genre: (typeof GENRES)[number];
  showDots?: boolean;
  delay?: number;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-medium w-10 shrink-0">
        {genre.label}
      </span>
      {showDots && (
        <div className="flex flex-wrap gap-1 flex-1">
          {Array.from({ length: genre.count }).map((_, i) => (
            <motion.span
              key={`${genre.name}-dot-${i}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: delay + i * 0.04 }}
              className="w-2 h-2 rounded-full shrink-0 bg-emerald-500 dark:bg-emerald-400"
            />
          ))}
        </div>
      )}
      {trailing}
    </div>
  );
}
