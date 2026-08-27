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
  celebrateBoardProgress,
  celebrateGameOver,
  celebrateScoreProgress,
  resetConfetti,
} from "./score-confetti";
import { STARTER_SCRIPT, SCRIPT_HELP } from "./starter-script";
import {
  fetchLlmModels,
  generateBotFromPrompt,
  loadLlmBase,
  loadLlmModel,
  loadLlmToken,
  saveLlmBase,
  saveLlmModel,
  saveLlmToken,
  type ScriptMode,
} from "./prompt-generate";
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

type LogLine = {
  id: number;
  time: string;
  text: string;
};

function formatLogTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

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
  const [scriptMode, setScriptMode] = useState<ScriptMode>("prompt");
  const [promptText, setPromptText] = useState("");
  const [llmToken, setLlmToken] = useState("");
  const [llmBase, setLlmBase] = useState("");
  const [llmModel, setLlmModel] = useState("");
  const [llmModels, setLlmModels] = useState<string[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [modelFetchError, setModelFetchError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateNote, setGenerateNote] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [streamThinking, setStreamThinking] = useState("");
  const [streamContent, setStreamContent] = useState("");
  const generateAbortRef = useRef<AbortController | null>(null);
  const [tiles, setTiles] = useState<TileView[]>(() =>
    bootRef.current!.tiles.map((t) => ({ ...t }))
  );
  const [sliding, setSliding] = useState(false);
  const [slideTargetCount, setSlideTargetCount] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const logIdRef = useRef(0);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const [weekEntries, setWeekEntries] = useState<LeaderboardEntry[]>([]);
  const [allTimeEntries, setAllTimeEntries] = useState<LeaderboardEntry[]>([]);
  const [weekLabel, setWeekLabel] = useState("");
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
    void leaderboardStore.load().then((board) => {
      setWeekEntries(board.weekEntries);
      setAllTimeEntries(board.allTimeEntries);
      setWeekLabel(board.weekLabel);
    });
  }, []);

  useEffect(() => {
    setLlmToken(loadLlmToken());
    setLlmBase(loadLlmBase());
    setLlmModel(loadLlmModel());
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
    const text = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
      .join(" ");
    logIdRef.current += 1;
    const entry: LogLine = {
      id: logIdRef.current,
      time: formatLogTime(),
      text,
    };
    setLogs((prev) => [...prev.slice(-120), entry]);
  }, []);

  useEffect(() => {
    const el = logScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const commitScore = useCallback(
    async (finalScore: number) => {
      if (!product || finalScore <= 0) return;
      const next = await leaderboardStore.submit({
        product,
        score: finalScore,
        scriptLabel,
      });
      setWeekEntries(next.weekEntries);
      setAllTimeEntries(next.allTimeEntries);
      setWeekLabel(next.weekLabel);
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
    // Do NOT include the spawned tile yet: transition is still on and would fly it in.
    flushSync(() => {
      setTiles(game.getMergeSettleTiles(false));
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
        // Sliding off first, then reveal spawn (no position transition).
        flushSync(() => {
          setSliding(false);
          setTiles(game.getMergeSettleTiles(true));
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
      const prevBoard = game.state.board.slice();

      const changed = game.move(dir);
      if (!changed) {
        if (game.state.over) {
          window.setTimeout(() => {
            markGameOver(game.state.score);
          }, GAME_OVER_DELAY_MS);
        }
        return false;
      }

      celebrateBoardProgress(prevBoard, game.state.board);
      animatingRef.current = true;
      slideDoneRef.current = false;
      slideEndedRef.current = false;
      mergePopStartedRef.current = false;
      updateScore(game.state.score);
      setGameOver(false);

      const movingRaw = game.getMovingTiles();
      const travelerIds = new Set(
        movingRaw
          .filter((t) => {
            const from = fromVisual.find((f) => f.id === t.id);
            return Boolean(from && (from.row !== t.row || from.col !== t.col));
          })
          .map((t) => t.id)
      );
      const moving = movingRaw.map((t) => ({
        ...t,
        isMoving: travelerIds.has(t.id),
      }));
      const movingCount = Math.max(1, travelerIds.size);
      setSlideTargetCount(movingCount);
      slideGameRef.current = game;
      const hadMerge = game.hadMerge();

      // Paint travelers at the START cell with transition armed, then move
      // them next frame — otherwise a lone sliding tile jumps with no animation.
      flushSync(() => {
        setSliding(true);
        setTiles(
          fromVisual.map((t) => ({
            ...t,
            isMoving: travelerIds.has(t.id),
          }))
        );
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
    resetConfetti();
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
  }, [clearAnimTimers, resetScore]);

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
    setLogs((prev) => [
      ...prev,
      {
        id: ++logIdRef.current,
        time: formatLogTime(),
        text: "— script started —",
      },
    ]);

    const game = new GameController();
    controllerRef.current = game;
    resetConfetti();
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
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-3 overflow-x-clip px-3 py-2 md:gap-4 md:px-4 md:py-3 md:pb-6">
        <header className="arena-header flex items-center justify-between border-b-2 border-foreground py-1.5 md:py-2">
          <div className="relative flex min-w-0 items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary text-[10px] font-black tracking-tighter text-background shadow-hard md:size-8 md:text-xs">
              2048
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black leading-none tracking-wide md:text-xl">
                2048 Arena
              </h1>
              <p className="mt-0.5 hidden font-mono text-xs font-bold leading-none text-primary md:block">
                Write a bot. Rank your site.
              </p>
            </div>
          </div>
          <p className="relative hidden max-w-[14rem] shrink font-mono text-xs font-bold leading-snug text-muted-foreground xl:block">
            Highest verified score of the competition week wins.
          </p>
        </header>

        <div className="grid min-w-0 flex-1 gap-3 md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <section className="flex min-w-0 flex-col gap-3 md:gap-4">
            {!product && (
              <form
                onSubmit={onSubmitProduct}
                className="min-w-0 rounded-2xl border-4 border-foreground bg-card p-3 md:p-4"
              >
                <div className="flex min-w-0 flex-wrap items-end gap-3">
                  <label className="min-w-0 flex-1 basis-40 font-mono text-xs font-bold text-muted-foreground">
                    Your product site
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="mt-2 w-full min-w-0 rounded-[var(--radius)] border-2 border-foreground bg-background px-3 py-3 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="example.com"
                      autoComplete="url"
                    />
                  </label>
                  <button
                    type="submit"
                    className="arena-btn arena-btn-primary active-press h-12 shrink-0 px-5 shadow-brutal"
                  >
                    Claim site
                  </button>
                </div>
                {urlError && (
                  <p className="mt-2 font-mono text-sm font-bold text-destructive">
                    {urlError}
                  </p>
                )}
              </form>
            )}

            <div className="flex min-w-0 flex-col gap-2.5 rounded-2xl border-4 border-foreground bg-card p-2.5 md:gap-3 md:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-foreground pb-2 md:gap-3">
                {product ? (
                  <ProductHeader
                    product={product}
                    onChange={() => {
                      stopScript();
                      setProduct(null);
                    }}
                  />
                ) : (
                  <div className="min-w-0 font-mono text-xs font-bold text-muted-foreground">
                    Board
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
            </div>

            <Leaderboard
              weekEntries={weekEntries}
              allTimeEntries={allTimeEntries}
              weekLabel={weekLabel}
              highlightId={product?.id}
            />
          </section>

          <section className="flex min-h-0 min-w-0 flex-col gap-3 rounded-2xl border-4 border-foreground bg-card p-3 md:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold text-muted-foreground">
                  Bot script
                </div>
                <h2 className="text-xl font-black">Your program</h2>
              </div>
              <div
                role="group"
                aria-label="Script mode"
                className="arena-segment"
              >
                <button
                  type="button"
                  aria-pressed={scriptMode === "prompt"}
                  onClick={() => setScriptMode("prompt")}
                >
                  Prompt
                </button>
                <button
                  type="button"
                  aria-pressed={scriptMode === "code"}
                  onClick={() => setScriptMode("code")}
                >
                  Code
                </button>
              </div>
            </div>

            {scriptMode === "prompt" ? (
              <>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  Paste an API token for any Chat Completions–compatible
                  endpoint, describe a strategy, and generate JavaScript into
                  the Code desk. The token stays in this browser only.
                </p>
                <label className="font-mono text-xs font-bold text-muted-foreground">
                  API token
                  <input
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    value={llmToken}
                    onChange={(e) => {
                      const next = e.target.value;
                      setLlmToken(next);
                      saveLlmToken(next);
                    }}
                    placeholder="Your API token"
                    className="mt-2 w-full min-w-0 rounded-xl border-2 border-foreground bg-background px-3 py-2.5 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <label className="min-w-0 font-mono text-xs font-bold text-muted-foreground">
                    Base URL
                    <input
                      value={llmBase}
                      onChange={(e) => {
                        const next = e.target.value;
                        setLlmBase(next);
                        saveLlmBase(next);
                      }}
                      placeholder="https://…/v1"
                      className="mt-2 w-full min-w-0 rounded-xl border-2 border-foreground bg-background px-3 py-2.5 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <label className="min-w-0 font-mono text-xs font-bold text-muted-foreground">
                    Model
                    <div className="relative mt-2">
                      <input
                        value={llmModel}
                        list="arena-llm-models"
                        onChange={(e) => {
                          const next = e.target.value;
                          setLlmModel(next);
                          saveLlmModel(next);
                        }}
                        placeholder="Model id"
                        className="w-full min-w-0 rounded-xl border-2 border-foreground bg-background py-2.5 pl-3 pr-16 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        disabled={fetchingModels || !llmToken.trim() || !llmBase.trim()}
                        onClick={() => {
                          void (async () => {
                            setFetchingModels(true);
                            setModelFetchError(null);
                            try {
                              const models = await fetchLlmModels({
                                token: llmToken,
                                baseUrl: llmBase,
                              });
                              setLlmModels(models);
                              const pick = models.includes(llmModel)
                                ? llmModel
                                : models[0]!;
                              setLlmModel(pick);
                              saveLlmModel(pick);
                              pushLog(`Loaded ${models.length} models`);
                            } catch (err) {
                              const msg =
                                err instanceof Error ? err.message : String(err);
                              setModelFetchError(msg);
                              pushLog(`Models fetch failed: ${msg}`);
                            } finally {
                              setFetchingModels(false);
                            }
                          })();
                        }}
                        className="absolute inset-y-0 right-1 my-auto h-7 px-2 font-mono text-xs font-bold text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
                      >
                        {fetchingModels ? "…" : "Fetch"}
                      </button>
                      <datalist id="arena-llm-models">
                        {llmModels.map((id) => (
                          <option key={id} value={id} />
                        ))}
                      </datalist>
                    </div>
                  </label>
                </div>
                {modelFetchError && (
                  <p className="font-mono text-xs font-bold text-destructive">
                    {modelFetchError}
                  </p>
                )}
                {llmModels.length > 0 && (
                  <div className="flex max-h-28 flex-wrap gap-1.5 overflow-auto">
                    {llmModels.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setLlmModel(id);
                          saveLlmModel(id);
                        }}
                        className={`rounded-full border-2 border-foreground px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                          llmModel === id
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                )}
                <label className="font-mono text-xs font-bold text-muted-foreground">
                  Strategy prompt
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={5}
                    placeholder="e.g. Keep the max tile in a corner, prefer merges, avoid up early…"
                    className="mt-2 w-full min-w-0 resize-y rounded-xl border-2 border-foreground bg-background px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <button
                  type="button"
                  disabled={
                    generating ||
                    !promptText.trim() ||
                    !llmToken.trim() ||
                    !llmBase.trim() ||
                    !llmModel.trim()
                  }
                  onClick={() => {
                    void (async () => {
                      generateAbortRef.current?.abort();
                      const ac = new AbortController();
                      generateAbortRef.current = ac;
                      setGenerating(true);
                      setGenerateError(null);
                      setGenerateNote(null);
                      setStreamThinking("");
                      setStreamContent("");
                      try {
                        const bot = await generateBotFromPrompt(
                          {
                            prompt: promptText,
                            token: llmToken,
                            baseUrl: llmBase,
                            model: llmModel,
                          },
                          {
                            signal: ac.signal,
                            onThinking: setStreamThinking,
                            onContent: setStreamContent,
                          }
                        );
                        setScript(bot.script);
                        setScriptLabel(bot.label);
                        setGenerateNote(
                          "Script filled — switch to Code to run or edit."
                        );
                        pushLog(`Generated bot via ${llmModel}`);
                      } catch (err) {
                        if (
                          err instanceof DOMException &&
                          err.name === "AbortError"
                        ) {
                          setGenerateNote("Generation cancelled.");
                          return;
                        }
                        const msg =
                          err instanceof Error ? err.message : String(err);
                        setGenerateError(msg);
                        pushLog(`Generate failed: ${msg}`);
                      } finally {
                        setGenerating(false);
                        generateAbortRef.current = null;
                      }
                    })();
                  }}
                  className="arena-btn arena-btn-primary active-press h-11 w-full px-4 shadow-brutal sm:h-12"
                >
                  {generating ? "Generating…" : "Generate into editor"}
                </button>
                {(generating || streamThinking || streamContent) && (
                  <div className="arena-stream" aria-live="polite">
                    <div className="arena-stream-block">
                      <div className="arena-stream-label">Thinking</div>
                      <div className="arena-stream-body is-thinking">
                        {streamThinking ||
                          (generating ? "Waiting for model…" : "—")}
                      </div>
                    </div>
                    <div className="arena-stream-block">
                      <div className="arena-stream-label">Output</div>
                      <div className="arena-stream-body">
                        {streamContent ||
                          (generating ? "…" : "—")}
                      </div>
                    </div>
                  </div>
                )}
                {generateNote && (
                  <p className="font-mono text-xs font-bold text-primary">
                    {generateNote}
                  </p>
                )}
                {generateError && (
                  <p className="font-mono text-xs font-bold text-destructive">
                    {generateError}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {SCRIPT_HELP}
                </p>

                {!product && (
                  <p className="font-mono text-xs font-bold text-primary">
                    You can run without claiming a site. Scores only rank after
                    you claim one.
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runScript()}
                    className="arena-btn arena-btn-primary active-press h-11 flex-1 px-4 shadow-brutal sm:h-12"
                  >
                    {running ? "Running…" : "Run script"}
                  </button>
                  <button
                    type="button"
                    onClick={stopScript}
                    className="arena-btn arena-btn-outline active-press h-11 px-4 shadow-brutal sm:h-12"
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScript(STARTER_SCRIPT);
                      setScriptLabel("starter");
                    }}
                    className="arena-btn arena-btn-outline active-press h-11 px-4 shadow-brutal sm:h-12"
                  >
                    Reset sample
                  </button>
                </div>

                <ScriptEditor value={script} onChange={setScript} />

                <div
                  ref={logScrollRef}
                  className="arena-log"
                  aria-label="Run logs"
                >
                  {logs.length === 0 ? (
                    <div className="arena-log-empty">Logs will show up here.</div>
                  ) : (
                    logs.map((line) => (
                      <div key={line.id} className="arena-log-row">
                        <time className="arena-log-time" dateTime={line.time}>
                          {line.time}
                        </time>
                        <span className="arena-log-text">{line.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
