"use client";

import { VisualFrame } from "./frame";

const PERCEPTIONS = [
  {
    name: "视觉感知",
    input: "深度相机 + 激光雷达（LiDAR）",
    output: "3D环境建模（毫米级精度）",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    text: "text-sky-700 dark:text-sky-400",
  },
  {
    name: "触觉感知",
    input: "电子皮肤 + 六维力传感器",
    output: "物体材质 / 接触力识别",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
    color: "#f59e0b",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    name: "听觉感知",
    input: "麦克风阵列 + 语音识别",
    output: "自然语言指令理解",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3z" />
      </svg>
    ),
    color: "#8b5cf6",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    text: "text-violet-700 dark:text-violet-400",
  },
  {
    name: "本体感知",
    input: "IMU（惯性测量）+ 关节编码器",
    output: "自身状态实时估计",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v1H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4z" />
        <circle cx="12" cy="15" r="1" />
        <path d="M12 16v3" />
      </svg>
    ),
    color: "#10b981",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
  },
];

export function PerceptionLayer() {
  return (
    <VisualFrame title="感知层：多模态传感器获取环境信息">
      <div className="space-y-3">
        {PERCEPTIONS.map((p) => (
          <div
            key={p.name}
            className={`flex items-center gap-4 rounded-lg border ${p.border} ${p.bg} p-4`}
          >
            <div
              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: p.color + "20", color: p.color }}
            >
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${p.text}`}>{p.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-mono">{p.input}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground/50 shrink-0"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <span className="text-foreground font-medium">{p.output}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
