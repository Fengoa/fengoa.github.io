"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

const SCHEMES = [
  { id: "mha", label: "MHA", qHeads: 8, kvHeads: 8, group: 1 },
  { id: "gqa4", label: "GQA-4", qHeads: 8, kvHeads: 4, group: 2 },
  { id: "gqa2", label: "GQA-2", qHeads: 8, kvHeads: 2, group: 4 },
  { id: "mqa", label: "MQA", qHeads: 8, kvHeads: 1, group: 8 },
];

export function GqaHeadGrouping() {
  const [active, setActive] = useState("gqa4");
  const scheme = SCHEMES.find((s) => s.id === active)!;
  const { qHeads, kvHeads, group } = scheme;

  // 颜色按 KV 组分配
  const palette = [
    "violet",
    "sky",
    "emerald",
    "rose",
    "amber",
    "fuchsia",
    "teal",
    "lime",
  ];
  const colorOf = (qIdx: number) => palette[Math.floor(qIdx / group) % palette.length];
  const colorClass = (c: string, kind: "bg" | "border") =>
    ({
      violet: kind === "bg" ? "bg-violet-100 dark:bg-violet-950/40" : "border-violet-400 dark:border-violet-600",
      sky: kind === "bg" ? "bg-sky-100 dark:bg-sky-950/40" : "border-sky-400 dark:border-sky-600",
      emerald: kind === "bg" ? "bg-emerald-100 dark:bg-emerald-950/40" : "border-emerald-400 dark:border-emerald-600",
      rose: kind === "bg" ? "bg-rose-100 dark:bg-rose-950/40" : "border-rose-400 dark:border-rose-600",
      amber: kind === "bg" ? "bg-amber-100 dark:bg-amber-950/40" : "border-amber-400 dark:border-amber-600",
      fuchsia: kind === "bg" ? "bg-fuchsia-100 dark:bg-fuchsia-950/40" : "border-fuchsia-400 dark:border-fuchsia-600",
      teal: kind === "bg" ? "bg-teal-100 dark:bg-teal-950/40" : "border-teal-400 dark:border-teal-600",
      lime: kind === "bg" ? "bg-lime-100 dark:bg-lime-950/40" : "border-lime-400 dark:border-lime-600",
    })[c] || "";

  // 假设 head_dim=128, layers=80, seq=4096, fp16
  const kvBytes = 2 * 80 * 4096 * kvHeads * 128 * 2;
  const kvGB = kvBytes / 1024 ** 3;

  return (
    <VisualFrame title="多个 Query 头共享一组 KV，KV Cache 直接按倍数缩水">
      <div className="flex flex-col gap-5">
        {/* 切换器 */}
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {SCHEMES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "px-2 py-2 rounded border transition-colors",
                active === s.id
                  ? "border-foreground bg-accent text-foreground"
                  : "border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:bg-accent/50"
              )}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-xs mt-0.5 tabular-nums">
                {s.qHeads}Q / {s.kvHeads}KV
              </div>
            </button>
          ))}
        </div>

        {/* 分组示意 */}
        <div className="space-y-3">
          {/* Q heads */}
          <div className="space-y-1">
            <div className="text-xs font-mono text-muted-foreground">Q heads ({qHeads})</div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: qHeads }).map((_, i) => {
                const c = colorOf(i);
                return (
                  <motion.div
                    key={`q-${i}`}
                    layout
                    className={cn(
                      "h-10 rounded border-2 flex items-center justify-center font-mono text-xs",
                      colorClass(c, "bg"),
                      colorClass(c, "border")
                    )}
                  >
                    Q{i}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 连接箭头 */}
          <svg viewBox="0 0 800 30" className="w-full h-6">
            {Array.from({ length: qHeads }).map((_, i) => {
              const x1 = (i + 0.5) * 100;
              const targetGroup = Math.floor(i / group);
              const groupWidth = 800 / kvHeads;
              const x2 = (targetGroup + 0.5) * groupWidth;
              const c = colorOf(i);
              const strokeMap: Record<string, string> = {
                violet: "stroke-violet-400",
                sky: "stroke-sky-400",
                emerald: "stroke-emerald-400",
                rose: "stroke-rose-400",
                amber: "stroke-amber-400",
                fuchsia: "stroke-fuchsia-400",
                teal: "stroke-teal-400",
                lime: "stroke-lime-400",
              };
              return (
                <motion.path
                  key={`${active}-arrow-${i}`}
                  d={`M ${x1} 0 C ${x1} 15, ${x2} 15, ${x2} 30`}
                  fill="none"
                  className={strokeMap[c]}
                  strokeWidth={1.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </svg>

          {/* KV heads */}
          <div className="space-y-1">
            <div className="text-xs font-mono text-muted-foreground">KV heads ({kvHeads})</div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${kvHeads}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: kvHeads }).map((_, i) => {
                const c = palette[i % palette.length];
                return (
                  <motion.div
                    key={`kv-${active}-${i}`}
                    layout
                    className={cn(
                      "h-10 rounded border-2 flex items-center justify-center font-mono text-xs font-medium",
                      colorClass(c, "bg"),
                      colorClass(c, "border")
                    )}
                  >
                    KV{i}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="rounded border border-neutral-200 dark:border-neutral-800 px-3 py-2">
            <div className="text-muted-foreground">每 Q 共享 KV</div>
            <div className="text-foreground font-medium tabular-nums">{group}:1</div>
          </div>
          <div className="rounded border border-neutral-200 dark:border-neutral-800 px-3 py-2">
            <div className="text-muted-foreground">KV Cache @ 4K seq, 80 层</div>
            <div className="text-foreground font-medium tabular-nums">
              {kvGB < 1 ? `${(kvGB * 1024).toFixed(0)} MB` : `${kvGB.toFixed(1)} GB`}
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
