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
];

const sideTimers = new Set<number>();

function tierIndex(milestone: number) {
  const idx = SCORE_MILESTONES.indexOf(milestone);
  return idx >= 0 ? idx : SCORE_MILESTONES.length;
}

function burstStrength(milestone: number) {
  const tier = tierIndex(milestone);
  return {
    particleCount: Math.min(28 + tier * 22, 220),
    spread: Math.min(48 + tier * 6, 110),
    ticks: Math.min(160 + tier * 35, 420),
    scalar: Math.min(0.85 + tier * 0.06, 1.45),
    durationMs: Math.min(900 + tier * 450, 4500),
  };
}

function fireBurst(
  opts: confetti.Options & { particleCount: number }
) {
  void confetti({
    disableForReducedMotion: true,
    colors: ARENA_COLORS,
    ...opts,
  });
}

/** Stop ongoing bursts (e.g. Play again). */
export function resetConfetti() {
  for (const id of sideTimers) window.clearInterval(id);
  sideTimers.clear();
  confetti.reset();
}

/** One milestone celebration — intensity scales with the threshold. */
export function celebrateMilestone(milestone: number) {
  const { particleCount, spread, ticks, scalar, durationMs } =
    burstStrength(milestone);

  fireBurst({
    particleCount: Math.floor(particleCount * 0.55),
    spread,
    ticks,
    scalar,
    origin: { x: 0.5, y: 0.45 },
    startVelocity: 28 + tierIndex(milestone) * 4,
  });

  const end = Date.now() + durationMs;
  const interval = Math.max(120, 280 - tierIndex(milestone) * 18);

  const sideTimer = window.setInterval(() => {
    if (Date.now() >= end) {
      window.clearInterval(sideTimer);
      sideTimers.delete(sideTimer);
      return;
    }
    fireBurst({
      particleCount: Math.max(8, Math.floor(particleCount * 0.18)),
      angle: 60 + Math.random() * 12,
      spread: spread * 0.85,
      ticks,
      scalar,
      origin: { x: 0, y: 0.55 + Math.random() * 0.15 },
      startVelocity: 22 + tierIndex(milestone) * 3,
    });
    fireBurst({
      particleCount: Math.max(8, Math.floor(particleCount * 0.18)),
      angle: 120 - Math.random() * 12,
      spread: spread * 0.85,
      ticks,
      scalar,
      origin: { x: 1, y: 0.55 + Math.random() * 0.15 },
      startVelocity: 22 + tierIndex(milestone) * 3,
    });
  }, interval);
  sideTimers.add(sideTimer);
}

/** Fire when score crosses new milestones during play. */
export function celebrateScoreProgress(prevScore: number, nextScore: number) {
  if (nextScore <= prevScore) return;
  for (const milestone of SCORE_MILESTONES) {
    if (prevScore < milestone && nextScore >= milestone) {
      celebrateMilestone(milestone);
    }
  }
}

/** Extra finale on game over for high totals. */
export function celebrateGameOver(finalScore: number) {
  if (finalScore < 512) return;

  const reached = SCORE_MILESTONES.filter((m) => finalScore >= m);
  const top = reached[reached.length - 1] ?? 512;
  const tier = tierIndex(top);

  fireBurst({
    particleCount: Math.min(80 + tier * 30, 280),
    spread: 100,
    ticks: 320,
    scalar: 1.1,
    origin: { x: 0.5, y: 0.35 },
    startVelocity: 38 + tier * 5,
  });
}
