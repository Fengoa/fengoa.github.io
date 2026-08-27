"use client";

import { useCallback, useEffect, useRef } from "react";
import type { TileView } from "./types";

function tileBg(value: number) {
  if (value <= 8192) return `var(--tile-${value})`;
  return "var(--tile-super)";
}

function tileFg(value: number) {
  return value >= 8 ? "var(--arena-bg)" : "var(--arena-fg)";
}

function tileTextClass(value: number) {
  if (value >= 10000) return "text-xl md:text-2xl";
  if (value >= 1000) return "text-2xl md:text-3xl";
  if (value >= 100) return "text-3xl md:text-4xl";
  return "text-4xl md:text-5xl";
}

function Tile({ tile }: { tile: TileView }) {
  const fx = tile.isMerged
    ? "tile-pop"
    : tile.isNew
      ? "tile-spawn"
      : tile.isFading
        ? "tile-merge-partner"
        : "";

  return (
    <div
      className="tile-position absolute left-0 top-0 box-border p-1"
      style={{
        width: "25%",
        height: "25%",
        transform: `translate(${tile.col * 100}%, ${tile.row * 100}%)`,
        zIndex: tile.z ?? 1,
      }}
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-xl border-2 font-mono font-bold leading-none shadow-hard ${tileTextClass(tile.value)} ${fx}`}
        style={{
          backgroundColor: tileBg(tile.value),
          color: tileFg(tile.value),
        }}
      >
        {tile.value}
      </div>
    </div>
  );
}

export function GameBoard({
  tiles,
  sliding,
  slideTargetCount = 1,
  gameOver,
  overlay,
  onTouchStart,
  onTouchEnd,
  onSlideComplete,
}: {
  tiles: TileView[];
  sliding?: boolean;
  /** How many tiles should fire transform transitionend before slide is done. */
  slideTargetCount?: number;
  gameOver: boolean;
  overlay?: React.ReactNode;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onSlideComplete?: () => void;
}) {
  const slideEndsRef = useRef(0);

  useEffect(() => {
    if (sliding) slideEndsRef.current = 0;
  }, [sliding, tiles]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (!sliding || !onSlideComplete) return;
      if (e.propertyName !== "transform") return;
      if (!(e.target as HTMLElement).classList.contains("tile-position")) return;

      slideEndsRef.current += 1;
      if (slideEndsRef.current >= slideTargetCount) {
        onSlideComplete();
      }
    },
    [sliding, onSlideComplete, slideTargetCount]
  );

  return (
    <div
      className={`board-slot relative mx-auto aspect-square touch-none select-none overflow-hidden rounded-[1.5rem] border-4 p-1.5 shadow-brutal-primary md:rounded-[2rem] md:p-2${sliding ? " is-sliding" : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="absolute inset-2 grid grid-cols-4 grid-rows-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="board-cell m-1 h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-xl border-2"
          />
        ))}
      </div>

      <div className="absolute inset-2">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>

      {gameOver && (
        <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto rounded-[calc(2rem-4px)] bg-[color:var(--arena-bg)]/95 p-4 text-center">
          {overlay ?? (
            <h3 className="text-3xl font-black text-primary md:text-5xl">
              Game over
            </h3>
          )}
        </div>
      )}
    </div>
  );
}
