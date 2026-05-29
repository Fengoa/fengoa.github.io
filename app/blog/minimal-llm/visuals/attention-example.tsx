"use client";

import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// =============================================================================
// 07 — AttentionExample：用 grid 等宽列展示"the king said to his ???"的关注度
// 替代原本的 ASCII 排版（中英混排在等宽字体下永远对不齐）
// =============================================================================

export function AttentionExample() {
  const tokens = [
    { word: "the",  level: 1, label: "低关注" },
    { word: "king", level: 2, label: "高关注" },
    { word: "said", level: 3, label: "最关注" },
    { word: "to",   level: 1, label: "低关注" },
    { word: "his",  level: 2, label: "高关注" },
    { word: "???",  level: 0, label: "" },
  ];

  // 每个 level 对应的色块宽度和不透明度：色相统一，靠 alpha 拉开关注度差距
  const levelMeta = [
    { bar: "w-0",                                                  text: "text-muted-foreground/40" },
    { bar: "w-3 bg-violet-600/25 dark:bg-violet-400/25",           text: "text-muted-foreground" },
    { bar: "w-6 bg-violet-600/55 dark:bg-violet-400/55",           text: "text-violet-600 dark:text-violet-400" },
    { bar: "w-9 bg-violet-600 dark:bg-violet-400",                 text: "text-violet-800 dark:text-violet-200 font-semibold" },
  ];

  return (
    <VisualFrame title="预测 his 之后的词时，模型对历史每个位置的关注度">
      <div
        className="grid w-full max-w-xl mx-auto gap-x-2"
        style={{ gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))` }}
      >
        {/* 第 1 行：单词 */}
        {tokens.map((t, i) => (
          <div
            key={`w-${i}`}
            className={cn(
              "text-center font-mono text-sm",
              t.word === "???" ? "text-violet-500 dark:text-violet-400 font-semibold" : "text-foreground"
            )}
          >
            {t.word}
          </div>
        ))}

        {/* 第 2 行：关注强度色块 */}
        {tokens.map((t, i) => (
          <div key={`b-${i}`} className="flex justify-center mt-2">
            <div className={cn("h-1.5 rounded-full", levelMeta[t.level].bar)} />
          </div>
        ))}

        {/* 第 3 行：文字标签 */}
        {tokens.map((t, i) => (
          <div
            key={`l-${i}`}
            className={cn("text-center font-mono text-xs mt-1", levelMeta[t.level].text)}
          >
            {t.label}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
