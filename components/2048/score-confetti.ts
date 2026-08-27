import confetti from "canvas-confetti";

/** Score thresholds that trigger a celebration (total game score). */
const SCORE_MILESTONES = [
  512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 100_000, 250_000,
  500_000,
];

const ARENA_COLORS = [
  "#e8955a",
  "#e8794a",
  "#f5efe5",
  "#e8c85a",
  "#e84f3a",
  "#7a5c4e",
  "#ffd27a",
  "#fff6e8",
];

const GOLD_COLORS = ["#ffd27a", "#f5efe5", "#e8c85a", "#e8955a", "#ffffff"];

const sideTimers = new Set<number>();

type ConfettiFn = (opts?: confetti.Options) => Promise<null> | null;

let boardConfetti: ConfettiFn | null = null;

/** Bind confetti to the board canvas so bursts stay inside the game frame. */
export function bindConfettiCanvas(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    boardConfetti = null;
    return;
  }
  boardConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: false,
  });
}

function tierIndex(milestone: number) {
  const idx = SCORE_MILESTONES.indexOf(milestone);
  return idx >= 0 ? idx : SCORE_MILESTONES.length;
}

/** soft | medium | big — drives duration and particle budget. */
function intensityForTier(tier: number): "soft" | "medium" | "big" {
  if (tier <= 1) return "soft"; // 512, 1024
  if (tier <= 3) return "medium"; // 2048, 4096
  return "big"; // 8192+
}

function celebrateDurationMs(tier: number) {
  const level = intensityForTier(tier);
  if (level === "soft") return 1600 + tier * 200; // ~1.6–1.8s
  if (level === "medium") return 3200 + (tier - 2) * 400; // ~3.2–3.6s
  return Math.min(5500 + (tier - 4) * 500, 9000);
}

function fireBurst(opts: confetti.Options & { particleCount: number }) {
  const run = boardConfetti ?? confetti;
  void run({
    disableForReducedMotion: true,
    colors: ARENA_COLORS,
    ...opts,
  });
}

function clearTimers() {
  for (const id of sideTimers) {
    window.clearInterval(id);
    window.clearTimeout(id);
  }
  sideTimers.clear();
}

function trackInterval(fn: () => void, ms: number) {
  const id = window.setInterval(fn, ms);
  sideTimers.add(id);
  return id;
}

function trackTimeout(fn: () => void, ms: number) {
  const id = window.setTimeout(() => {
    sideTimers.delete(id);
    fn();
  }, ms);
  sideTimers.add(id);
  return id;
}

/** Stop ongoing bursts (e.g. Play again). */
export function resetConfetti() {
  clearTimers();
  celebratedFirstTiles.clear();
  celebratedTileCounts.clear();
  if (boardConfetti && "reset" in boardConfetti) {
    (boardConfetti as { reset: () => void }).reset();
  } else {
    confetti.reset();
  }
}

/** First appearance of these tile values this game. */
const FIRST_TILE_MILESTONES = [
  128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536,
];

/** Celebrate when board holds N copies of these values. */
const MULTI_TILE_TARGETS: Array<{ value: number; counts: number[] }> = [
  { value: 128, counts: [2, 3] },
  { value: 256, counts: [2, 3] },
  { value: 512, counts: [2, 3] },
  { value: 1024, counts: [2] },
  { value: 2048, counts: [2] },
  { value: 4096, counts: [2] },
];

const celebratedFirstTiles = new Set<number>();
const celebratedTileCounts = new Set<string>();

