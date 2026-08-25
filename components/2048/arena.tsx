"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { GameBoard } from "./board";
import { GameController, boardToGrid } from "./game-engine";
import {
  Leaderboard,
  ProductHeader,
  ScoreBadge,
} from "./leaderboard";
import { productNameFromUrl, leaderboardStore } from "./storage";
import { ScriptEditor } from "./script-editor";
import {
  celebrateGameOver,
  celebrateScoreProgress,
} from "./score-confetti";
import { STARTER_SCRIPT, SCRIPT_HELP } from "./starter-script";
import type {
  Direction,
  LeaderboardEntry,
  ProductProfile,
  ScriptApi,
  TileView,
} from "./types";
import {
  GAME_OVER_DELAY_MS,
  MERGE_POP_LEAD,
  MOVE_ANIM_MS,
  POP_ANIM_MS,
} from "./types";

const DIRS: Direction[] = ["up", "down", "left", "right"];

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function ArenaApp() {
  const bootRef = useRef<GameController | null>(null);
  if (!bootRef.current) bootRef.current = new GameController(2048);
  const controllerRef = useRef<GameController | null>(bootRef.current);
  const animatingRef = useRef(false);
  const queuedRef = useRef<Direction | null>(null);
  const abortRef = useRef(false);
  const moveImplRef = useRef<(dir: Direction) => void>(() => {});
  const animTimerRef = useRef<number | null>(null);
  const slideGameRef = useRef<GameController | null>(null);
  const slideDoneRef = useRef(false);
  const slideEndedRef = useRef(false);
  const mergePopStartedRef = useRef(false);
  const mergePopAtRef = useRef(0);
  const mergePopTimerRef = useRef<number | null>(null);

  const [product, setProduct] = useState<ProductProfile | null>(null);
  const [urlInput, setUrlInput] = useState("oriensx.github.io");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [script, setScript] = useState(STARTER_SCRIPT);
  const [scriptLabel, setScriptLabel] = useState("starter");
  const [tiles, setTiles] = useState<TileView[]>(() =>
    bootRef.current!.tiles.map((t) => ({ ...t }))
  );
  const [sliding, setSliding] = useState(false);
  const [slideTargetCount, setSlideTargetCount] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const scoreRef = useRef(0);

  const updateScore = useCallback((next: number) => {
    celebrateScoreProgress(scoreRef.current, next);
    scoreRef.current = next;
    setScore(next);
  }, []);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
  }, []);

  useEffect(() => {
    void leaderboardStore.load().then((board) => setEntries(board.entries));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    return () => {
      root.style.colorScheme = "";
      if (hadDark) root.classList.add("dark");
    };
  }, []);

  const pushLog = useCallback((...args: unknown[]) => {
    const line = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
      .join(" ");
    setLogs((prev) => [...prev.slice(-80), line]);
  }, []);

  const commitScore = useCallback(
    async (finalScore: number) => {
      if (!product || finalScore <= 0) return;
      const next = await leaderboardStore.submit({
        product,
        score: finalScore,
        scriptLabel,
      });
      setEntries(next.entries);
    },
    [product, scriptLabel]
  );

  const markGameOver = useCallback(
    (finalScore: number) => {
      updateScore(finalScore);
      setGameOver(true);
      celebrateGameOver(finalScore);
      void commitScore(finalScore);
    },
    [commitScore, updateScore]
  );

  const clearAnimTimers = useCallback(() => {
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    if (mergePopTimerRef.current !== null) {
      window.clearTimeout(mergePopTimerRef.current);
      mergePopTimerRef.current = null;
    }
  }, []);

  const releaseMoveLock = useCallback(
    (game: GameController) => {
      animatingRef.current = false;
      slideGameRef.current = null;
      slideDoneRef.current = true;
      mergePopStartedRef.current = false;

      if (game.state.over) {
        window.setTimeout(() => {
          markGameOver(game.state.score);
        }, GAME_OVER_DELAY_MS);
        return;
      }
      const queued = queuedRef.current;
      queuedRef.current = null;
      if (queued) moveImplRef.current(queued);
    },
    [markGameOver]
  );

  const beginMergePop = useCallback((game: GameController) => {
    if (mergePopStartedRef.current) return;
    mergePopStartedRef.current = true;
    mergePopAtRef.current = Date.now();
    // Keep .is-sliding — outer transform keeps gliding while inner face pops.
    flushSync(() => {
      setTiles(game.getMergeSettleTiles());
    });
  }, []);

  const scheduleMergeCleanup = useCallback(
    (game: GameController) => {
      const elapsed = mergePopStartedRef.current
        ? Date.now() - mergePopAtRef.current
        : 0;
      const remaining = Math.max(0, POP_ANIM_MS - elapsed);
      animTimerRef.current = window.setTimeout(() => {
        if (controllerRef.current !== game) return;
        game.clearAnimationFlags();
        flushSync(() => {
          setTiles(game.getQuietTiles());
        });
        clearAnimTimers();
        releaseMoveLock(game);
      }, remaining);
    },
    [clearAnimTimers, releaseMoveLock]
  );

  const finishSlideAnimation = useCallback(
    (game: GameController) => {
      if (slideEndedRef.current) return;
      slideEndedRef.current = true;

      clearAnimTimers();

      if (game.hadMerge()) {
        if (!mergePopStartedRef.current) beginMergePop(game);
        flushSync(() => {
          setSliding(false);
        });
        scheduleMergeCleanup(game);
        return;
      }

      slideDoneRef.current = true;
      flushSync(() => {
        setSliding(false);
        setTiles(game.getTiles());
      });
      releaseMoveLock(game);
    },
    [
      beginMergePop,
      clearAnimTimers,
      releaseMoveLock,
      scheduleMergeCleanup,
    ]
  );

  const handleSlideComplete = useCallback(() => {
    const game = slideGameRef.current;
    if (!game || !animatingRef.current || slideEndedRef.current) return;
    finishSlideAnimation(game);
  }, [finishSlideAnimation]);

  const applyDirection = useCallback(
    (dir: Direction) => {
      const game = controllerRef.current;
      if (!game || game.state.over || animatingRef.current) {
        if (animatingRef.current) queuedRef.current = dir;
        return false;
      }

      // Snapshot settled layout before move() mutates controller.tiles.
      const fromVisual = game.tiles.map((t) => ({
        ...t,
        isNew: false,
        isMerged: false,
      }));

      const changed = game.move(dir);
      if (!changed) {
        if (game.state.over) {
          window.setTimeout(() => {
            markGameOver(game.state.score);
          }, GAME_OVER_DELAY_MS);
        }
        return false;
      }

      animatingRef.current = true;
      slideDoneRef.current = false;
      slideEndedRef.current = false;
      mergePopStartedRef.current = false;
      updateScore(game.state.score);
      setGameOver(false);

      const moving = game.getMovingTiles();
      const movingCount = Math.max(
        1,
        moving.filter((t) => {
          const from = fromVisual.find((f) => f.id === t.id);
          return from && (from.row !== t.row || from.col !== t.col);
        }).length
      );
      setSlideTargetCount(movingCount);
      slideGameRef.current = game;
      const hadMerge = game.hadMerge();

      flushSync(() => {
        setSliding(true);
        setTiles(fromVisual);
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (controllerRef.current !== game || !animatingRef.current) return;
          setTiles(moving);

          if (hadMerge) {
            mergePopTimerRef.current = window.setTimeout(() => {
              if (controllerRef.current !== game || !animatingRef.current) return;
              beginMergePop(game);
            }, Math.round(MOVE_ANIM_MS * MERGE_POP_LEAD));
          }

          animTimerRef.current = window.setTimeout(() => {
            handleSlideComplete();
          }, MOVE_ANIM_MS + 24);
        });
      });

      return true;
    },
    [beginMergePop, handleSlideComplete, markGameOver, updateScore]
  );

  moveImplRef.current = (dir: Direction) => {
    applyDirection(dir);
  };

  const resetGame = useCallback(() => {
    abortRef.current = true;
    setRunning(false);
    setBusy(false);
    clearAnimTimers();
    const game = new GameController();
    controllerRef.current = game;
    slideDoneRef.current = false;
    slideEndedRef.current = false;
    slideGameRef.current = null;
    mergePopStartedRef.current = false;
    setSliding(false);
    setTiles(game.getTiles());
    resetScore();
    setGameOver(false);
    animatingRef.current = false;
    queuedRef.current = null;
  }, [clearAnimTimers]);

  const startManualGame = useCallback(
    (nextProduct: ProductProfile) => {
      resetGame();
      setProduct(nextProduct);
      setLogs([]);
    },
    [resetGame]
  );

  const onSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profile = productNameFromUrl(urlInput);
      setUrlError(null);
      startManualGame(profile);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : "Invalid URL");
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!controllerRef.current) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.isContentEditable)
      ) {
        return;
      }
      const map: Record<string, Direction> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      };
      const dir = map[event.key.toLowerCase()];
      if (!dir) return;
      event.preventDefault();
      applyDirection(dir);
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [applyDirection]);

  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchOrigin.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchOrigin.current) return;
    const dx = e.changedTouches[0].clientX - touchOrigin.current.x;
    const dy = e.changedTouches[0].clientY - touchOrigin.current.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) > 30) {
      applyDirection(ax > ay ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    }
    touchOrigin.current = null;
  };

  const buildApi = useCallback((): ScriptApi => {
    return {
      board: () => {
        const game = controllerRef.current;
        return game
          ? boardToGrid(game.state.board)
          : Array.from({ length: 4 }, () => Array(4).fill(0));
      },
      score: () => controllerRef.current?.state.score ?? 0,
      over: () => controllerRef.current?.state.over ?? true,
      move: async (dir: Direction) => {
        if (abortRef.current) return false;
        if (!DIRS.includes(dir)) {
          pushLog("Invalid direction", dir);
          return false;
        }
        while (animatingRef.current) {
          if (abortRef.current) return false;
          await sleep(16);
        }
        const ok = applyDirection(dir);
        if (ok) {
          while (animatingRef.current) {
            if (abortRef.current) return false;
            await sleep(16);
          }
        }
        return ok;
      },
      sleep: async (ms: number) => {
        const clamped = Math.max(0, Math.min(5000, Number(ms) || 0));
        await sleep(clamped);
      },
      log: pushLog,
    };
  }, [applyDirection, pushLog]);

  const runScript = async () => {
    if (running) return;

    abortRef.current = false;
    setRunning(true);
    setBusy(true);
    setLogs((prev) => [...prev, "— script started —"]);

    const game = new GameController();
    controllerRef.current = game;
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    if (mergePopTimerRef.current !== null) {
      window.clearTimeout(mergePopTimerRef.current);
      mergePopTimerRef.current = null;
    }
    slideDoneRef.current = false;
    slideEndedRef.current = false;
    slideGameRef.current = null;
    mergePopStartedRef.current = false;
    setSliding(false);
    setTiles(game.getTiles());
    resetScore();
    setGameOver(false);
    animatingRef.current = false;
    queuedRef.current = null;

    const api = buildApi();

    try {
      // eslint-disable-next-line no-new-func
      const factory = new Function(
        "api",
        `${script}\n;return { chooseMove: typeof chooseMove === 'function' ? chooseMove : null, play: typeof play === 'function' ? play : null };`
      );
      const exports = factory(api) as {
        chooseMove: ((board: number[][]) => Direction | null) | null;
        play: ((api: ScriptApi) => Promise<void>) | null;
      };

      if (exports.play) {
        await exports.play(api);
      } else if (exports.chooseMove) {
        let guard = 0;
        while (!api.over() && !abortRef.current && guard < 20000) {
          const dir = exports.chooseMove(api.board());
          if (!dir) break;
          const moved = await api.move(dir);
          if (!moved) {
            let any = false;
            for (const d of DIRS) {
              if (d === dir) continue;
              if (await api.move(d)) {
                any = true;
                break;
              }
            }
            if (!any) break;
          }
          await api.sleep(40 + Math.random() * 120);
          guard++;
        }
      } else {
        pushLog("Script must export chooseMove(board) or play(api).");
      }
    } catch (err) {
      pushLog("Script error:", err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      setRunning(false);
      const final = controllerRef.current;
      if (final?.state.over) {
        markGameOver(final.state.score);
      } else if (final && final.state.score > 0) {
        await commitScore(final.state.score);
      }
      pushLog("— script ended · score=" + (final?.state.score ?? 0) + " —");
    }
  };

  const stopScript = () => {
    abortRef.current = true;
    setRunning(false);
  };

  const overlay = useMemo(() => {
    if (!gameOver) return null;
    return (
      <div className="flex w-full max-w-[260px] flex-col items-center gap-3">
        <h3 className="text-3xl font-black text-primary md:text-5xl">Game over</h3>
        <div className="w-full rounded-xl border-2 border-foreground bg-card px-3 py-2">
          <div className="font-mono text-xs font-bold text-muted-foreground">
            Final score
          </div>
          <div className="mt-1 font-mono text-4xl font-black leading-none text-primary">
            {score.toLocaleString()}
          </div>
        </div>
        <button
          type="button"
          className="arena-btn arena-btn-primary active-press h-10 w-full px-4 shadow-brutal"
          onClick={resetGame}
        >
          Play again
        </button>
      </div>
    );
  }, [gameOver, resetGame, score]);

  return (
    <div className="arena-2048">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <header className="arena-header -mx-4 flex items-center justify-between border-b-4 border-foreground px-4 py-4 md:-mx-8 md:px-8">
          <div className="relative flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border-2 border-foreground bg-primary text-xs font-black tracking-tighter text-background shadow-hard">
              2048
            </div>
            <div>
              <h1 className="text-2xl font-black leading-none tracking-wide md:text-3xl">
                2048 Arena
              </h1>
              <p className="mt-1 hidden font-mono text-xs font-bold text-primary sm:block">
                Write a bot. Rank your site.
              </p>
            </div>
          </div>
          <p className="relative hidden max-w-xs font-mono text-sm font-bold text-muted-foreground xl:block">
            Highest verified score of the UTC day wins.
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
          <section className="flex flex-col gap-6">
            <form
              onSubmit={onSubmitProduct}
              className="rounded-2xl border-4 border-foreground bg-card p-4 md:p-5"
            >
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-[14rem] flex-1 font-mono text-xs font-bold text-muted-foreground">
                  Your product site
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="mt-2 w-full rounded-[var(--radius)] border-2 border-foreground bg-background px-3 py-3 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="example.com"
                    autoComplete="url"
                  />
                </label>
                <button
                  type="submit"
                  className="arena-btn arena-btn-primary active-press h-12 px-6 shadow-brutal"
                >
                  {product ? "Update site" : "Claim site"}
                </button>
              </div>
              {urlError && (
                <p className="mt-2 font-mono text-sm font-bold text-destructive">
                  {urlError}
                </p>
              )}
              {product && (
                <p className="mt-3 font-mono text-xs font-bold text-muted-foreground">
                  Playing for {product.name} · {product.domain}
                </p>
              )}
            </form>

            <div className="flex flex-col gap-5 rounded-2xl border-4 border-foreground bg-card p-4 md:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-foreground pb-4">
                {product ? (
                  <ProductHeader
                    product={product}
                    onChange={() => {
                      stopScript();
                      setProduct(null);
                    }}
                  />
                ) : (
                  <div>
                    <div className="font-mono text-sm font-bold text-muted-foreground">
                      Board
                    </div>
                    <div className="text-2xl font-bold">Claim a site to rank</div>
                  </div>
                )}
                <ScoreBadge score={score} />
              </div>

              <GameBoard
                tiles={tiles}
                sliding={sliding}
                slideTargetCount={slideTargetCount}
                gameOver={gameOver}
                overlay={overlay}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onSlideComplete={handleSlideComplete}
              />

              <div className="flex flex-wrap gap-2">
                {DIRS.map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    disabled={busy}
                    onClick={() => applyDirection(dir)}
                    className="arena-btn arena-btn-outline active-press h-10 flex-1 px-3 text-xs capitalize shadow-brutal"
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <Leaderboard entries={entries} highlightId={product?.id} />
          </section>

          <section className="flex min-h-[32rem] flex-col gap-3 rounded-2xl border-4 border-foreground bg-card p-4 md:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-xs font-bold text-muted-foreground">
                  Bot script
                </div>
                <h2 className="text-xl font-black">Your program</h2>
              </div>
              <label className="font-mono text-xs font-bold text-muted-foreground">
                Label
                <input
                  value={scriptLabel}
                  onChange={(e) => setScriptLabel(e.target.value.slice(0, 24))}
                  className="ml-2 w-28 rounded-lg border-2 border-foreground bg-background px-2 py-1 font-mono text-xs text-foreground"
                />
              </label>
            </div>

            <p className="font-mono text-xs leading-relaxed text-muted-foreground">
              {SCRIPT_HELP}
            </p>

            <ScriptEditor value={script} onChange={setScript} />

            {!product && (
              <p className="font-mono text-xs font-bold text-primary">
                You can run without claiming a site. Scores only rank after you
                claim one.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void runScript()}
                className="arena-btn arena-btn-primary active-press h-12 flex-1 px-4 shadow-brutal"
              >
                {running ? "Running…" : "Run script"}
              </button>
              <button
                type="button"
                onClick={stopScript}
                className="arena-btn arena-btn-outline active-press h-12 px-4 shadow-brutal"
              >
                Stop
              </button>
              <button
                type="button"
                onClick={() => setScript(STARTER_SCRIPT)}
                className="arena-btn arena-btn-outline active-press h-12 px-4 shadow-brutal"
              >
                Reset sample
              </button>
            </div>

            <div className="max-h-40 overflow-auto rounded-xl border-2 border-foreground bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              {logs.length === 0 ? (
                <span>Logs will show up here.</span>
              ) : (
                logs.map((line, i) => (
                  <div key={`${i}-${line.slice(0, 12)}`}>{line}</div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
