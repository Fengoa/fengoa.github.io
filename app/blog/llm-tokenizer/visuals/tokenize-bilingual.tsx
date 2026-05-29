"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { VisualFrame } from "./frame";

// =============================================================================
// TokenizeBilingual：中英文在不同 tokenizer 下的切法对比
// 目的：让中文读者直观看到"为什么中文 token 化更难"
// =============================================================================

type Row = {
  text: string;
  // 这里手工列出近似真实工业 tokenizer 的切法
  // - bytes: 直接 UTF-8 字节级（每个汉字 3 字节）
  // - gpt2: byte-level BPE，中文几乎按字节切
  // - gpt4: cl100k_base，中文常见字/词整合
  bytes: string[];
  gpt2: string[];
  gpt4: string[];
};

const ROWS: Row[] = [
  {
    text: "Hello world",
    bytes: ["H","e","l","l","o"," ","w","o","r","l","d"],
    gpt2:  ["Hello", " world"],
    gpt4:  ["Hello", " world"],
  },
  {
    text: "你好，世界",
    bytes: ["e4","bd","a0","e5","a5","bd","ef","bc","8c","e4","b8","96","e7","95","8c"],
    gpt2:  ["ä½","ł","好","ï¼Į","ä¸ĸ","ç•Į"],
    gpt4:  ["你好", "，", "世界"],
  },
  {
    text: "床前明月光",
    bytes: ["e5","ba","8a","e5","89","8d","e6","98","8e","e6","9c","88","e5","85","89"],
    gpt2:  ["床","åī","į","æĺİ","æľĪ","åħī"],
    gpt4:  ["床前", "明月", "光"],
  },
];

function showByte(s: string) {
  // 字节用 0xXX 形式更直观
  if (/^[0-9a-f]{2}$/.test(s)) return s.toUpperCase();
  return s;
}

function Row({
  label,
  vocab,
  tokens,
  hue,
  showBytes = false,
}: {
  label: string;
  vocab: string;
  tokens: string[];
  hue: "neutral" | "amber" | "violet";
  showBytes?: boolean;
}) {
  const palette = {
    neutral: "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-muted-foreground",
    amber:   "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    violet:  "border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
  }[hue];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground/60">
          {tokens.length} tokens，词表 {vocab}
        </span>
      </div>
      <div className="flex flex-wrap gap-0.5">
        {tokens.map((t, i) => (
          <motion.span
            key={`${label}-${i}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.015 }}
            className={cn(
              "inline-flex items-center justify-center px-1 py-0.5 rounded border font-mono text-xs whitespace-pre",
              palette
            )}
          >
            {showBytes ? showByte(t) : t.replace(/ /g, "␣")}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function TokenizeBilingual() {
  return (
    <VisualFrame title="中英文在不同 tokenizer 下的差异">
      <div className="flex flex-col gap-6">
        {ROWS.map((r, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="text-center">
              <span className="font-mono text-sm text-muted-foreground">原文：</span>
              <span className="font-mono text-sm text-foreground">{r.text}</span>
            </div>
            <Row label="UTF-8 字节"   vocab="256"  tokens={r.bytes} hue="neutral" showBytes />
            <Row label="GPT-2 BPE"    vocab="50K"  tokens={r.gpt2}  hue="amber" />
            <Row label="GPT-4 BPE"    vocab="100K" tokens={r.gpt4}  hue="violet" />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
