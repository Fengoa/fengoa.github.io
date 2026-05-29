"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { VisualFrame } from "./frame";

// 同一个权重 0.0734，在四种精度下的近似值与"位数"对比
// FP32 / FP16 用近似十进制还原值；INT8 / INT4 用 [-1, 1] 对称量化的格点近似

const formats = [
  {
    name: "FP32",
    bits: 32,
    approx: 0.07340000,
    bitsPattern: "0 01111011 00101100100100110100010", // 不必精确，仅示意
    storage: "4 字节",
    sevenB: "28 GB",
    color: "#0ea5e9",
    colorClass: "text-sky-500",
    bgClass: "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700",
  },
  {
    name: "FP16",
    bits: 16,
    approx: 0.0734,
    bitsPattern: "0 01011 0010110010",
    storage: "2 字节",
    sevenB: "14 GB",
    color: "#10b981",
    colorClass: "text-emerald-500",
    bgClass:
      "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700",
  },
  {
    name: "INT8",
    bits: 8,
    approx: 0.0709, // 9/127
    bitsPattern: "00001001",
    storage: "1 字节",
    sevenB: "7 GB",
    color: "#f59e0b",
    colorClass: "text-amber-500",
    bgClass:
      "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700",
  },
  {
    name: "INT4",
    bits: 4,
    approx: 0.1429, // 1/7
    bitsPattern: "0001",
    storage: "0.5 字节",
    sevenB: "3.5 GB",
    color: "#ef4444",
    colorClass: "text-rose-500",
    bgClass:
      "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700",
  },
];

const ORIGINAL = 0.0734;

export function QuantizationBits() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // 让"焦点"自动在四种精度间循环，鼠标悬停时停下
  const [autoIdx, setAutoIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoIdx((i) => (i + 1) % formats.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const focus = hoverIdx ?? autoIdx;

  return (
    <VisualFrame title="同一个权重 0.0734，四种精度下需要的位数和近似值">
      <div className="space-y-4">
        <div className="text-xs font-mono text-muted-foreground text-center">
          原值 <span className="text-foreground">0.07340000</span>{" "}
          → 用越少的位数表示，误差越大
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {formats.map((f, i) => {
            const isFocus = i === focus;
            const err = Math.abs(f.approx - ORIGINAL);
            return (
              <div
                key={f.name}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className={cn(
                  "rounded-lg border p-4 transition-all cursor-pointer",
                  isFocus
                    ? f.bgClass + " ring-2 ring-offset-1"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30",
                  "ring-offset-white dark:ring-offset-neutral-950"
                )}
                style={isFocus ? { boxShadow: `0 0 0 2px ${f.color}55` } : {}}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className={cn("font-mono text-sm font-semibold", f.colorClass)}>
                    {f.name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {f.bits} bit
                  </span>
                </div>

                {/* 位图：用方块表示每一位 */}
                <div className="flex flex-wrap gap-[2px] mb-3">
                  {Array.from({ length: f.bits }).map((_, b) => (
                    <span
                      key={b}
                      className={cn(
                        "w-[5px] h-3 rounded-[1px]",
                        // 让符号位/指数/尾数有点视觉区分（粗略示意）
                        isFocus
                          ? "opacity-90"
                          : "opacity-40"
                      )}
                      style={{ backgroundColor: f.color }}
                    />
                  ))}
                </div>

                <div className="font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">还原值</span>
                    <span className="text-foreground tabular-nums">
                      {f.approx.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">误差</span>
                    <span
                      className={cn(
                        "tabular-nums",
                        err > 0.05 ? "text-rose-500" : err > 0.001 ? "text-amber-500" : "text-emerald-500"
                      )}
                    >
                      {err < 0.0001 ? "≈ 0" : err.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">单值占</span>
                    <span className="text-foreground">{f.storage}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-1 mt-1">
                    <span className="text-muted-foreground">7B 模型</span>
                    <span className={cn("font-semibold", f.colorClass)}>
                      {f.sevenB}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-mono text-muted-foreground text-center pt-2">
          INT4 把模型从 28 GB 压到 3.5 GB，一张消费级显卡就够装
        </div>
      </div>
    </VisualFrame>
  );
}
