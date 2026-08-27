"use client";

import { useState } from "react";
import { ARENA_EXPECTIMAX_SCRIPT } from "@/components/2048/expectimax-arena-script";

export function ArenaBotCopyPanel() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="my-8 overflow-hidden rounded-xl border-2 border-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-foreground bg-muted/50 px-3 py-2">
        <div className="min-w-0 font-mono text-xs font-bold text-muted-foreground">
          scripts/2048-ai-arena.js · paste into Arena Code desk
        </div>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(ARENA_EXPECTIMAX_SCRIPT).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            });
          }}
          className="shrink-0 rounded-lg border-2 border-foreground bg-background px-3 py-1 font-mono text-xs font-bold text-foreground hover:bg-muted"
        >
          {copied ? "Copied" : "Copy script"}
        </button>
      </div>
      <pre className="max-h-[28rem] overflow-auto bg-card p-4 font-mono text-xs leading-relaxed text-secondary-foreground">
        <code className="whitespace-pre">{ARENA_EXPECTIMAX_SCRIPT}</code>
      </pre>
    </div>
  );
}
