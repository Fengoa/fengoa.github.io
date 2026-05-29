"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// QKVProjection：一个 token 的 embedding 通过三套权重投影成 Q / K / V
// 三个角色循环高亮，强调"同一向量被三个矩阵分别看了一眼"
// =============================================================================

const ROLES = [
  {
    key: "Q",
    title: "Query",
    sub: "我在找什么",
    color: "violet",
    weightLabel: "W_q",
  },
  {
    key: "K",
    title: "Key",
    sub: "我能提供什么",
    color: "amber",
    weightLabel: "W_k",
  },
  {
    key: "V",
    title: "Value",
    sub: "我的实际内容",
    color: "emerald",
    weightLabel: "W_v",
  },
] as const;

// 三组固定的"输出向量"色调，让用户看到不同矩阵把同一个 embedding 拍成不同的样子
const OUTPUT_PATTERNS: Record<string, number[]> = {
  Q: [0.55, 0.2, 0.85, 0.4, 0.95, 0.3, 0.6, 0.45],
  K: [0.3, 0.7, 0.45, 0.9, 0.25, 0.6, 0.35, 0.8],
  V: [0.7, 0.85, 0.35, 0.55, 0.45, 0.9, 0.5, 0.25],
};

const COLOR_MAP = {
  violet: {
    bg: "bg-violet-500 dark:bg-violet-400",
    softBg: "bg-violet-100 dark:bg-violet-950/60",
    border: "border-violet-400 dark:border-violet-500",
    text: "text-violet-600 dark:text-violet-300",
    ring: "ring-violet-400/40",
    stroke: "text-violet-500 dark:text-violet-400",
  },
  amber: {
    bg: "bg-amber-500 dark:bg-amber-400",
    softBg: "bg-amber-100 dark:bg-amber-950/60",
    border: "border-amber-400 dark:border-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    ring: "ring-amber-400/40",
    stroke: "text-amber-500 dark:text-amber-400",
  },
  emerald: {
    bg: "bg-emerald-500 dark:bg-emerald-400",
    softBg: "bg-emerald-100 dark:bg-emerald-950/60",
    border: "border-emerald-400 dark:border-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
    ring: "ring-emerald-400/40",
    stroke: "text-emerald-500 dark:text-emerald-400",
  },
} as const;

// 输入向量的"格子色"：固定一组，让用户记住是同一个 embedding
const EMBED_PATTERN = [0.5, 0.85, 0.3, 0.7, 0.45, 0.6, 0.25, 0.9];

export function QKVProjection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % ROLES.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <VisualFrame title="同一个 token embedding，被三套权重分别拍成 Q、K、V">
      <div className="flex flex-col items-center gap-6">
        {/* 主流程：embedding → 三条线 → 三个产物 */}
        <div className="grid w-full max-w-2xl grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* 输入 embedding */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono text-muted-foreground mb-2">
              embedding
            </div>
            <div className="flex flex-col gap-0.5 rounded border border-neutral-300 dark:border-neutral-700 p-1 bg-neutral-50 dark:bg-neutral-900">
              {EMBED_PATTERN.map((v, i) => (
                <div
                  key={i}
                  className="h-2 w-6 rounded-sm"
                  style={{
                    backgroundColor: `hsl(${230 + i * 8}, 60%, ${50 + v * 20}%)`,
                  }}
                />
              ))}
            </div>
            <div className="text-[11px] font-mono text-muted-foreground mt-2">
              {`"cat"`}
            </div>
          </div>

          {/* SVG 连接线 + 权重标签 */}
          <div className="relative h-44">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {ROLES.map((role, i) => {
                const yEnd = 16 + i * 34;
                const isActive = i === active;
                const c = COLOR_MAP[role.color];
                return (
                  <motion.path
                    key={role.key}
                    d={`M 2 50 C 40 50, 60 ${yEnd}, 98 ${yEnd}`}
                    fill="none"
                    stroke="currentColor"
                    className={cn(
                      isActive ? c.stroke : "text-neutral-300 dark:text-neutral-700"
                    )}
                    strokeWidth={isActive ? 1.6 : 0.7}
                    strokeOpacity={isActive ? 1 : 0.5}
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{
                      strokeDasharray: isActive ? "0 0" : "1.5 1.5",
                    }}
                  />
                );
              })}
            </svg>
            {/* 权重标签 */}
            <div className="absolute inset-0 flex flex-col justify-around items-center pointer-events-none">
              {ROLES.map((role, i) => {
                const isActive = i === active;
                const c = COLOR_MAP[role.color];
                return (
                  <div
                    key={role.key}
                    className={cn(
                      "px-2 py-0.5 rounded border font-mono text-xs transition-all bg-white dark:bg-neutral-950",
                      isActive
                        ? cn(c.border, c.text)
                        : "border-neutral-200 dark:border-neutral-800 text-muted-foreground/60"
                    )}
                  >
                    × {role.weightLabel}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 三个产物 */}
          <div className="flex flex-col gap-3">
            {ROLES.map((role, i) => {
              const isActive = i === active;
              const c = COLOR_MAP[role.color];
              const pat = OUTPUT_PATTERNS[role.key];
              return (
                <motion.div
                  key={role.key}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-center gap-2 rounded border px-2 py-1.5",
                    isActive
                      ? cn(c.border, "ring-2", c.ring, "bg-white dark:bg-neutral-950")
                      : "border-neutral-200 dark:border-neutral-800"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    {pat.map((v, j) => (
                      <div
                        key={j}
                        className={cn("h-1.5 w-5 rounded-sm", c.bg)}
                        style={{ opacity: 0.3 + v * 0.7 }}
                      />
                    ))}
                  </div>
                  <div className="leading-tight">
                    <div className={cn("font-mono text-sm font-semibold", c.text)}>
                      {role.key}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {role.title}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 当前角色的解释 */}
        <motion.div
          key={`hint-${active}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-mono text-center text-muted-foreground max-w-md"
        >
          <span className={cn("font-semibold", COLOR_MAP[ROLES[active].color].text)}>
            {ROLES[active].title}
          </span>
          ：{ROLES[active].sub}
        </motion.div>
      </div>
    </VisualFrame>
  );
}
