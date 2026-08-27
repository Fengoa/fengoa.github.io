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

function tierIndex(milestone: number) {
  const idx = SCORE_MILESTONES.indexOf(milestone);
  return idx >= 0 ? idx : SCORE_MILESTONES.length;
}

function celebrateDurationMs(tier: number) {
  // ~8–12s: longer and louder for bigger milestones
  return Math.min(8000 + tier * 400, 12_000);
}

function fireBurst(
  opts: confetti.Options & { particleCount: number }
) {
  void confetti({
    disableForReducedMotion: true,
    colors: ARENA_COLORS,
    zIndex: 1200,
    ...opts,
  });
}

function clearTimers() {
  for (const id of sideTimers) window.clearInterval(id);
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
  confetti.reset();
}

function openingSalvo(tier: number) {
  const scalar = Math.min(0.95 + tier * 0.08, 1.6);
  const velocity = 32 + tier * 5;

  fireBurst({
    particleCount: Math.min(90 + tier * 28, 280),
    spread: 100,
    ticks: 420,
    scalar,
    origin: { x: 0.5, y: 0.42 },
    startVelocity: velocity,
    gravity: 0.85,
  });

  fireBurst({
    particleCount: Math.min(40 + tier * 12, 120),
    spread: 360,
    ticks: 380,
    scalar: scalar * 0.9,
    shapes: ["star"],
    colors: GOLD_COLORS,
    origin: { x: 0.5, y: 0.38 },
    startVelocity: velocity * 0.75,
    gravity: 0.7,
  });
}

function sideCannons(tier: number) {
  const count = Math.max(14, Math.min(18 + tier * 4, 55));
  const scalar = Math.min(0.9 + tier * 0.07, 1.5);
  const ticks = 380 + Math.min(tier * 20, 120);

  fireBurst({
    particleCount: count,
    angle: 55 + Math.random() * 20,
    spread: 58 + Math.random() * 18,
    ticks,
    scalar,
    origin: { x: 0, y: 0.62 + Math.random() * 0.2 },
    startVelocity: 28 + tier * 3 + Math.random() * 10,
    gravity: 0.9,
  });
  fireBurst({
    particleCount: count,
    angle: 125 - Math.random() * 20,
    spread: 58 + Math.random() * 18,
    ticks,
    scalar,
    origin: { x: 1, y: 0.62 + Math.random() * 0.2 },
    startVelocity: 28 + tier * 3 + Math.random() * 10,
    gravity: 0.9,
  });
}

function skyFirework(tier: number) {
  const x = 0.18 + Math.random() * 0.64;
  const y = 0.18 + Math.random() * 0.28;
  const scalar = Math.min(1 + tier * 0.06, 1.55);

  fireBurst({
    particleCount: Math.min(55 + tier * 14, 160),
    spread: 360,
    ticks: 400,
    scalar,
    origin: { x, y },
    startVelocity: 18 + tier * 2 + Math.random() * 12,
    gravity: 0.75,
    decay: 0.92,
  });

  if (tier >= 2) {
    fireBurst({
      particleCount: Math.min(24 + tier * 6, 70),
      spread: 360,
      ticks: 360,
      scalar: scalar * 0.85,
      shapes: ["star"],
      colors: GOLD_COLORS,
      origin: { x, y },
      startVelocity: 14 + Math.random() * 10,
      gravity: 0.65,
    });
  }
}

function rainingFinale(tier: number) {
  fireBurst({
    particleCount: Math.min(100 + tier * 20, 220),
    spread: 120,
    ticks: 500,
    scalar: Math.min(1.1 + tier * 0.05, 1.5),
    origin: { x: 0.5, y: -0.05 },
    startVelocity: 12 + tier * 2,
    gravity: 1.05,
    drift: (Math.random() - 0.5) * 0.8,
  });
  fireBurst({
    particleCount: Math.min(40 + tier * 10, 90),
    spread: 100,
    ticks: 480,
    shapes: ["star"],
    colors: GOLD_COLORS,
    origin: { x: 0.35 + Math.random() * 0.3, y: -0.02 },
    startVelocity: 10,
    gravity: 0.95,
  });
}

/**
 * Multi-wave celebration (~8–12s): opening blast, continuous side cannons,
 * mid-show sky fireworks, and a late raining finale.
 */
export function celebrateMilestone(milestone: number) {
  resetConfetti();

  const tier = tierIndex(milestone);
  const durationMs = celebrateDurationMs(tier);
  const end = Date.now() + durationMs;

  openingSalvo(tier);

  // Second center punch a beat later
  trackTimeout(() => {
    fireBurst({
      particleCount: Math.min(60 + tier * 18, 180),
      spread: 90,
      ticks: 400,
      scalar: Math.min(1 + tier * 0.07, 1.45),
      origin: { x: 0.5, y: 0.5 },
      startVelocity: 26 + tier * 3,
    });
  }, 420);

  // Side cannons for most of the show
  const cannonInterval = Math.max(160, 260 - tier * 12);
  trackInterval(() => {
    if (Date.now() >= end) return;
    sideCannons(tier);
  }, cannonInterval);

  // Sky fireworks from ~1.2s in, every ~700–900ms
  const fireworkInterval = Math.max(520, 820 - tier * 30);
  trackTimeout(() => {
    trackInterval(() => {
      if (Date.now() >= end - 800) return;
      skyFirework(tier);
      if (tier >= 4 && Math.random() > 0.45) {
        trackTimeout(() => skyFirework(tier), 180);
      }
    }, fireworkInterval);
  }, 1200);

  // Late raining gold + paper
  trackTimeout(() => {
    rainingFinale(tier);
    trackTimeout(() => rainingFinale(tier), 700);
    if (tier >= 3) {
      trackTimeout(() => rainingFinale(tier), 1400);
    }
  }, Math.max(durationMs - 2800, 4500));

  // Closing double cannon
  trackTimeout(() => {
    sideCannons(tier + 2);
    openingSalvo(Math.min(tier + 1, SCORE_MILESTONES.length));
  }, durationMs - 900);

  // Hard stop so Play again / next celebrate can take over cleanly
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

/** Extra finale on game over for high totals — full ~10s spectacle. */
export function celebrateGameOver(finalScore: number) {
  if (finalScore < 512) return;

  const reached = SCORE_MILESTONES.filter((m) => finalScore >= m);
  const top = reached[reached.length - 1] ?? 512;
  // Bump one tier so game-over always feels like a finale
  celebrateMilestone(
    SCORE_MILESTONES[Math.min(tierIndex(top) + 1, SCORE_MILESTONES.length - 1)] ??
      top
  );
}
