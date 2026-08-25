"use client";

import { AnimatePresence, motion } from "motion/react";
import type { LeaderboardEntry, ProductProfile } from "./types";

function Favicon({ domain, className = "size-10" }: { domain: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
      alt=""
      width={40}
      height={40}
      className={`${className} rounded-lg border-2 border-foreground bg-card object-contain p-1`}
    />
  );
}

export function Leaderboard({
  entries,
  highlightId,
}: {
  entries: LeaderboardEntry[];
  highlightId?: string;
}) {
  return (
    <div className="relative z-10 flex flex-col overflow-hidden rounded-2xl border-4 border-foreground bg-card shadow-hard-primary">
      <div className="flex items-end justify-between border-b-4 border-foreground bg-foreground p-4 text-background">
        <div>
          <div className="font-mono text-xs font-bold text-background/70">
            Today&apos;s board
          </div>
          <h2 className="font-sans text-lg font-bold tracking-wide sm:text-xl">
            Leaderboard
          </h2>
        </div>
        <div className="font-mono text-xs font-bold text-background/70">UTC day</div>
      </div>

      <div className="flex flex-col">
        {entries.length === 0 && (
          <div className="p-8 text-center font-mono text-sm font-bold text-muted-foreground">
            No scores yet.
          </div>
        )}
        {entries.map((entry, index) => (
          <a
            key={entry.id}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center gap-3 overflow-hidden border-b-4 border-foreground p-3 transition-colors last:border-b-0 hover:bg-muted md:p-4 ${
              index < 3 ? "bg-primary/5" : ""
            } ${highlightId === entry.id ? "ring-4 ring-inset ring-primary/40" : ""}`}
          >
            {index === 0 && (
              <div className="pointer-events-none absolute inset-0 bg-primary/10" />
            )}
            <div
              className="z-10 w-8 text-center font-mono text-2xl font-black"
              style={{
                color: index === 0 ? "hsl(var(--primary))" : undefined,
              }}
            >
              {entry.rank}
            </div>
            <div className="z-10">
              <Favicon domain={entry.domain} />
            </div>
            <div className="z-10 min-w-0 flex-1 px-1">
              <div className="truncate text-lg font-bold transition-colors group-hover:text-primary">
                {entry.name}
              </div>
              <div className="truncate font-mono text-xs text-muted-foreground">
                {entry.domain}
                {entry.scriptLabel ? ` · ${entry.scriptLabel}` : ""}
              </div>
            </div>
            <div className="z-10 shrink-0 text-right">
              <div className="font-mono text-2xl font-black text-primary">
                {entry.score.toLocaleString()}
              </div>
              <div className="font-mono text-xs font-bold text-muted-foreground">
                {entry.runsToday} run{entry.runsToday === 1 ? "" : "s"}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="text-right">
      <div className="font-mono text-sm font-bold text-muted-foreground">Score</div>
      <div
        aria-live="polite"
        className="flex h-[3.25rem] min-w-[5.5rem] items-center justify-center overflow-hidden rounded-lg border-2 border-foreground bg-card px-3 py-1 font-mono text-4xl font-bold text-primary shadow-hard"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={score}
            initial={{ opacity: 0, y: -10, scale: 1.18 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.86 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {score.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ProductHeader({
  product,
  onChange,
}: {
  product: ProductProfile;
  onChange: () => void;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Favicon domain={product.domain} className="mt-1 size-12" />
      <div className="min-w-0">
        <div className="font-mono text-sm font-bold text-muted-foreground">
          Playing for
        </div>
        <div className="max-w-[220px] truncate text-2xl font-bold text-primary">
          {product.name}
        </div>
        <div className="mt-1 font-mono text-xs text-muted-foreground">
          {product.domain}
        </div>
        <button
          type="button"
          onClick={onChange}
          className="arena-btn arena-btn-outline active-press mt-3 h-8 px-3 text-xs shadow-brutal"
        >
          Change site
        </button>
      </div>
    </div>
  );
}
