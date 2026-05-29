"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

const N = 8; // 注意力矩阵尺寸（演示用）
const TILE = 4; // 分块大小
const TILES_PER_AXIS = N / TILE;
const TOTAL_TILES = TILES_PER_AXIS * TILES_PER_AXIS;

export function FlashAttentionTiling() {
  const [mode, setMode] = useState<"naive" | "flash">("flash");
  const [step, setStep] = useState(0);

  // naive 一次性渲染整张矩阵；flash 一格格点亮
  const totalSteps = mode === "naive" ? 2 : TOTAL_TILES + 1;

  useEffect(() => {
    // mode 切换时把动画从头开始
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps - 1) return mode === "naive" ? 1 : TOTAL_TILES;
        return s + 1;
      });
    }, 600);
    return () => clearInterval(t);
  }, [mode, totalSteps]);

  // naive：直接铺满；flash：当前激活 tile 索引
  const activeTileIdx = mode === "flash" ? Math.min(step - 1, TOTAL_TILES - 1) : -1;
  const completedTiles = mode === "flash" ? Math.max(0, step) : 0;

  // 显存占用：naive 满矩阵；flash 只占一个 tile
  const naiveMem = N * N;
  const flashMem = TILE * TILE;

  return (
    <VisualFrame title="Flash Attention：每次只把一个小块搬进 SRAM 算完再换">
      <div className="flex flex-col gap-5">
        {/* 模式切换 */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setMode("naive")}
            className={cn(
              "px-2 py-2 rounded border transition-colors text-left",
              mode === "naive"
                ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
            )}
          >
            <div className="font-medium">朴素实现</div>
            <div className="text-[10px] mt-0.5">整张 N×N 矩阵都进 HBM</div>
          </button>
          <button
            onClick={() => setMode("flash")}
            className={cn(
              "px-2 py-2 rounded border transition-colors text-left",
              mode === "flash"
                ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                : "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
            )}
          >
            <div className="font-medium">Flash Attention</div>
            <div className="text-[10px] mt-0.5">分 tile，整块在 SRAM 完成</div>
          </button>
        </div>

        {/* 注意力矩阵 */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-mono text-muted-foreground">
            Attention 矩阵 ({N}×{N})
          </div>
          <div
            className="grid gap-px bg-neutral-200 dark:bg-neutral-800 p-px rounded"
            style={{ gridTemplateColumns: `repeat(${N}, 1.4rem)` }}
          >
            {Array.from({ length: N * N }).map((_, idx) => {
              const r = Math.floor(idx / N);
              const c = idx % N;
              const tileR = Math.floor(r / TILE);
              const tileC = Math.floor(c / TILE);
              const tileIdx = tileR * TILES_PER_AXIS + tileC;

              const isActiveTile = mode === "flash" && tileIdx === activeTileIdx;
              const isCompletedTile = mode === "flash" && tileIdx < completedTiles;
              const naiveOn = mode === "naive" && step >= 1;

              return (
                <motion.div
                  key={idx}
                  className={cn(
                    "w-5 h-5 rounded-[1px] transition-colors",
                    naiveOn
                      ? "bg-rose-400 dark:bg-rose-500"
                      : isActiveTile
                        ? "bg-violet-500 dark:bg-violet-400"
                        : isCompletedTile
                          ? "bg-violet-200 dark:bg-violet-900/60"
                          : "bg-neutral-100 dark:bg-neutral-900"
                  )}
                  animate={
                    isActiveTile
                      ? { scale: [1, 1.15, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                />
              );
            })}
          </div>
        </div>

        {/* 内存占用图 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">峰值显存（相对单元数）</span>
            <span className="tabular-nums">
              {mode === "naive" ? `${naiveMem} 单元` : `${flashMem} 单元`}
            </span>
          </div>
          <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden">
            <motion.div
              className={cn(
                "h-full",
                mode === "naive" ? "bg-rose-500" : "bg-violet-500"
              )}
              initial={false}
              animate={{
                width: `${
                  ((mode === "naive" ? naiveMem : flashMem) / (N * N)) * 100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-mono text-muted-foreground leading-relaxed"
            >
              {mode === "naive"
                ? `朴素：QK^⊤ 写满 N×N 显存（O(N²)），再读出来做 softmax，再读一次乘 V。三次 HBM 来回。`
                : `Flash：把 Q/K/V 切成小块，每块在片上 SRAM 完成 score + softmax + ×V。永远不需要把完整 N×N 写进 HBM。`}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </VisualFrame>
  );
}
