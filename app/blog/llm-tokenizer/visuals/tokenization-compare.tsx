"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// TokenizationCompare：同一句话三种切法并排
// 每个 token 一个色块，token 数和词表大小做角标
// =============================================================================

type Sample = {
  text: string;
  char: string[];
  word: string[];
  bpe: string[];
};

const SAMPLES: Sample[] = [
  // 例 1：含未登录词 (ChatGPT)，演示"词级遇到新词只能给 <UNK>"
  {
    text: "ChatGPT writes poems",
    char: ["C","h","a","t","G","P","T"," ","w","r","i","t","e","s"," ","p","o","e","m","s"],
    word: ["<UNK>", "writes", "poems"],
    bpe:  ["Chat", "G", "PT", " writes", " po", "ems"],
  },
  // 例 2：常规英文，BPE 把后缀拆出来 (proceed → pro + ceed)
  {
    text: "Before we proceed",
    char: ["B","e","f","o","r","e"," ","w","e"," ","p","r","o","c","e","e","d"],
    word: ["Before", "we", "proceed"],
    bpe:  ["Before", " we", " pro", "ceed"],
  },
  // 例 3：长复合词 unbelievable，BPE 拆成有意义的子词 un + belie + vable
  {
    text: "this is unbelievable",
    char: ["t","h","i","s"," ","i","s"," ","u","n","b","e","l","i","e","v","a","b","l","e"],
    word: ["this", "is", "unbelievable"],
    bpe:  ["this", " is", " un", "belie", "vable"],
  },
];

// 用空格的可视化替身，避免 token 看起来是空的
function showToken(t: string) {
  return t.replace(/ /g, "·");
}

// 一行 tokens 的渲染
function TokenRow({
  label,
  vocab,
  tokens,
  hue,
}: {
  label: string;
  vocab: string;
  tokens: string[];
  hue: "neutral" | "violet" | "emerald";
}) {
  const palette = {
    neutral: "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-foreground",
    violet:  "border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
    emerald: "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
  }[hue];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground/60">
          {tokens.length} tokens · vocab = {vocab}
        </span>
      </div>
      <div className="flex flex-wrap gap-0.5">
        {tokens.map((t, i) => (
          <motion.span
            key={`${label}-${i}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className={cn(
              "inline-flex items-center justify-center px-1 py-0.5 rounded border font-mono text-xs whitespace-pre",
              palette
            )}
          >
            {showToken(t)}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function TokenizationCompare() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % SAMPLES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const s = SAMPLES[idx];

  return (
    <VisualFrame title="同一句话的三种切法：序列长度和词表大小的取舍">
      <div className="flex flex-col gap-5">
        {/* 原文行：和下面三组同基线左对齐，label 用 muted */}
        <div className="flex items-baseline gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <span className="font-mono text-xs text-muted-foreground">原文</span>
          <span className="font-mono text-sm text-foreground">{s.text}</span>
        </div>
        <TokenRow label="字符级"     vocab="65"     tokens={s.char} hue="neutral" />
        <TokenRow label="词级"       vocab="数十万" tokens={s.word} hue="emerald" />
        <TokenRow label="子词（BPE）" vocab="512"   tokens={s.bpe}  hue="violet" />
      </div>
    </VisualFrame>
  );
}
