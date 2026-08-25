import type { LeaderboardEntry, LeaderboardStore, ProductProfile } from "./types";

export function productNameFromUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a product URL.");
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const hostname = new URL(withScheme).hostname.replace(/^www\./i, "");
  const name = hostname
    .split(".")[0]
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  if (!name) throw new Error("Enter a valid website address.");
  return {
    name: name.slice(0, 80),
    url: withScheme,
    domain: hostname,
    id: hostname.toLowerCase(),
  };
}

export function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

const KEY = "oriensx-2048-arena";

export type StoredBoard = {
  day: string;
  entries: LeaderboardEntry[];
};

function readLocal(): StoredBoard {
  if (typeof window === "undefined") {
    return { day: utcDayKey(), entries: [] };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { day: utcDayKey(), entries: [] };
    const parsed = JSON.parse(raw) as StoredBoard;
    const day = utcDayKey();
    if (parsed.day !== day) return { day, entries: [] };
    return {
      day,
      entries: (parsed.entries ?? []).map((e, i) => ({ ...e, rank: i + 1 })),
    };
  } catch {
    return { day: utcDayKey(), entries: [] };
  }
}

function writeLocal(board: StoredBoard) {
  localStorage.setItem(KEY, JSON.stringify(board));
}

function mergeScore(
  board: StoredBoard,
  product: ProductProfile,
  score: number,
  scriptLabel?: string
): StoredBoard {
  const existing = board.entries.find((e) => e.id === product.id);
  const nextEntry: LeaderboardEntry = {
    ...product,
    score: Math.max(existing?.score ?? 0, score),
    runsToday: (existing?.runsToday ?? 0) + 1,
    totalRuns: (existing?.totalRuns ?? 0) + 1,
    rank: 0,
    scriptLabel: scriptLabel || existing?.scriptLabel,
    updatedAt: new Date().toISOString(),
  };
  const entries = [
    ...board.entries.filter((e) => e.id !== product.id),
    nextEntry,
  ]
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.runsToday - a.runsToday ||
        a.name.localeCompare(b.name)
    )
    .map((e, i) => ({ ...e, rank: i + 1 }));
  return { day: board.day || utcDayKey(), entries };
}

/** Browser-local store. Replace with a fetch-backed client later. */
export const localLeaderboardStore: LeaderboardStore = {
  async load() {
    return readLocal();
  },
  async submit({ product, score, scriptLabel }) {
    const next = mergeScore(readLocal(), product, score, scriptLabel);
    writeLocal(next);
    return next;
  },
};

export const leaderboardStore: LeaderboardStore = localLeaderboardStore;

export function loadBoard(): StoredBoard {
  return readLocal();
}

export function upsertScore(
  board: StoredBoard,
  product: ProductProfile,
  score: number,
  scriptLabel?: string
): StoredBoard {
  const next = mergeScore(board, product, score, scriptLabel);
  writeLocal(next);
  return next;
}
