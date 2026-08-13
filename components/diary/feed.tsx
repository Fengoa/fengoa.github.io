"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Markdown from "react-markdown";
import { ExternalLink } from "@/app/me/external-link";
import {
  formatFeedDate,
  formatFeedTime,
  type DiaryEntry,
} from "@/lib/diary-types";
import { cn } from "@/lib/utils";

type FeedRow =
  | { kind: "date"; key: string; date: string }
  | { kind: "entry"; key: string; entry: DiaryEntry };

function buildRows(entries: DiaryEntry[]): FeedRow[] {
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

function matchesQuery(entry: DiaryEntry, query: string) {
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

function formatMonthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${year}年${month}月`;
}

function collectMonths(entries: DiaryEntry[]) {
  const months: string[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const yearMonth = entry.date.slice(0, 7);
    if (seen.has(yearMonth)) continue;
    seen.add(yearMonth);
    months.push(yearMonth);
  }
  return months;
}

function EntryBody({ markdown }: { markdown: string }) {
  return (
    <div
      className={cn(
        "border-l-2 border-[#ff4b1f]/30 pl-4 text-[15px] leading-7 text-secondary-foreground dark:border-[#ff4b1f]/40",
        "[&_p]:mb-3 [&_p]:last:mb-0",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:text-foreground",
        "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-foreground",
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

function FeedEntry({ entry }: { entry: DiaryEntry }) {
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

export function DiaryFeed({ entries }: { entries: DiaryEntry[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const [query, setQuery] = useState("");
  const [activeMonth, setActiveMonth] = useState(() => {
    const first = entries[0]?.date.slice(0, 7);
    return first ?? "";
  });
  const [monthBarVisible, setMonthBarVisible] = useState(true);

  const months = useMemo(() => collectMonths(entries), [entries]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return entries;
    return entries.filter((entry) => matchesQuery(entry, q));
  }, [entries, query]);

  const rows = useMemo(() => buildRows(filtered), [filtered]);

  useLayoutEffect(() => {
    const update = () => {
      setScrollMargin(listRef.current?.offsetTop ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => {
      const row = rows[index];
      if (row?.kind !== "date") return 280;
      return index === 0 ? 36 : 64;
    },
    overscan: 6,
    scrollMargin,
    useFlushSync: false,
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

  const syncActiveMonth = useCallback(() => {
    const items = virtualizer.getVirtualItems();
    if (items.length === 0) return;
    const anchor = window.scrollY + 140;
    let current = items[0];
    for (const item of items) {
      if (item.start <= anchor) current = item;
      else break;
    }
    const row = rows[current.index];
    if (!row) return;
    const date = row.kind === "date" ? row.date : row.entry.date;
    setActiveMonth(date.slice(0, 7));
  }, [rows, virtualizer]);

  useEffect(() => {
    syncActiveMonth();
    window.addEventListener("scroll", syncActiveMonth, { passive: true });
    return () => window.removeEventListener("scroll", syncActiveMonth);
  }, [syncActiveMonth]);

  useEffect(() => {
    const updateMonthBar = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const top = footer.getBoundingClientRect().top;
        setMonthBarVisible(top > window.innerHeight - 8);
        return;
      }
      const remaining =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      setMonthBarVisible(remaining > 48);
    };
    updateMonthBar();
    window.addEventListener("scroll", updateMonthBar, { passive: true });
    window.addEventListener("resize", updateMonthBar);
    return () => {
      window.removeEventListener("scroll", updateMonthBar);
      window.removeEventListener("resize", updateMonthBar);
    };
  }, []);

  const scrollToMonth = useCallback(
    (yearMonth: string) => {
      const index = rows.findIndex((row) => {
        if (row.kind === "date") return row.date.startsWith(yearMonth);
        return row.entry.date.startsWith(yearMonth);
      });
      if (index < 0) return;
      setActiveMonth(yearMonth);
      virtualizer.scrollToIndex(index, { align: "start" });
    },
    [rows, virtualizer]
  );

  const onHeaderDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, a, button")) return;
      event.preventDefault();
      window.getSelection()?.removeAllRanges();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  return (
    <div className="relative w-screen max-w-[100vw] ml-[calc(50%-50vw)] pb-20">
      <header
        className="sticky top-0 z-[60] cursor-default select-none bg-background/95 pb-4 pt-4 backdrop-blur md:pt-6"
        onDoubleClick={onHeaderDoubleClick}
      >
        <div className="mx-auto w-full max-w-2xl px-4 md:px-0">
          <label className="block">
            <span className="sr-only">搜索日记</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、标签或正文…"
              className={cn(
                "w-full select-text rounded-lg border border-border bg-background px-3 py-2 text-sm",
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

      {rows.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          没有匹配的条目。
        </p>
      ) : (
        <div
          ref={listRef}
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
                style={{
                  transform: `translateY(${item.start - scrollMargin}px)`,
                }}
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

      {months.length > 0 && (
        <nav
          aria-label="按月份切换"
          aria-hidden={!monthBarVisible}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[60] border-t border-border/60 bg-background/95 backdrop-blur transition-all duration-200",
            monthBarVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-full opacity-0"
          )}
        >
          <div className="mx-auto flex w-full max-w-2xl items-center justify-center gap-1 px-4 py-3">
            {months.map((yearMonth) => {
              const active = activeMonth === yearMonth;
              return (
                <button
                  key={yearMonth}
                  type="button"
                  tabIndex={monthBarVisible ? 0 : -1}
                  onClick={() => scrollToMonth(yearMonth)}
                  className={cn(
                    "px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {formatMonthLabel(yearMonth)}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
