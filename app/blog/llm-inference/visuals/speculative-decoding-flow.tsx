"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 上下两条时间轴：
// 普通自回归：8 个 token，每个 1 个大模型 forward
// 投机解码：小模型一次猜 4 个，大模型一次验证。命中 3/4，再迭代。

const TARGET_TOKENS = ["The", " capital", " of", " France", " is", " Paris", ".", " It"];
// 每个 step 的成本：大模型 forward = 8 单位时间，小模型 forward = 1 单位时间
const BIG = 8;
const SMALL = 1;

// 投机解码两轮：第一轮 [The, capital, of, France] 全中（4 token），
// 第二轮 [is, Paris, ., (It → 错)] 命中前三，重生成最后一个由大模型给出的 It。
const specRounds = [
  { draftTokens: 4, accepted: 4, label: "全中" },
  { draftTokens: 4, accepted: 3, label: "中 3" },
  // 第三轮只是为了凑齐序列长度，但通常实际投机解码是连续的；这里到 8 个就停。
];

export function SpeculativeDecodingFlow() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 700);
    return () => clearInterval(timer);
  }, []);

  // 普通：每 step 出 1 个 token，共 8 步
  const naiveStep = tick % 14; // 0..13，留点停顿
  const naiveProduced = Math.min(TARGET_TOKENS.length, Math.max(0, naiveStep));

  // 投机：3 轮 = 1+1 + 1+1 = 短得多
  const specStep = tick % 14;
  // 时序：t0~t1 小猜 4，t1~t2 大验，t2 出 4 个；t2~t3 小猜 4，t3~t4 大验，t4 出 3 个；之后停
  let specProduced = 0;
  if (specStep >= 2) specProduced = 4;
  if (specStep >= 4) specProduced = 7;
  if (specStep >= 5) specProduced = 8; // 第 4 个 token 由大模型纠正
  specProduced = Math.min(TARGET_TOKENS.length, specProduced);
  void specProduced;

  // 总耗时计算（用于右侧汇总）
  const naiveTotal = TARGET_TOKENS.length * BIG; // 64
  const specTotal = specRounds.reduce((s, r) => s + SMALL * r.draftTokens + BIG, 0); // 8 + 4 + 8 + 4 ... = 24

  return (
    <VisualFrame title="自回归 vs 投机解码：小模型先猜一串，大模型一次验证多个 token">
      <div className="space-y-6">
        {/* 普通自回归 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-muted-foreground">
              普通自回归 · 每个 token 都过一次大模型
            </span>
            <span className="text-rose-500">
              共 {naiveTotal} 单位时间
            </span>
          </div>
          <div className="relative h-12 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 overflow-hidden">
            <div className="absolute inset-0 flex">
              {TARGET_TOKENS.map((tok, i) => (
                <div
                  key={i}
                  className="flex-1 border-r last:border-r-0 border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i < naiveProduced ? 1 : 0.15 }}
                    className={cn(
                      "font-mono text-xs",
                      i < naiveProduced ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                    )}
                  >
                    {tok.trim() || "␣"}
                  </motion.span>
                  <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                    +8t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 投机解码 */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-muted-foreground">
              投机解码 · 小模型一次猜 4 个，大模型一次验证
            </span>
            <span className="text-emerald-500">共 {specTotal} 单位时间</span>
          </div>

          <div className="space-y-1.5">
            {/* 第一轮 */}
            <SpecRow
              label="round 1"
              draft={["The", " capital", " of", " France"]}
              accepted={4}
              visible={specStep >= 0}
              verifyVisible={specStep >= 2}
            />
            <SpecRow
              label="round 2"
              draft={[" is", " Paris", ".", " IT"]}
              accepted={3}
              fallbackToken=" It"
              visible={specStep >= 3}
              verifyVisible={specStep >= 5}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <Stat label="加速比" value="~2.7×" color="text-emerald-500" />
          <Stat label="平均接受" value="3.5 / 4" color="text-violet-500" />
          <Stat label="质量影响" value="无" color="text-foreground" />
        </div>
      </div>
    </VisualFrame>
  );
}

function SpecRow({
  label,
  draft,
  accepted,
  fallbackToken,
  visible,
  verifyVisible,
}: {
  label: string;
  draft: string[];
  accepted: number;
  fallbackToken?: string;
  visible: boolean;
  verifyVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch gap-2 transition-opacity",
        visible ? "opacity-100" : "opacity-30"
      )}
    >
      <div className="w-16 shrink-0 flex items-center font-mono text-xs text-muted-foreground">
        {label}
      </div>

      {/* 小模型猜 */}
      <div className="flex flex-1 gap-px rounded border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/30 overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-2 text-xs font-mono text-sky-700 dark:text-sky-300">
          小模型 +4t
        </div>
        {draft.map((tok, i) => {
          const isAccepted = i < accepted;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 flex items-center justify-center font-mono text-xs",
                !verifyVisible
                  ? "text-sky-700 dark:text-sky-300"
                  : isAccepted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500 line-through"
              )}
            >
              {tok.trim() || "␣"}
            </div>
          );
        })}
      </div>

      {/* 大模型验证 */}
      <div
        className={cn(
          "flex w-32 shrink-0 gap-px rounded border overflow-hidden transition-opacity",
          verifyVisible
            ? "border-violet-300 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/30 opacity-100"
            : "border-neutral-200 dark:border-neutral-800 opacity-40"
        )}
      >
        <div className="flex-1 flex items-center justify-center px-2 text-xs font-mono text-violet-700 dark:text-violet-300">
          大模型 +8t
        </div>
        {fallbackToken && verifyVisible && (
          <div className="px-2 flex items-center justify-center font-mono text-xs text-emerald-600 dark:text-emerald-400">
            {fallbackToken.trim() || "␣"}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-800 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("text-base font-semibold mt-0.5", color)}>{value}</div>
    </div>
  );
}
