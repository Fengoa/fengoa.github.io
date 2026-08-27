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

/** Monday 00:00 UTC of the competition week containing `date`. */
export function utcWeekStart(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = d.getUTCDay(); // 0 Sun … 6 Sat
  const offset = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

export function utcWeekKey(date = new Date()) {
  return utcWeekStart(date).toISOString().slice(0, 10);
}

export function utcWeekLabel(weekKey: string) {
  const start = new Date(`${weekKey}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return weekKey;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${fmt.format(start)} – ${fmt.format(end)} UTC`;
}

const KEY = "oriensx-2048-arena";

export type StoredArena = {
  version: 2;
  weekKey: string;
  weekEntries: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
};

export type ArenaBoard = {
  weekKey: string;
  weekLabel: string;
  weekEntries: LeaderboardEntry[];
  allTimeEntries: LeaderboardEntry[];
};

function rankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.totalRuns - a.totalRuns ||
        a.name.localeCompare(b.name)
    )
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

function emptyArena(weekKey = utcWeekKey()): StoredArena {
  return { version: 2, weekKey, weekEntries: [], allTime: [] };
}

function toBoard(arena: StoredArena): ArenaBoard {
  const weekKey = arena.weekKey || utcWeekKey();
  return {
    weekKey,
    weekLabel: utcWeekLabel(weekKey),
    weekEntries: rankEntries(arena.weekEntries ?? []),
    allTimeEntries: rankEntries(arena.allTime ?? []),
  };
}

function migrateRaw(raw: string): StoredArena {
  const parsed = JSON.parse(raw) as Partial<StoredArena> & {
    day?: string;
    entries?: LeaderboardEntry[];
  };
  const weekKey = utcWeekKey();

  if (parsed.version === 2) {
    const storedWeek = parsed.weekKey || weekKey;
    const weekEntries =
      storedWeek === weekKey ? (parsed.weekEntries ?? []) : [];
    return {
      version: 2,
      weekKey,
      weekEntries,
      allTime: parsed.allTime ?? [],
    };
  }

  // v1: UTC-day board — keep scores in all-time; week only if still this week
  const day = parsed.day;
  const entries = parsed.entries ?? [];
  const dayInThisWeek = Boolean(day && utcWeekKey(new Date(`${day}T12:00:00.000Z`)) === weekKey);
  return {
    version: 2,
    weekKey,
    weekEntries: dayInThisWeek ? entries : [],
    allTime: entries,
  };
}

function readLocal(): StoredArena {
  if (typeof window === "undefined") return emptyArena();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyArena();
    return migrateRaw(raw);
  } catch {
    return emptyArena();
  }
}

function writeLocal(arena: StoredArena) {
  localStorage.setItem(KEY, JSON.stringify(arena));
}

function mergeIntoList(
  list: LeaderboardEntry[],
  product: ProductProfile,
  score: number,
  scriptLabel: string | undefined,
  runField: "week" | "all"
): LeaderboardEntry[] {
  const existing = list.find((e) => e.id === product.id);
  const nextEntry: LeaderboardEntry = {
    ...product,
    score: Math.max(existing?.score ?? 0, score),
    runsToday:
      runField === "week"
        ? (existing?.runsToday ?? 0) + 1
        : (existing?.runsToday ?? 0),
    totalRuns: (existing?.totalRuns ?? 0) + (runField === "all" ? 1 : 0),
    rank: 0,
    scriptLabel: scriptLabel || existing?.scriptLabel,
    updatedAt: new Date().toISOString(),
  };

  // When updating week, also bump totalRuns from the all-time pass separately.
  if (runField === "week" && existing) {
    nextEntry.totalRuns = existing.totalRuns;
  }

  return rankEntries([
    ...list.filter((e) => e.id !== product.id),
    nextEntry,
  ]);
}

function submitScore(
  arena: StoredArena,
  product: ProductProfile,
  score: number,
  scriptLabel?: string
): StoredArena {
  const weekKey = utcWeekKey();
  const weekEntries =
    arena.weekKey === weekKey ? arena.weekEntries : [];

  const nextWeek = mergeIntoList(
    weekEntries,
    product,
    score,
    scriptLabel,
    "week"
  );
  const nextAll = mergeIntoList(
    arena.allTime,
    product,
    score,
    scriptLabel,
    "all"
  );

  // Keep totalRuns authoritative on both lists from all-time
  const allById = new Map(nextAll.map((e) => [e.id, e]));
  const syncedWeek = nextWeek.map((e) => ({
    ...e,
    totalRuns: allById.get(e.id)?.totalRuns ?? e.totalRuns,
  }));

  return {
    version: 2,
    weekKey,
    weekEntries: syncedWeek,
    allTime: nextAll,
  };
}

/** Browser-local store. Replace with a fetch-backed client later. */
export const localLeaderboardStore: LeaderboardStore = {
  async load() {
    const arena = readLocal();
    // Roll week forward if needed
    const weekKey = utcWeekKey();
    if (arena.weekKey !== weekKey) {
      const rolled: StoredArena = {
        ...arena,
        weekKey,
        weekEntries: [],
      };
      writeLocal(rolled);
      return toBoard(rolled);
    }
    return toBoard(arena);
  },
  async submit({ product, score, scriptLabel }) {
    const next = submitScore(readLocal(), product, score, scriptLabel);
    writeLocal(next);
    return toBoard(next);
  },
};

export const leaderboardStore: LeaderboardStore = localLeaderboardStore;

export function loadBoard(): ArenaBoard {
  return toBoard(readLocal());
}

export function upsertScore(
  _board: ArenaBoard,
  product: ProductProfile,
  score: number,
  scriptLabel?: string
): ArenaBoard {
  const next = submitScore(readLocal(), product, score, scriptLabel);
  writeLocal(next);
  return toBoard(next);
}
