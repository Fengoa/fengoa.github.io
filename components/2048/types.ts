export type Direction = "up" | "down" | "left" | "right";

export type TileView = {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
  /** Non-survivor tile sliding into a merge destination. */
  isMergePartner?: boolean;
  /** Partner tile fading out before the survivor updates. */
  isFading?: boolean;
  /** Paint order during slide (merge survivor on top). */
  z?: number;
  /** True only while this tile's transform is animating this move. */
  isMoving?: boolean;
};

export type ProductProfile = {
  id: string;
  name: string;
  url: string;
  domain: string;
};

export type LeaderboardEntry = ProductProfile & {
  score: number;
  runsToday: number;
  totalRuns: number;
  rank: number;
  scriptLabel?: string;
  updatedAt: string;
};

export type ScriptApi = {
  board: () => number[][];
  score: () => number;
  over: () => boolean;
  move: (dir: Direction) => Promise<boolean>;
  sleep: (ms: number) => Promise<void>;
  log: (...args: unknown[]) => void;
};

/** Swap this for a remote API client when a backend is wired up. */
export type LeaderboardBoard = {
  weekKey: string;
  weekLabel: string;
  weekEntries: LeaderboardEntry[];
  allTimeEntries: LeaderboardEntry[];
};

export type LeaderboardStore = {
  load: () => Promise<LeaderboardBoard>;
  submit: (input: {
    product: ProductProfile;
    score: number;
    scriptLabel?: string;
  }) => Promise<LeaderboardBoard>;
};

export const MOVE_ANIM_MS = 180;
/** Start merge pop this far through the slide (0–1) — before tiles fully meet. */
export const MERGE_POP_LEAD = 0.68;
export const POP_ANIM_MS = 380;
export const GAME_OVER_DELAY_MS = 820;
