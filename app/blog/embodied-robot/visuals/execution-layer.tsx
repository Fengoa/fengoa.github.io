"use client";

import { VisualFrame } from "./frame";

const COMPONENTS = [
  {
    name: "驱动关节模组",
    func: "动力输出",
    metric: "扭矩密度、力控精度",
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    text: "text-sky-700 dark:text-sky-400",
  },
  {
    name: "谐波/行星减速器",
    func: "减速增矩",
    metric: "精度、背隙、寿命",
    color: "#f59e0b",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    name: "灵巧手",
    func: "精细操作",
    metric: "自由度数量、抓取力",
    color: "#8b5cf6",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    text: "text-violet-700 dark:text-violet-400",
  },
  {
    name: "运动控制器",
    func: "轨迹规划",
    metric: "延迟、稳定性",
    color: "#10b981",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
  },
];

const DRIVES = [
  { name: "谐波减速器", pros: "高精度、零背隙", cons: "成本高（单个2-5万元）", scene: "工业机器人关节", color: "#0ea5e9" },
  { name: "行星减速器", pros: "高扭矩、耐冲击", cons: "体积大、噪音高", scene: "移动底盘", color: "#f59e0b" },
  { name: "直驱电机", pros: "响应快、无磨损", cons: "力矩小", scene: "协作机器人", color: "#8b5cf6" },
  { name: "液压系统", pros: "力量大、功率密度高", cons: "泄漏风险、维护难", scene: "重载机器人", color: "#10b981" },
];

export function ExecutionLayer() {
  return (
    <VisualFrame title="执行层：核心部件 + 驱动方式对比">
      <div className="space-y-6">
        {/* 核心部件 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">核心部件</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COMPONENTS.map((c) => (
              <div
                key={c.name}
                className={`rounded-lg border ${c.border} ${c.bg} p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className={`text-sm font-semibold ${c.text}`}>{c.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{c.func}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="font-mono text-muted-foreground">{c.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 驱动方式对比 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">主流驱动方式对比</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-2 px-3 font-medium text-xs text-muted-foreground">驱动方式</th>
                  <th className="text-left py-2 px-3 font-medium text-xs text-muted-foreground">优势</th>
                  <th className="text-left py-2 px-3 font-medium text-xs text-muted-foreground">劣势</th>
                  <th className="text-left py-2 px-3 font-medium text-xs text-muted-foreground">典型场景</th>
                </tr>
              </thead>
              <tbody>
                {DRIVES.map((d) => (
                  <tr key={d.name} className="border-b border-neutral-100 dark:border-neutral-900 last:border-b-0">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="font-medium">{d.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs text-emerald-700 dark:text-emerald-400">{d.pros}</td>
                    <td className="py-2 px-3 text-xs text-rose-700 dark:text-rose-400">{d.cons}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{d.scene}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
