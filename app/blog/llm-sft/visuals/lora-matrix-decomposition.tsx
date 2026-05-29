"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// W (d×d) = W₀(冻结) + B(d×r) · A(r×d)
// 滑块调 r，参数量随之变化

export function LoraMatrixDecomposition() {
  const d = 4096;
  const [r, setR] = useState(8);

  const fullParams = d * d;
  const loraParams = 2 * d * r;
  const ratio = (loraParams / fullParams) * 100;

  // 视觉块大小
  const cellW = 8;
  const cellH = 80;
  const matrixW = 80; // 显示 W₀ 大方块的宽度

  return (
    <VisualFrame title="LoRA：冻结 W₀，只训练低秩矩阵 B 和 A">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap text-xs font-mono">
          {/* W₀ */}
          <div className="flex flex-col items-center gap-1.5">
            <Block w={matrixW} h={cellH} tone="frozen" label="W₀" />
            <div className="text-muted-foreground">
              {d}×{d}
            </div>
            <div className="text-muted-foreground/70">冻结</div>
          </div>

          <Op symbol="+" />

          {/* B */}
          <div className="flex flex-col items-center gap-1.5">
            <Block w={Math.max(8, r * cellW)} h={cellH} tone="train" label="B" />
            <div className="text-muted-foreground">
              {d}×{r}
            </div>
            <div className="text-emerald-600 dark:text-emerald-400">训练</div>
          </div>

          <Op symbol="·" />

          {/* A */}
          <div className="flex flex-col items-center gap-1.5">
            <Block
              w={matrixW}
              h={Math.max(8, r * cellW)}
              tone="train"
              label="A"
            />
            <div className="text-muted-foreground">
              {r}×{d}
            </div>
            <div className="text-emerald-600 dark:text-emerald-400">训练</div>
          </div>
        </div>

        {/* 滑块 */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">秩 r</span>
            <span className="text-foreground font-medium">{r}</span>
          </div>
          <input
            type="range"
            min={1}
            max={64}
            step={1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground/70">
            <span>1</span>
            <span>16</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>

        {/* 参数量对比 */}
        <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
          <Stat
            label="全参数微调"
            value={formatParams(fullParams)}
            tone="muted"
          />
          <Stat
            label="LoRA 训练量"
            value={formatParams(loraParams)}
            tone="primary"
          />
          <Stat
            label="占比"
            value={`${ratio.toFixed(3)}%`}
            tone="primary"
          />
        </div>
      </div>
    </VisualFrame>
  );
}

function Block({
  w,
  h,
  tone,
  label,
}: {
  w: number;
  h: number;
  tone: "frozen" | "train";
  label: string;
}) {
  return (
    <div
      className={cn(
        "rounded border flex items-center justify-center font-mono text-xs",
        tone === "frozen"
          ? "border-neutral-300 dark:border-neutral-700 bg-stone-100 dark:bg-stone-900/50 text-muted-foreground"
          : "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
      )}
      style={{ width: w, height: h, minWidth: 16, minHeight: 16 }}
    >
      {label}
    </div>
  );
}

function Op({ symbol }: { symbol: string }) {
  return (
    <div className="text-lg font-mono text-muted-foreground/80 px-1">
      {symbol}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "muted" | "primary";
}) {
  return (
    <div
      className={cn(
        "rounded border py-2 px-2",
        tone === "primary"
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
          : "border-neutral-200 dark:border-neutral-800 bg-stone-50/40 dark:bg-stone-900/30"
      )}
    >
      <div className="text-muted-foreground mb-1 text-[11px]">{label}</div>
      <div
        className={cn(
          "text-sm",
          tone === "primary"
            ? "text-emerald-700 dark:text-emerald-300 font-medium"
            : "text-foreground"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function formatParams(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
}
