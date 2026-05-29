"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// GenerationEvolutionSlider：拖动 step，看 prompt 续写在训练过程中如何成形
// 文本是 4M MiniGPT 在 Shakespeare 上不同 step 的真实续写片段（略加缩短）
// =============================================================================

type Sample = {
  step: number;
  loss: number;
  text: string;
  note: string;
};

const SAMPLES: Sample[] = [
  {
    step: 0,
    loss: 8.35,
    text: `xq;Z>P!1—qe . 7?cjvh w'oOOuik9TL mgM zJ qpb,W
.tt'k: u%4kJh —yOiHo  ; sdcqr W ZBfn n'O u`,
    note: "纯随机字节，词表都没学会",
  },
  {
    step: 1000,
    loss: 5.79,
    text: `the wis to my see speak the tro,
And the so to be eath of the boust:
Wher the my brouth doth so mart,`,
    note: "认识常见词了，节奏松散",
  },
  {
    step: 2000,
    loss: 5.88,
    text: `Your subbeny your stified in one of love
Make your good carrie: I will be your
your love to me me the young proubigs?`,
    note: "句法接近英语，单词还在编",
  },
  {
    step: 6000,
    loss: 7.42,
    text: `First Citizen:
He has the name of Marcius; and the pack our general,
The multiers of Rome gates of Rome,
And of his worthy
Would not have deserved them.`,
    note: "对话格式正确，句子通顺，开始背训练集",
  },
  {
    step: 10000,
    loss: 7.9,
    text: `KING RICHARD:
What dreadful coward! forget thee again? thou shalt hear thy lip,
Thou wilt fall backward when thou bested'st
Attending up thy famous enemy?`,
    note: "完美莎翁腔，但很多片段直接来自训练集",
  },
];

export function GenerationEvolutionSlider() {
  const [idx, setIdx] = useState(2);
  const cur = SAMPLES[idx];

  return (
    <VisualFrame title="同一个 prompt 续写，随着训练步数从乱码长成莎士比亚">
      <div className="flex flex-col gap-4">
        {/* 时间轴刻度 */}
        <div className="flex items-center justify-between text-xs font-mono">
          {SAMPLES.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setIdx(i)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors",
                i === idx
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === idx
                    ? "bg-violet-500 scale-150"
                    : "bg-neutral-300 dark:bg-neutral-700"
                )}
              />
              <span>{s.step >= 1000 ? `${s.step / 1000}k` : s.step}</span>
            </button>
          ))}
        </div>

        {/* 滑块 */}
        <input
          type="range"
          min={0}
          max={SAMPLES.length - 1}
          value={idx}
          onChange={(e) => setIdx(parseInt(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />

        {/* 文本卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="rounded border border-neutral-200 dark:border-neutral-800 bg-stone-50 dark:bg-stone-900/40 p-4"
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground">
                step <span className="text-foreground">{cur.step}</span>，val
                loss{" "}
                <span className="text-violet-600 dark:text-violet-400">
                  {cur.loss}
                </span>
              </span>
              <span className="text-muted-foreground">{cur.note}</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap text-secondary-foreground leading-relaxed">
              {cur.text}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </VisualFrame>
  );
}
