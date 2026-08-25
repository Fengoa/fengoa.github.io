import type { Direction, TileView } from "./types";

const SIZE = 4;
const CELLS = SIZE * SIZE;

export type EngineState = {
  board: number[];
  score: number;
  seed: number;
  over: boolean;
  moves: number;
};

type Transition = { from: number; to: number; value: number };

function xorshift(seed: number): [number, number] {
  let t = seed >>> 0;
  t ^= t << 13;
  t ^= t >>> 17;
  t ^= t << 5;
  return [t >>> 0, (t >>> 0) / 4294967296];
}

function spawn(board: number[], seed: number) {
  const empties: number[] = [];
  for (let i = 0; i < CELLS; i++) if (board[i] === 0) empties.push(i);
  if (empties.length === 0) return { board, seed };

  let s = seed;
  const [s1, r1] = xorshift(s);
  const [s2, r2] = xorshift(s1);
  s = s2;
  const idx = empties[Math.floor(r1 * empties.length)];
  const next = board.slice();
  next[idx] = r2 < 0.9 ? 2 : 4;
  return { board: next, seed: s, spawnedIndex: idx };
}

function lineIndices(dir: Direction, lane: number): number[] {
  if (dir === "left") return [0, 1, 2, 3].map((c) => lane * 4 + c);
  if (dir === "right") return [3, 2, 1, 0].map((c) => lane * 4 + c);
  if (dir === "up") return [0, 1, 2, 3].map((r) => r * 4 + lane);
  return [3, 2, 1, 0].map((r) => r * 4 + lane);
}

function compress(values: number[]) {
  const filtered = values.filter(Boolean);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      out.push(merged);
      gained += merged;
      i += 1;
    } else {
      out.push(filtered[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { values: out, gained };
}

function hasMoves(board: number[]) {
  if (board.some((v) => v === 0)) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r * 4 + c];
      if (c < 3 && v === board[r * 4 + c + 1]) return true;
      if (r < 3 && v === board[(r + 1) * 4 + c]) return true;
    }
  }
  return false;
}

/** Map each non-empty cell in a lane to its destination after compress. */
function transitions(fromIdx: number[], before: number[]): Transition[] {
  const packed = before.flatMap((value, i) =>
    value ? [{ from: fromIdx[i], value }] : []
  );
  const out: Transition[] = [];
  let i = 0;
  let slot = 0;
  while (i < packed.length) {
    const a = packed[i];
    const b = packed[i + 1];
    const to = fromIdx[slot];
    if (b && a.value === b.value) {
      out.push(
        { from: a.from, to, value: a.value * 2 },
        { from: b.from, to, value: a.value * 2 }
      );
      i += 2;
    } else {
      out.push({ from: a.from, to, value: a.value });
      i += 1;
    }
    slot += 1;
  }
  return out;
}

export function createInitialState(seed = (Date.now() >>> 0) || 1): EngineState {
  const first = spawn(Array(CELLS).fill(0), seed);
  const second = spawn(first.board, first.seed);
  return {
    board: second.board,
    score: 0,
    seed: second.seed,
    over: false,
    moves: 0,
  };
}

export function applyMove(state: EngineState, dir: Direction) {
  if (state.over) {
    return {
      state,
      changed: false as const,
      transitions: [] as Transition[],
    };
  }

  const board = state.board.slice();
  let gained = 0;
  let changed = false;
  const moves: Transition[] = [];

  for (let lane = 0; lane < SIZE; lane++) {
    const idx = lineIndices(dir, lane);
    const before = idx.map((i) => board[i]);
    const { values, gained: g } = compress(before);
    gained += g;
    if (values.some((v, i) => v !== before[i])) changed = true;
    moves.push(...transitions(idx, before));
    idx.forEach((cell, i) => {
      board[cell] = values[i];
    });
  }

  if (!changed) {
    const over = !hasMoves(board);
    return {
      state: over === state.over ? state : { ...state, over },
      changed: false as const,
      transitions: [] as Transition[],
    };
  }

  const spawned = spawn(board, state.seed);
  return {
    state: {
      board: spawned.board,
      score: state.score + gained,
      seed: spawned.seed,
      over: !hasMoves(spawned.board),
      moves: state.moves + 1,
    },
    changed: true as const,
    spawnedIndex: spawned.spawnedIndex as number | undefined,
    transitions: moves,
  };
}

export function boardToGrid(board: number[]): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < SIZE; r++) {
    grid.push(board.slice(r * 4, r * 4 + 4));
  }
  return grid;
}

