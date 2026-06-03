"use client";

import { VisualFrame } from "./frame";

const DATA_SOURCES = [
  {
    label: "仿真合成数据",
    tag: "主体",
    desc: "规模化、低成本、覆盖长尾场景",
    color: "#0ea5e9",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    borderColor: "border-sky-200 dark:border-sky-800",
    tagBg: "bg-sky-100 dark:bg-sky-900/50",
    tagText: "text-sky-700 dark:text-sky-400",
  },
  {
    label: "遥操作实采数据",
    tag: null,
    desc: "高质量、真实性强",
    color: "#8b5cf6",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
    tagBg: "",
    tagText: "",
  },
  {
    label: "视频学习",
    tag: "扩展路径",
    desc: "互联网视频自监督学习",
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    tagBg: "bg-emerald-100 dark:bg-emerald-900/50",
    tagText: "text-emerald-700 dark:text-emerald-400",
  },
];

export function TrainingDataSystem() {
  return (
    <VisualFrame title="训练与数据体系：数据来源三角 → 闭环训练 → 部署">
      <div className="space-y-6">
        {/* 标题 */}
        <div className="text-sm font-medium text-muted-foreground text-center">
          数据来源三角
        </div>

        {/* 三个数据源卡片 */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {DATA_SOURCES.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              {i > 0 && (
                <div className="hidden md:flex items-center text-muted-foreground/40">
                  <span className="text-lg">+</span>
                </div>
              )}
              <div
                className={`flex-1 rounded-lg border ${s.borderColor} ${s.bgColor} p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-sm font-medium">{s.label}</span>
                  {s.tag && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${s.tagBg} ${s.tagText}`}
                    >
                      {s.tag}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  ← {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 向下箭头 */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            className="text-neutral-400 dark:text-neutral-600"
          >
            <path
              d="M8 10L0 0h16L8 10z"
              fill="currentColor"
            />
          </svg>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            闭环训练 + Sim-to-Real 迁移
          </div>
        </div>

        {/* 底部输出 */}
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <rect width="8" height="18" x="3" y="3" rx="1" />
              <path d="M11 3h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5" />
              <path d="M11 12h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5" />
            </svg>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
              部署到物理机器人
            </span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
