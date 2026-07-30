"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlight } from "sugar-high";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "bash",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const isPlain =
    /^(text|plain|plaintext|txt|none|log)$/i.test(language) ||
    language === "";
  const html = isPlain ? null : highlight(code);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div
      className={cn(
        "group relative my-4 overflow-hidden rounded border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="复制代码"
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              已复制
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              复制
            </>
          )}
        </button>
      </div>
      <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed">
        {html ? (
          <code
            className={cn("grid min-w-full", `language-${language}`)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <code className="grid min-w-full whitespace-pre">{code}</code>
        )}
      </pre>
    </div>
  );
}