export class GameController {
  state: EngineState;
  /** Settled tiles shown between moves. */
  tiles: TileView[] = [];
  /** Mid-move tiles (same ids, destination cells, original values). */
  movingTiles: TileView[] = [];
  /** Whether the latest move included at least one merge. */
  lastHadMerge = false;
  private nextId = 1;

  constructor(seed?: number) {
    this.state = createInitialState(seed);
    this.tiles = this.state.board.flatMap((value, i) =>
      value
        ? [
            {
              id: this.nextId++,
              value,
              row: Math.floor(i / 4),
              col: i % 4,
              isNew: true,
              isMerged: false,
            },
          ]
        : []
    );
  }

  move(dir: Direction) {
    const result = applyMove(this.state, dir);
    this.state = result.state;
    if (!result.changed) {
      this.movingTiles = [];
      this.lastHadMerge = false;
      return false;
    }

    const byCell = new Map(this.tiles.map((t) => [t.row * 4 + t.col, t]));

    // Group source tiles by destination cell (1 = slide, 2 = merge).
    const arriving = new Map<number, TileView[]>();
    for (const step of result.transitions) {
      const src = byCell.get(step.from);
      if (!src) continue;
      const list = arriving.get(step.to) ?? [];
      list.push(src);
      arriving.set(step.to, list);
    }

    this.lastHadMerge = [...arriving.values()].some((list) => list.length > 1);

    // Phase 1: every live tile slides to its destination, keeping its face value.
    this.movingTiles = result.transitions.flatMap((step, order) => {
      const src = byCell.get(step.from);
      if (!src) return [];
      const partners = arriving.get(step.to) ?? [];
      const isMerge = partners.length > 1;
      // Keep the first arriver as the visual survivor (drawn on top).
      const isSurvivor = isMerge && partners[0]?.id === src.id;
      return [
        {
          id: src.id,
          value: src.value,
          row: Math.floor(step.to / 4),
          col: step.to % 4,
          isNew: false,
          isMerged: false,
          isMergePartner: isMerge && !isSurvivor,
          z: isSurvivor ? 20 : isMerge ? 10 : 1 + order,
        },
      ];
    });

    // Phase 2: collapse merges, update faces, spawn the random tile.
    this.tiles = [...arriving.entries()].map(([to, list]) => {
      const survivor = list[0];
      const merged = list.length > 1;
      return {
        id: survivor.id,
        value: merged ? survivor.value * 2 : survivor.value,
        row: Math.floor(to / 4),
        col: to % 4,
        isNew: false,
        isMerged: merged,
        z: 1,
      };
    });

    if (result.spawnedIndex !== undefined) {
      this.tiles.push({
        id: this.nextId++,
        value: this.state.board[result.spawnedIndex],
        row: Math.floor(result.spawnedIndex / 4),
        col: result.spawnedIndex % 4,
        isNew: true,
        isMerged: false,
        z: 1,
      });
    }

    this.tiles.sort((a, b) => a.row * 4 + a.col - (b.row * 4 + b.col));
    return true;
  }

  getMovingTiles() {
    return this.movingTiles.map((t) => ({ ...t }));
  }

  hadMerge() {
    return this.lastHadMerge;
  }

  /** Merge faces at destination; exclude spawn until sliding has fully stopped. */
  getMergeSettleTiles(includeSpawn = false) {
    const settled = this.tiles
      .filter((t) => includeSpawn || !t.isNew)
      .map((t) => ({
        ...t,
        z: t.isMerged ? 20 : t.isNew ? 5 : t.z ?? 1,
      }));
    const partners = this.movingTiles
      .filter((t) => t.isMergePartner)
      .map((t) => ({ ...t, isFading: true, z: 10 }));
    return [...settled, ...partners];
  }

  getQuietTiles() {
    return this.tiles.map((t) => ({
      ...t,
      isNew: false,
      isMerged: false,
      isFading: false,
      isMergePartner: false,
    }));
  }

  clearAnimationFlags() {
    this.tiles = this.tiles.map((t) => ({
      ...t,
      isNew: false,
      isMerged: false,
    }));
  }

  /** One-shot settle frame (keeps isNew / isMerged for this paint only). */
  getTiles() {
    const current = this.tiles.map((t) => ({ ...t }));
    this.tiles = this.tiles.map((t) => ({
      ...t,
      isNew: false,
      isMerged: false,
    }));
    return current;
  }
}
