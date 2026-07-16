"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// β 数轴 + 同步示例文本
// 三档示例：太小 / 适中 / 太大

const PROMPT = "推荐一个学 Python 的方法。";

const ANCHORS = [
  {
    beta: 0.02,
    tag: "β 太小",
    risk: "过度偏离 SFT 模型，可能学到讨好评分的捷径",
    answer:
      "我必须强烈推荐！这是绝对完美、毫无风险的方式：（1）每天必须、必须、必须做练习。（2）你绝对不会失败，因为这套方法对所有人 100% 有效。重要的事情说三遍：坚持！坚持！坚持！🔥🔥🔥",
  },
  {
    beta: 0.1,
    tag: "β 常用",
    risk: "恰到好处，既学到偏好又保留 SFT 的语言能力",
    answer:
      "建议从 Python 官方教程或 CS50 入门，每天写一点代码。可以挑一个具体的小项目（比如自动整理本地文件、爬一点网页数据），让学习有目标感。遇到困难时查阅文档或向社区提问，比看完全部教程再开始更有效。",
  },
  {
    beta: 0.4,
    tag: "β 太大",
    risk: "几乎不偏离 SFT，偏好信号没学进去",
    answer:
      "Python 学习方法有很多。可以看书，可以看视频，可以做练习。建议根据自己的情况选择合适的方式。",
  },
];

export function BetaTradeoff() {
  const [idx, setIdx] = useState(1);
  const cur = ANCHORS[idx];

  // 把 β 映射到 0..1 轴位置（log 刻度感觉更合适）
  const positionFor = (b: number) => {
    // β ∈ [0.01, 0.5]，log10
    const lo = Math.log10(0.01);
    const hi = Math.log10(0.5);
    return ((Math.log10(b) - lo) / (hi - lo)) * 100;
  };

  return (
    <VisualFrame title="β 数轴：同一 prompt 在不同 β 下的回答风格">
      <div className="space-y-5">
        {/* 数轴 */}
        <div className="px-2 pt-2">
          <div className="relative h-12">
            {/* 主轴 */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-border" />
            {/* 锚点 */}
            {ANCHORS.map((a, i) => {
              const left = positionFor(a.beta);
              const active = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                  style={{ left: `${left}%` }}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 transition-all",
                      active
                        ? "bg-emerald-500 border-emerald-600 scale-125"
                        : "bg-background border-muted-foreground/50 group-hover:border-foreground"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-mono transition-colors",
                      active ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    β = {a.beta}
                  </div>
                </button>
              );
            })}
            {/* 端点标记 */}
            <span className="absolute left-0 top-0 text-xs font-mono text-muted-foreground/70">
              0.01
            </span>
            <span className="absolute right-0 top-0 text-xs font-mono text-muted-foreground/70">
              0.5
            </span>
          </div>
        </div>

        {/* prompt */}
        <div className="rounded border bg-accent/40 px-4 py-3">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            prompt
          </div>
          <div className="text-sm font-mono text-foreground">{PROMPT}</div>
        </div>

        {/* 当前回答 */}
        <div className="rounded border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/15 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-mono mb-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {cur.tag}
            </span>
            <span className="text-muted-foreground/50">／</span>
            <span className="text-muted-foreground">{cur.risk}</span>
          </div>
          <div className="text-sm font-mono text-foreground/90 leading-relaxed">
            {cur.answer}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
