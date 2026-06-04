"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "../visuals/frame";

const pipelineStages = [
  { label: "全量物品", count: "3706 部", desc: "原始候选池" },
  { label: "热门召回", count: "40 部", desc: "评分人数 × 均分" },
  { label: "类型召回", count: "40 部", desc: "偏好类型权重" },
  { label: "ItemCF", count: "40 部", desc: "物品协同过滤" },
  { label: "归一化合并", count: "~50 部", desc: "消除量纲差异" },
  { label: "精排", count: "Top 20", desc: "引入质量信号" },
];

export function RecommenderPipeline() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // step mapping: 0=全量, 1=三路召回, 2=归一化合并, 3=精排
  const isActive = (index: number) => {
    if (step === 0 && index === 0) return true;
    if (step === 1 && index >= 1 && index <= 3) return true;
    if (step === 2 && index === 4) return true;
    if (step === 3 && index === 5) return true;
    return false;
  };

  return (
    <VisualFrame title="推荐流水线：全量 → 三路召回 → 归一化合并 → 精排">
      {/* Desktop */}
      <div className="hidden sm:block">
        {/* 全量 */}
        <div className="flex justify-center mb-4">
          <PipelineNode
            data={pipelineStages[0]}
            active={isActive(0)}
            wide
          />
        </div>

        {/* 箭头 */}
        <div className="flex justify-center mb-4">
          <DownArrow active={step === 1} />
        </div>

        {/* 三路召回 */}
        <div className="flex items-start justify-center gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <PipelineNode
              key={i}
              data={pipelineStages[i]}
              active={isActive(i)}
            />
          ))}
        </div>

        {/* 汇聚箭头 */}
        <div className="flex justify-center mb-4">
          <MergeArrows active={step === 2} />
        </div>

        {/* 归一化合并 */}
        <div className="flex justify-center mb-4">
          <PipelineNode
            data={pipelineStages[4]}
            active={isActive(4)}
          />
        </div>

        {/* 箭头 */}
        <div className="flex justify-center mb-4">
          <DownArrow active={step === 3} />
        </div>

        {/* 精排 */}
        <div className="flex justify-center">
          <PipelineNode
            data={pipelineStages[5]}
            active={isActive(5)}
            highlight
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden flex-col gap-3">
        {pipelineStages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <PipelineNode
              data={stage}
              active={isActive(i)}
              highlight={i === 5}
            />
            {i === 0 && <DownArrow active={step === 1} mobile />}
            {i === 3 && <DownArrow active={step === 2} mobile />}
            {i === 4 && <DownArrow active={step === 3} mobile />}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function PipelineNode({
  data,
  active,
  wide,
  highlight,
}: {
  data: { label: string; count: string; desc: string };
  active: boolean;
  wide?: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={
        active
          ? { scale: 1 }
          : { scale: 0.97 }
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-lg border px-4 py-3 transition-colors duration-500",
        wide && "w-48 text-center",
        !wide && "w-32 text-center",
        active
          ? highlight
            ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-400/30 dark:ring-emerald-500/30"
            : "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-neutral-200 dark:border-neutral-800 opacity-50",
      )}
    >
      <div
        className={cn(
          "text-sm font-medium transition-colors duration-500",
          active ? "text-emerald-700 dark:text-emerald-300" : "text-neutral-500",
        )}
      >
        {data.label}
      </div>
      <div
        className={cn(
          "text-xs font-mono mt-0.5 transition-colors duration-500",
          active ? "text-emerald-700/80 dark:text-emerald-300/80" : "text-neutral-500",
        )}
      >
        {data.count}
      </div>
      <div
        className={cn(
          "text-xs mt-1 transition-colors duration-500",
          active ? "text-muted-foreground" : "text-neutral-400",
        )}
      >
        {data.desc}
      </div>
    </motion.div>
  );
}

function DownArrow({ active, mobile }: { active: boolean; mobile?: boolean }) {
  return (
    <svg
      width={mobile ? 16 : 20}
      height={mobile ? 16 : 20}
      viewBox="0 0 20 20"
      className={cn(
        "transition-colors duration-500",
        active ? "text-emerald-500 dark:text-emerald-400" : "text-neutral-300 dark:text-neutral-700",
      )}
    >
      <path
        d="M10 4v10m0 0l-4-4m4 4l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function MergeArrows({ active }: { active: boolean }) {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      className={cn(
        "transition-colors duration-500",
        active ? "text-emerald-500 dark:text-emerald-400" : "text-neutral-300 dark:text-neutral-700",
      )}
    >
      {/* 左 */}
      <path
        d="M20 4 L40 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 中 */}
      <path
        d="M60 4 L60 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 右 */}
      <path
        d="M100 4 L80 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
