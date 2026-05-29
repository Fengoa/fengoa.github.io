"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 4 个请求，长度差异大
// R1: 长度 8（长请求，从 t=0 起）
// R2: 长度 3（短请求，从 t=0 起）
// R3: 长度 5（短请求，从 t=0 起）
// R4: 长度 4（晚到，从 t=4 起）—— continuous 才能让它早开始

type Cell = {
  filled: boolean;
  reqIdx: number; // 哪个请求占的格子
};

const STATIC_REQS = [
  { len: 8, color: "#8b5cf6" }, // violet
  { len: 3, color: "#10b981" }, // emerald
  { len: 5, color: "#f59e0b" }, // amber
];

// static：等到本批 8 步全跑完才能放新请求 → R4 必须等 t=8 才能进
// continuous：每步都重新组 batch，R2 在 t=3 跑完后槽位空出，R4 在 t=4 进入

const T = 12;

function buildStatic(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: T }, () => ({ filled: false, reqIdx: -1 }))
  );
  STATIC_REQS.forEach((r, i) => {
    for (let t = 0; t < r.len; t++) grid[i][t] = { filled: true, reqIdx: i };
  });
  // R4 在 t=8 之后才能起（旧批必须全等结束才能换新批，T_max=8）
  for (let t = 8; t < 8 + 4 && t < T; t++) {
    grid[1][t] = { filled: true, reqIdx: 3 }; // 复用第二行槽位
  }
  return grid;
}

function buildContinuous(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: T }, () => ({ filled: false, reqIdx: -1 }))
  );
  STATIC_REQS.forEach((r, i) => {
    for (let t = 0; t < r.len; t++) grid[i][t] = { filled: true, reqIdx: i };
  });
  // R4 在 t=4 进 R2 的槽（R2 在 t=3 后空了）
  for (let t = 4; t < 4 + 4; t++) {
    grid[1][t] = { filled: true, reqIdx: 3 };
  }
  return grid;
}

const REQ_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#0ea5e9"];
const REQ_NAMES = ["R1", "R2", "R3", "R4"];

export function ContinuousBatchingTimeline() {
  const staticGrid = buildStatic();
  const contGrid = buildContinuous();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => (t + 1) % (T + 4)), 350);
    return () => clearInterval(timer);
  }, []);

  const visibleT = Math.min(T, tick);

  // 利用率
  const staticUsed = staticGrid.flat().filter((c) => c.filled).length;
  const contUsed = contGrid.flat().filter((c) => c.filled).length;

  return (
    <VisualFrame title="static vs continuous batching：右侧 R4 在 continuous 模式下提早 4 步开始">
      <div className="space-y-6">
        <Section
          title="static batching"
          subtitle="新请求必须等当前批最长那个跑完"
          util={`${staticUsed} / ${3 * T} = ${Math.round((staticUsed / (3 * T)) * 100)}% 利用率`}
          grid={staticGrid}
          visibleT={visibleT}
        />
        <Section
          title="continuous batching"
          subtitle="某个请求结束 → 槽位立刻让给下一个"
          util={`${contUsed} / ${3 * T} = ${Math.round((contUsed / (3 * T)) * 100)}% 利用率`}
          grid={contGrid}
          visibleT={visibleT}
          highlightR4
        />

        <div className="flex flex-wrap gap-3 text-xs font-mono">
          {REQ_NAMES.map((n, i) => (
            <span key={n} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: REQ_COLORS[i] }}
              />
              {n}（{[8, 3, 5, 4][i]} 步）
            </span>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function Section({
  title,
  subtitle,
  util,
  grid,
  visibleT,
  highlightR4,
}: {
  title: string;
  subtitle: string;
  util: string;
  grid: Cell[][];
  visibleT: number;
  highlightR4?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
        <div>
          <span className="font-mono text-sm font-semibold">{title}</span>
          <span className="ml-2 text-xs text-muted-foreground">{subtitle}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{util}</span>
      </div>

      <div className="grid grid-cols-[2.5rem_1fr] gap-1.5">
        {grid.map((row, ri) => (
          <Row
            key={ri}
            label={`slot ${ri + 1}`}
            row={row}
            visibleT={visibleT}
            highlightR4={highlightR4}
          />
        ))}
        {/* 时间轴刻度 */}
        <div />
        <div className="grid grid-flow-col auto-cols-fr gap-px text-[9px] font-mono text-muted-foreground text-center pt-1">
          {Array.from({ length: T }).map((_, t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  row,
  visibleT,
  highlightR4,
}: {
  label: string;
  row: Cell[];
  visibleT: number;
  highlightR4?: boolean;
}) {
  return (
    <>
      <div className="text-[10px] font-mono text-muted-foreground self-center">
        {label}
      </div>
      <div className="grid grid-flow-col auto-cols-fr gap-px">
        {row.map((c, t) => {
          const visible = t <= visibleT;
          const isR4 = c.reqIdx === 3 && highlightR4;
          return (
            <div
              key={t}
              className={cn(
                "h-6 rounded-sm transition-all border",
                c.filled
                  ? visible
                    ? "border-transparent"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                  : "border-dashed border-neutral-200 dark:border-neutral-800 bg-transparent"
              )}
              style={
                c.filled && visible
                  ? {
                      backgroundColor: REQ_COLORS[c.reqIdx],
                      boxShadow: isR4 ? "0 0 0 1.5px #0ea5e9" : undefined,
                    }
                  : {}
              }
            />
          );
        })}
      </div>
    </>
  );
}
