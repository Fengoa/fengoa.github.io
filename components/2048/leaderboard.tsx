"use client";

import { useState } from "react";
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

export type LeaderboardTab = "week" | "all";

export function Leaderboard({
  weekEntries,
  allTimeEntries,
  weekLabel,
  highlightId,
}: {
  weekEntries: LeaderboardEntry[];
  allTimeEntries: LeaderboardEntry[];
  weekLabel: string;
  highlightId?: string;
}) {
  const [tab, setTab] = useState<LeaderboardTab>("week");
  const entries = tab === "week" ? weekEntries : allTimeEntries;

  return (
    <div className="relative z-10 flex flex-col overflow-hidden rounded-2xl border-4 border-foreground bg-card shadow-hard-primary">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-foreground bg-card p-4">
        <div className="min-w-0">
          <div className="font-mono text-xs font-bold text-muted-foreground">
            {tab === "week" ? "Competition week" : "All-time"}
          </div>
          <h2 className="font-sans text-lg font-bold tracking-wide text-foreground sm:text-xl">
            Leaderboard
          </h2>
        </div>
        <div
          role="group"
          aria-label="Leaderboard timeframe"
          className="arena-segment"
        >
          <button
            type="button"
            aria-pressed={tab === "all"}
            onClick={() => setTab("all")}
          >
            All time
          </button>
          <button
            type="button"
            aria-pressed={tab === "week"}
            onClick={() => setTab("week")}
          >
            This week
          </button>
        </div>
      </div>

      {tab === "week" && (
        <div className="border-b-2 border-foreground bg-muted/60 px-4 py-2 font-mono text-xs font-bold text-muted-foreground">
          {weekLabel}
        </div>
      )}

      <div className="flex flex-col">
        {entries.length === 0 && (
          <div className="p-8 text-center font-mono text-sm font-bold text-muted-foreground">
            {tab === "week" ? "No scores this week." : "No scores yet."}
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
                {tab === "week"
                  ? `${entry.runsToday} run${entry.runsToday === 1 ? "" : "s"}`
                  : `${entry.totalRuns} run${entry.totalRuns === 1 ? "" : "s"}`}
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
      <div className="font-mono text-xs font-bold text-muted-foreground">Score</div>
      <div
        aria-live="polite"
        className="flex h-10 min-w-[4.5rem] items-center justify-center overflow-hidden rounded-lg border-2 border-foreground bg-card px-2 py-0.5 font-mono text-2xl font-bold text-primary shadow-hard md:h-11 md:text-3xl"
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
    <div className="flex min-w-0 items-center gap-2">
      <Favicon domain={product.domain} className="size-8 shrink-0" />
      <div className="min-w-0">
        <div className="truncate text-sm font-bold leading-tight text-primary md:text-base">
          {product.name}
        </div>
        <div className="truncate font-mono text-xs text-muted-foreground">
          {product.domain}
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="arena-btn arena-btn-outline active-press ml-1 h-8 shrink-0 px-2.5 text-xs shadow-brutal"
      >
        Change
      </button>
    </div>
  );
}
