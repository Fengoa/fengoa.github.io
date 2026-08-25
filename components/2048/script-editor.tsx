"use client";

import { useMemo, useRef } from "react";
import { highlight } from "sugar-high";

export function ScriptEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(
    () => Math.max(1, value.split("\n").length),
    [value]
  );
  const html = useMemo(() => highlight(value), [value]);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  const syncScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div className="script-editor relative flex min-h-72 flex-1 overflow-hidden rounded-xl border-2 border-foreground md:min-h-[28rem]">
      <div
        ref={gutterRef}
        aria-hidden
        className="script-gutter pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden border-r border-foreground/20 py-3 font-mono text-xs leading-relaxed select-none"
      >
        {lineNumbers.map((n) => (
          <div key={n} className="px-2 text-right">
            {n}
          </div>
        ))}
      </div>

      <div className="script-pane relative min-h-0 min-w-0 flex-1">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 m-0 overflow-auto py-3 pr-3 font-mono text-xs leading-relaxed"
        >
          <code
            className="language-javascript block min-w-full whitespace-pre"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 m-0 h-full w-full resize-none overflow-auto bg-transparent py-3 pr-3 font-mono text-xs leading-relaxed text-transparent caret-[#f5efe5] outline-none selection:bg-primary/35"
        />
      </div>
    </div>
  );
}