function countTiles(board: number[]) {
  const map = new Map<number, number>();
  for (const v of board) {
    if (v < 2) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

/** Tiny board-local pop — does not cancel a bigger celebration. */
function softTilePop(strength: number) {
  const n = Math.round(10 + strength * 8);
  fireBurst({
    particleCount: n,
    spread: 55 + strength * 8,
    ticks: 180 + strength * 20,
    scalar: 0.65 + strength * 0.06,
    origin: { x: 0.5, y: 0.55 },
    startVelocity: 16 + strength * 2,
    gravity: 1.05,
  });
  if (strength >= 2) {
    fireBurst({
      particleCount: Math.round(5 + strength * 3),
      angle: 60,
      spread: 40,
      ticks: 160,
      scalar: 0.6,
      origin: { x: 0.08, y: 0.6 },
      startVelocity: 14 + strength,
      gravity: 1.05,
    });
    fireBurst({
      particleCount: Math.round(5 + strength * 3),
      angle: 120,
      spread: 40,
      ticks: 160,
      scalar: 0.6,
      origin: { x: 0.92, y: 0.6 },
      startVelocity: 14 + strength,
      gravity: 1.05,
    });
  }
}

function firstTileStrength(value: number) {
  if (value <= 128) return 0.5;
  if (value <= 256) return 1;
  if (value <= 512) return 1.5;
  if (value <= 1024) return 2.5;
  if (value <= 2048) return 3.5;
  return 4.5;
}

/**
 * Fire on newly created tile values / multi-copy moments this game.
 * Soft pops stack lightly; large first tiles (2048+) use a short milestone.
 */
export function celebrateBoardProgress(prevBoard: number[], nextBoard: number[]) {
  const prev = countTiles(prevBoard);
  const next = countTiles(nextBoard);

  let bestFirst: number | null = null;
  for (const value of FIRST_TILE_MILESTONES) {
    if ((next.get(value) ?? 0) > 0 && (prev.get(value) ?? 0) === 0) {
      if (!celebratedFirstTiles.has(value)) {
        celebratedFirstTiles.add(value);
        bestFirst = value;
      }
    }
  }

  let bestMulti: { value: number; count: number } | null = null;
  for (const { value, counts } of MULTI_TILE_TARGETS) {
    for (const need of counts) {
      const key = `${value}:${need}`;
      if (
        (next.get(value) ?? 0) >= need &&
        (prev.get(value) ?? 0) < need &&
        !celebratedTileCounts.has(key)
      ) {
        celebratedTileCounts.add(key);
        if (!bestMulti || value * need > bestMulti.value * bestMulti.count) {
          bestMulti = { value, count: need };
        }
      }
    }
  }

  // Prefer the biggest new first-tile; otherwise multi-copy pop.
  if (bestFirst != null) {
    if (bestFirst >= 2048) {
      // Map tile value onto score-milestone tiers for a fuller (still scoped) show.
      const mapped =
        bestFirst >= 8192 ? 8192 : bestFirst >= 4096 ? 4096 : 2048;
      celebrateMilestone(mapped);
    } else {
      softTilePop(firstTileStrength(bestFirst));
    }
    return;
  }

  if (bestMulti) {
    softTilePop(
      firstTileStrength(bestMulti.value) * 0.75 + bestMulti.count * 0.35
    );
  }
}


function openingSalvo(tier: number) {
  const level = intensityForTier(tier);
  const scalar =
    level === "soft"
      ? 0.75
      : Math.min(0.85 + tier * 0.05, 1.35);
  const velocity =
    level === "soft" ? 22 : level === "medium" ? 28 + tier : 34 + tier * 3;
  const baseCount =
    level === "soft"
      ? 28 + tier * 8
      : level === "medium"
        ? 48 + tier * 12
        : Math.min(70 + tier * 16, 160);

  fireBurst({
    particleCount: baseCount,
    spread: level === "soft" ? 70 : 95,
    ticks: level === "soft" ? 220 : 360,
    scalar,
    origin: { x: 0.5, y: 0.48 },
    startVelocity: velocity,
    gravity: 0.95,
  });

  if (level !== "soft") {
    fireBurst({
      particleCount: Math.min(20 + tier * 6, 70),
      spread: 360,
      ticks: 320,
      scalar: scalar * 0.85,
      shapes: ["star"],
      colors: GOLD_COLORS,
      origin: { x: 0.5, y: 0.42 },
      startVelocity: velocity * 0.7,
      gravity: 0.75,
    });
  }
}

function sideCannons(tier: number) {
  const level = intensityForTier(tier);
  const count =
    level === "soft"
      ? 6
      : level === "medium"
        ? 10 + tier
        : Math.min(14 + tier * 2, 32);
  const scalar = level === "soft" ? 0.7 : Math.min(0.85 + tier * 0.04, 1.25);
  const ticks = level === "soft" ? 200 : 320;

  fireBurst({
    particleCount: count,
    angle: 55 + Math.random() * 20,
    spread: 50 + Math.random() * 14,
    ticks,
    scalar,
    origin: { x: 0.02, y: 0.55 + Math.random() * 0.2 },
    startVelocity: 18 + tier * 2 + Math.random() * 6,
    gravity: 1,
  });
  fireBurst({
    particleCount: count,
    angle: 125 - Math.random() * 20,
    spread: 50 + Math.random() * 14,
    ticks,
    scalar,
    origin: { x: 0.98, y: 0.55 + Math.random() * 0.2 },
    startVelocity: 18 + tier * 2 + Math.random() * 6,
    gravity: 1,
  });
}

function skyFirework(tier: number) {
  const x = 0.22 + Math.random() * 0.56;
  const y = 0.22 + Math.random() * 0.28;
  const scalar = Math.min(0.9 + tier * 0.04, 1.3);

  fireBurst({
    particleCount: Math.min(28 + tier * 8, 90),
    spread: 360,
    ticks: 320,
    scalar,
    origin: { x, y },
    startVelocity: 14 + tier + Math.random() * 8,
    gravity: 0.85,
    decay: 0.92,
  });

  if (tier >= 4) {
    fireBurst({
      particleCount: Math.min(14 + tier * 3, 40),
      spread: 360,
      ticks: 280,
      scalar: scalar * 0.8,
      shapes: ["star"],
      colors: GOLD_COLORS,
      origin: { x, y },
      startVelocity: 10 + Math.random() * 8,
      gravity: 0.7,
    });
  }
}

function rainingFinale(tier: number) {
  fireBurst({
    particleCount: Math.min(40 + tier * 8, 100),
    spread: 100,
    ticks: 360,
    scalar: Math.min(0.95 + tier * 0.03, 1.25),
    origin: { x: 0.5, y: 0.02 },
    startVelocity: 8 + tier,
    gravity: 1.1,
    drift: (Math.random() - 0.5) * 0.6,
  });
}

/**
 * Tiered celebration clipped to the board canvas.
 * 512/1024 stay short; bigger milestones grow longer and denser.
 */
export function celebrateMilestone(milestone: number) {
  resetConfetti();

  const tier = tierIndex(milestone);
  const level = intensityForTier(tier);
  const durationMs = celebrateDurationMs(tier);
  const end = Date.now() + durationMs;

  openingSalvo(tier);

  if (level === "soft") {
    // One light follow-up, then done — no cannon loops / rain.
    trackTimeout(() => sideCannons(tier), 380);
    trackTimeout(() => clearTimers(), durationMs + 120);
    return;
  }

  trackTimeout(() => {
    fireBurst({
      particleCount: Math.min(36 + tier * 10, 100),
      spread: 85,
      ticks: 320,
      scalar: Math.min(0.95 + tier * 0.04, 1.3),
      origin: { x: 0.5, y: 0.52 },
      startVelocity: 22 + tier * 2,
    });
  }, 400);

  const cannonInterval = level === "medium" ? 320 : Math.max(200, 280 - tier * 10);
  trackInterval(() => {
    if (Date.now() >= end) return;
    sideCannons(tier);
  }, cannonInterval);

  if (level === "big") {
    const fireworkInterval = Math.max(560, 780 - tier * 25);
    trackTimeout(() => {
      trackInterval(() => {
        if (Date.now() >= end - 600) return;
        skyFirework(tier);
      }, fireworkInterval);
    }, 900);

    trackTimeout(() => {
      rainingFinale(tier);
      if (tier >= 5) trackTimeout(() => rainingFinale(tier), 650);
    }, Math.max(durationMs - 1800, 2800));

    trackTimeout(() => {
      sideCannons(tier);
      openingSalvo(tier);
    }, durationMs - 700);
  }

  trackTimeout(() => {
    clearTimers();
  }, durationMs + 200);
}

/** Fire when score crosses new milestones during play. */
export function celebrateScoreProgress(prevScore: number, nextScore: number) {
  if (nextScore <= prevScore) return;
  let top: number | null = null;
  for (const milestone of SCORE_MILESTONES) {
    if (prevScore < milestone && nextScore >= milestone) {
      top = milestone;
    }
  }
  if (top != null) celebrateMilestone(top);
}

/** Extra finale on game over for high totals. */
export function celebrateGameOver(finalScore: number) {
  if (finalScore < 512) return;

  const reached = SCORE_MILESTONES.filter((m) => finalScore >= m);
  const top = reached[reached.length - 1] ?? 512;
  celebrateMilestone(
    SCORE_MILESTONES[Math.min(tierIndex(top) + 1, SCORE_MILESTONES.length - 1)] ??
      top
  );
}
