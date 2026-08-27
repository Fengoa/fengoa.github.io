"use client";

import { useMemo, useRef, useState } from "react";
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
  const [selecting, setSelecting] = useState(false);

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

  const updateSelecting = () => {
    const el = textareaRef.current;
    if (!el) return;
    setSelecting(el.selectionStart !== el.selectionEnd);
  };

  return (
    <div className="script-editor relative flex h-72 shrink-0 overflow-hidden rounded-xl border-2 border-foreground md:h-80 lg:h-[28rem]">
      <div
        ref={gutterRef}
        aria-hidden
        className="script-gutter pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden border-r border-foreground/20 py-3 font-mono text-xs leading-relaxed select-none"
      >
        {lineNumbers.map((n) => (
          <div key={n} className="px-2 text-right leading-relaxed">
            {n}
          </div>
        ))}
        <div className="h-10" aria-hidden />
      </div>

      <div className="script-pane relative min-h-0 min-w-0 flex-1">
        <pre
          ref={preRef}
          aria-hidden
          className={`pointer-events-none absolute inset-0 m-0 overflow-hidden py-3 pr-3 pb-10 font-mono text-xs leading-relaxed transition-opacity ${
            selecting ? "opacity-0" : "opacity-100"
          }`}
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
          onSelect={updateSelecting}
          onKeyUp={updateSelecting}
          onMouseUp={updateSelecting}
          onBlur={() => setSelecting(false)}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`script-textarea absolute inset-0 m-0 h-full w-full resize-none overflow-auto bg-transparent py-3 pr-3 pb-10 font-mono text-xs leading-relaxed outline-none ${
            selecting ? "is-selecting" : ""
          }`}
        />
      </div>
    </div>
  );
}
