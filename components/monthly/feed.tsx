"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Markdown from "react-markdown";
import { ExternalLink } from "@/app/me/external-link";
import {
  formatFeedDate,
  formatFeedTime,
  type MonthlyEntry,
} from "@/lib/monthly-types";
import { cn } from "@/lib/utils";

type FeedRow =
  | { kind: "date"; key: string; date: string }
  | { kind: "entry"; key: string; entry: MonthlyEntry };

function buildRows(entries: MonthlyEntry[]): FeedRow[] {
  const rows: FeedRow[] = [];
  let lastDate = "";
  for (const entry of entries) {
    if (entry.date !== lastDate) {
      rows.push({ kind: "date", key: `date-${entry.date}`, date: entry.date });
      lastDate = entry.date;
    }
    rows.push({ kind: "entry", key: entry.id, entry });
  }
  return rows;
}

function matchesQuery(entry: MonthlyEntry, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    entry.title,
    entry.searchText,
    entry.tags.join(" "),
    entry.url || "",
  ]
    .join("\n")
    .toLowerCase();
  return haystack.includes(q);
}

function EntryBody({ markdown }: { markdown: string }) {
  return (
    <div
      className={cn(
        "border-l-2 border-[#ff4b1f]/30 pl-4 text-[15px] leading-7 text-secondary-foreground dark:border-[#ff4b1f]/40",
        "[&_p]:mb-3 [&_p]:last:mb-0",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:mb-1",
        "[&_a]:text-blue-600 [&_a]:underline-offset-4 hover:[&_a]:underline hover:[&_a]:decoration-dotted",
        "[&_img]:mt-3 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border"
      )}
    >
      <Markdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ""} loading="lazy" />
            ) : null,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

function FeedEntry({ entry }: { entry: MonthlyEntry }) {
  return (
    <article id={entry.id} className="scroll-mt-28 py-8">
      <h2 className="mb-2 text-base font-semibold leading-snug text-foreground md:text-lg">
        {entry.title}
      </h2>

      {entry.url && (
        <div className="mb-3">
          <ExternalLink
            href={entry.url}
            showArrow={false}
            className="font-mono text-xs text-blue-600 hover:underline hover:decoration-dotted hover:underline-offset-4"
          >
            {entry.url.replace(/^https?:\/\//, "")}
          </ExternalLink>
        </div>
      )}

      {entry.bodyMarkdown && <EntryBody markdown={entry.bodyMarkdown} />}

      <div className="mt-5 flex flex-wrap items-baseline gap-x-1 gap-y-1 font-mono text-xs text-muted-foreground">
        <span className="text-blue-600">#</span>
        <a
          href={`#${entry.id}`}
          className="text-blue-600 hover:underline hover:decoration-dotted hover:underline-offset-4"
        >
          {formatFeedTime(entry.time)}
        </a>
        {entry.tags.length > 0 && (
          <>
            <span className="text-muted-foreground/50">/</span>
            {entry.tags.map((tag, index) => (
              <span key={tag} className="inline-flex items-center gap-1">
                {index > 0 && (
                  <span className="text-muted-foreground/40">·</span>
                )}
                <span className="text-blue-600/80">{tag}</span>
              </span>
            ))}
          </>
        )}
      </div>
    </article>
  );
}

export function MonthlyFeed({ entries }: { entries: MonthlyEntry[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return entries;
    return entries.filter((entry) => matchesQuery(entry, q));
  }, [entries, query]);

  const rows = useMemo(() => buildRows(filtered), [filtered]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (row?.kind !== "date") return 280;
      return index === 0 ? 36 : 64;
    },
    overscan: 6,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
  });

  const scrollToHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const index = rows.findIndex(
      (row) => row.kind === "entry" && row.entry.id === hash
    );
    if (index >= 0) {
      virtualizer.scrollToIndex(index, { align: "start" });
    }
  }, [rows, virtualizer]);

  useEffect(() => {
    scrollToHash();
  }, [scrollToHash]);

  return (
    <div className="relative left-1/2 flex h-[calc(100dvh-5rem)] w-screen max-w-[100vw] -translate-x-1/2 flex-col">
      <header className="shrink-0 pb-5 pt-10 md:pt-14">
        <div className="mx-auto w-full max-w-2xl px-4 md:px-0">
          <label className="block">
            <span className="sr-only">搜索月刊</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、标签或正文…"
              className={cn(
                "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground/70",
                "outline-none focus:border-foreground/30"
              )}
            />
          </label>
          {query.trim() && (
            <p className="mt-2 text-xs text-muted-foreground">
              找到 {filtered.length} 条
            </p>
          )}
        </div>
      </header>

      <div
        ref={parentRef}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            没有匹配的条目。
          </p>
        ) : (
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((item) => {
              const row = rows[item.index];
              const isDate = row.kind === "date";
              return (
                <div
                  key={row.key}
                  data-index={item.index}
                  ref={virtualizer.measureElement}
                  className={cn(
                    "absolute top-0 left-0 w-full",
                    !isDate && "border-b border-border/70"
                  )}
                  style={{ transform: `translateY(${item.start}px)` }}
                >
                  <div className="mx-auto w-full max-w-2xl px-4 md:px-0">
                    {isDate ? (
                      <h2
                        className={cn(
                          "text-sm font-semibold text-muted-foreground",
                          item.index === 0 ? "pt-2 pb-1" : "pt-12 pb-1"
                        )}
                      >
                        {formatFeedDate(row.date)}
                      </h2>
                    ) : (
                      <FeedEntry entry={row.entry} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
