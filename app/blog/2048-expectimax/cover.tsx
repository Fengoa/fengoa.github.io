"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  applyMove,
  boardToGrid,
  createInitialState,
  type EngineState,
} from "@/components/2048/game-engine";
import type { Direction } from "@/components/2048/types";

const DIRS: Direction[] = ["up", "left", "down", "right"];

const TILE_BG: Record<number, string> = {
  2: "#f0e6d8",
  4: "#eddcc4",
  8: "#e8955a",
  16: "#e8794a",
  32: "#ef6b4a",
  64: "#e84f3a",
  128: "#e8c85a",
  256: "#e4c04a",
  512: "#e0b83f",
  1024: "#e8c83a",
  2048: "#ebc82e",
  4096: "#c99528",
  8192: "#9a6b3a",
};

function tileFg(v: number) {
  return v >= 8 ? "#f5efe5" : "#7a5c4e";
}

function emptyCount(board: number[]) {
  let n = 0;
  for (const v of board) if (v === 0) n++;
  return n;
}

function pickDir(state: EngineState): Direction | null {
  let best: Direction | null = null;
  let bestKey = -Infinity;
  for (const dir of DIRS) {
    const result = applyMove(state, dir);
    if (!result.changed) continue;
    const key =
      emptyCount(result.state.board) * 1000 +
      (result.state.score - state.score);
    if (key > bestKey) {
      bestKey = key;
      best = dir;
    }
  }
  return best;
}

function fontSize(v: number) {
  if (v >= 1000) return "text-[9px] sm:text-[11px]";
  if (v >= 100) return "text-[11px] sm:text-xs";
  return "text-xs sm:text-sm";
}

/**
 * 封面：Arena 风格棋盘自动落子，展示 bot 推盘观感。
 */
export function Expectimax2048Cover({ className }: { className?: string }) {
  const stateRef = useRef<EngineState | null>(null);
  if (!stateRef.current) stateRef.current = createInitialState(2048);

  const [grid, setGrid] = useState(() =>
    boardToGrid(stateRef.current!.board)
  );
  const [score, setScore] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let alive = true;
    const tick = () => {
      if (!alive || !stateRef.current) return;
      let state = stateRef.current;
      if (state.over) {
        state = createInitialState();
        stateRef.current = state;
        setGrid(boardToGrid(state.board));
        setScore(0);
        return;
      }
      const dir = pickDir(state);
      if (!dir) {
        state = createInitialState();
        stateRef.current = state;
        setGrid(boardToGrid(state.board));
        setScore(0);
        return;
      }
      const result = applyMove(state, dir);
      stateRef.current = result.state;
      setGrid(boardToGrid(result.state.board));
      setScore(result.state.score);
    };

    const id = window.setInterval(tick, 420);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "flex flex-col items-center justify-center gap-3 p-4 sm:p-5",
        className
      )}
      style={{ background: "#f5efe5", color: "#7a5c4e" }}
    >
      <div className="flex w-full max-w-[15rem] items-end justify-between px-0.5">
        <div className="font-mono text-xs font-bold tracking-wide opacity-70">
          Expectimax
        </div>
        <div
          className="rounded-lg border-2 px-2 py-1 font-mono text-xs font-bold shadow-[2px_2px_0_#7a5c4e]"
          style={{
            borderColor: "#7a5c4e",
            background: "#e8955a",
            color: "#5c4033",
          }}
        >
          {score.toLocaleString()}
        </div>
      </div>

      <div
        className="grid aspect-square w-full max-w-[15rem] grid-cols-4 grid-rows-4 gap-1.5 rounded-[1.1rem] border-4 p-1.5"
        style={{ background: "#b6a090", borderColor: "#7a5c4e" }}
      >
        {grid.flatMap((row, r) =>
          row.map((value, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                "flex items-center justify-center rounded-lg border-2 font-mono font-bold leading-none shadow-[2px_2px_0_#7a5c4e]",
                fontSize(value)
              )}
              style={{
                borderColor: "#7a5c4e",
                background:
                  value === 0
                    ? "rgb(245 239 229 / 0.4)"
                    : TILE_BG[value] ?? "#5a3d7a",
                color: value === 0 ? "transparent" : tileFg(value),
              }}
            >
              {value || ""}
            </div>
          ))
        )}
      </div>

      <div className="font-mono text-xs font-bold opacity-55">
        auto · row heuristic
      </div>
    </div>
  );
}
