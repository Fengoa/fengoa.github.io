"use client";

import { VisualFrame } from "./frame";

const SLOW_SYSTEM = {
  name: "慢思考系统（高层）",
  desc: "任务理解、场景规划、目标推理",
  tech: "多模态大模型（VLM / VLA）",
  color: "#8b5cf6",
  bg: "bg-violet-50 dark:bg-violet-950/30",
  border: "border-violet-200 dark:border-violet-800",
  text: "text-violet-700 dark:text-violet-400",
};

const FAST_SYSTEM = {
  name: "快思考系统（底层）",
  desc: "高频控制、实时物理交互",
  tech: "强化学习 + 动力学模型",
  color: "#0ea5e9",
  bg: "bg-sky-50 dark:bg-sky-950/30",
  border: "border-sky-200 dark:border-sky-800",
  text: "text-sky-700 dark:text-sky-400",
};

const ROUTES = [
  { label: "VLA 模型", desc: "视觉-语言-动作端到端统一", example: "谷歌 RT-2、OpenVLA" },
  { label: "世界模型", desc: "环境物理规律内部表征", example: "预测与主动规划，支持 Sim-to-Real" },
  { label: "强化学习 + 仿真", desc: "百万智能体并行训练", example: "英伟达 IsaacGym" },
];

export function DecisionLayer() {
  return (
    <VisualFrame title="决策层：快慢双系统架构 + 核心技术路线">
      <div className="space-y-6">
        {/* 快慢双系统 */}
        <div className="flex flex-col md:flex-row gap-3">
          {[SLOW_SYSTEM, FAST_SYSTEM].map((s) => (
            <div
              key={s.name}
              className={`flex-1 rounded-lg border ${s.border} ${s.bg} p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className={`text-sm font-semibold ${s.text}`}>{s.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">{s.desc}</div>
              <div className="text-xs font-mono" style={{ color: s.color }}>
                {s.tech}
              </div>
            </div>
          ))}
        </div>

        {/* 箭头连接 */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
          <span>感知层输入</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
          <span>双系统协同决策</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
          <span>执行层输出</span>
        </div>

        {/* 核心技术路线 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">核心技术路线</div>
          {ROUTES.map((r, i) => (
            <div
              key={r.label}
              className="flex items-center gap-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 px-3 py-2"
            >
              <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}</span>
              <span className="text-sm font-medium">{r.label}</span>
              <span className="text-xs text-muted-foreground">{r.desc}</span>
              <span className="text-xs font-mono text-muted-foreground/60 ml-auto">{r.example}</span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
