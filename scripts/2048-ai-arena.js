/**
 * 2048 Arena bot — nneonneo 行查表启发 + Expectimax 迭代加深
 *
 * 用法：打开 https://oriensx.github.io/2048 ，切到 Code，整段粘贴到编辑器，点 Run script。
 * 先 Claim site 再跑，分数才会进赛周榜。
 *
 * 可调：THINK_MS 单步思考上限（毫秒）。冲分可试 200～350。
 * 来源：scripts/2048-ai-console.js 的搜索核，去掉 DOM 读盘与按键派发。
 */

const THINK_MS = 150;
const SIZE = 4;
const CPROB_THRESH = 0.0001;
const CACHE_DEPTH_LIMIT = 15;
const ID_MAX_DEPTH = 8;
const MIN_COMPLETE_DEPTH = 4;

const SCORE_LOST_PENALTY = 200000;
const SCORE_MONOTONICITY_POWER = 4;
const SCORE_MONOTONICITY_WEIGHT = 47;
const SCORE_SUM_POWER = 3.5;
const SCORE_SUM_WEIGHT = 11;
const SCORE_MERGES_WEIGHT = 700;
const SCORE_EMPTY_WEIGHT = 270;

const MOVE_LEFT = new Uint16Array(65536);
const MOVE_RIGHT = new Uint16Array(65536);
const REVERSE = new Uint16Array(65536);
const EMPTY_COUNT = new Uint8Array(65536);
const HEUR = new Float64Array(65536);
const MOVE_SCORE = new Uint32Array(65536);

(function buildTables() {
  for (let row = 0; row < 65536; row++) {
    const line = [
      row & 0xf,
      (row >> 4) & 0xf,
      (row >> 8) & 0xf,
      (row >> 12) & 0xf,
    ];

    REVERSE[row] =
      (line[0] << 12) | (line[1] << 8) | (line[2] << 4) | line[3];

    let empty = 0;
    for (let i = 0; i < 4; i++) if (line[i] === 0) empty++;
    EMPTY_COUNT[row] = empty;

    let sum = 0;
    let merges = 0;
    let prev = 0;
    let counter = 0;
    for (let i = 0; i < 4; i++) {
      const rank = line[i];
      sum += Math.pow(rank, SCORE_SUM_POWER);
      if (rank === 0) continue;
      if (prev === rank) {
        counter++;
      } else {
        if (counter > 0) merges += 1 + counter;
        counter = 0;
      }
      prev = rank;
    }
    if (counter > 0) merges += 1 + counter;

    let monoLeft = 0;
    let monoRight = 0;
    for (let i = 1; i < 4; i++) {
      if (line[i - 1] > line[i]) {
        monoLeft +=
          Math.pow(line[i - 1], SCORE_MONOTONICITY_POWER) -
          Math.pow(line[i], SCORE_MONOTONICITY_POWER);
      } else {
        monoRight +=
          Math.pow(line[i], SCORE_MONOTONICITY_POWER) -
          Math.pow(line[i - 1], SCORE_MONOTONICITY_POWER);
      }
    }

    HEUR[row] =
      SCORE_LOST_PENALTY +
      SCORE_EMPTY_WEIGHT * empty +
      SCORE_MERGES_WEIGHT * merges -
      SCORE_MONOTONICITY_WEIGHT * Math.min(monoLeft, monoRight) -
      SCORE_SUM_WEIGHT * sum;

    const slide = line.slice();
    let gained = 0;
    for (let i = 0; i < 3; i++) {
      let j = i + 1;
      while (j < 4 && slide[j] === 0) j++;
      if (j === 4) break;
      if (slide[i] === 0) {
        slide[i] = slide[j];
        slide[j] = 0;
        i--;
      } else if (slide[i] === slide[j]) {
        if (slide[i] !== 0xf) {
          slide[i]++;
          gained += 1 << slide[i];
        }
        slide[j] = 0;
      }
    }
    const left =
      (slide[0] << 0) | (slide[1] << 4) | (slide[2] << 8) | (slide[3] << 12);
    MOVE_LEFT[row] = left;
    MOVE_SCORE[row] = gained;
  }

  for (let row = 0; row < 65536; row++) {
    MOVE_RIGHT[row] = REVERSE[MOVE_LEFT[REVERSE[row]]];
  }
})();

function transpose(r0, r1, r2, r3) {
  const c0 =
    (r0 & 0xf) |
    ((r1 & 0xf) << 4) |
    ((r2 & 0xf) << 8) |
    ((r3 & 0xf) << 12);
  const c1 =
    ((r0 >> 4) & 0xf) |
    (((r1 >> 4) & 0xf) << 4) |
    (((r2 >> 4) & 0xf) << 8) |
    (((r3 >> 4) & 0xf) << 12);
  const c2 =
    ((r0 >> 8) & 0xf) |
    (((r1 >> 8) & 0xf) << 4) |
    (((r2 >> 8) & 0xf) << 8) |
    (((r3 >> 8) & 0xf) << 12);
  const c3 =
    ((r0 >> 12) & 0xf) |
    (((r1 >> 12) & 0xf) << 4) |
    (((r2 >> 12) & 0xf) << 8) |
    (((r3 >> 12) & 0xf) << 12);
  return [c0, c1, c2, c3];
}

function moveLeft(b) {
  return [MOVE_LEFT[b[0]], MOVE_LEFT[b[1]], MOVE_LEFT[b[2]], MOVE_LEFT[b[3]]];
}

function moveRight(b) {
  return [MOVE_RIGHT[b[0]], MOVE_RIGHT[b[1]], MOVE_RIGHT[b[2]], MOVE_RIGHT[b[3]]];
}

function moveUp(b) {
  const t = transpose(b[0], b[1], b[2], b[3]);
  return transpose(MOVE_LEFT[t[0]], MOVE_LEFT[t[1]], MOVE_LEFT[t[2]], MOVE_LEFT[t[3]]);
}

function moveDown(b) {
  const t = transpose(b[0], b[1], b[2], b[3]);
  return transpose(MOVE_RIGHT[t[0]], MOVE_RIGHT[t[1]], MOVE_RIGHT[t[2]], MOVE_RIGHT[t[3]]);
}

const EXEC = [moveUp, moveDown, moveLeft, moveRight];
const DIR_NAME = ['up', 'down', 'left', 'right'];

function boardsEq(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function scoreMove(b, dir) {
  if (dir === 2) {
    return MOVE_SCORE[b[0]] + MOVE_SCORE[b[1]] + MOVE_SCORE[b[2]] + MOVE_SCORE[b[3]];
  }
  if (dir === 3) {
    return (
      MOVE_SCORE[REVERSE[b[0]]] +
      MOVE_SCORE[REVERSE[b[1]]] +
      MOVE_SCORE[REVERSE[b[2]]] +
      MOVE_SCORE[REVERSE[b[3]]]
    );
  }
  const t = transpose(b[0], b[1], b[2], b[3]);
  if (dir === 0) {
    return MOVE_SCORE[t[0]] + MOVE_SCORE[t[1]] + MOVE_SCORE[t[2]] + MOVE_SCORE[t[3]];
  }
  return (
    MOVE_SCORE[REVERSE[t[0]]] +
    MOVE_SCORE[REVERSE[t[1]]] +
    MOVE_SCORE[REVERSE[t[2]]] +
    MOVE_SCORE[REVERSE[t[3]]]
  );
}

function countEmpty(b) {
  return EMPTY_COUNT[b[0]] + EMPTY_COUNT[b[1]] + EMPTY_COUNT[b[2]] + EMPTY_COUNT[b[3]];
}

function scoreHeur(b) {
  const t = transpose(b[0], b[1], b[2], b[3]);
  return (
    HEUR[b[0]] + HEUR[b[1]] + HEUR[b[2]] + HEUR[b[3]] +
    HEUR[t[0]] + HEUR[t[1]] + HEUR[t[2]] + HEUR[t[3]]
  );
}

function countDistinct(b) {
  let bitset = 0;
  for (let r = 0; r < 4; r++) {
    let row = b[r];
    for (let i = 0; i < 4; i++) {
      bitset |= 1 << (row & 0xf);
      row >>= 4;
    }
  }
  bitset >>= 1;
  let n = 0;
  while (bitset) {
    bitset &= bitset - 1;
    n++;
  }
  return n;
}

function maxRank(b) {
  let m = 0;
  for (let r = 0; r < 4; r++) {
    let row = b[r];
    for (let i = 0; i < 4; i++) {
      const v = row & 0xf;
      if (v > m) m = v;
      row >>= 4;
    }
  }
  return m;
}

function boardKey(b) {
  return String.fromCharCode(b[0], b[1], b[2], b[3]);
}

function spawnAt(b, r, shift, exp) {
  const n = [b[0], b[1], b[2], b[3]];
  n[r] |= exp << shift;
  return n;
}

function nowMs() {
  return typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();
}

function rootMoveOrder(board) {
  const scored = [];
  for (let m = 0; m < 4; m++) {
    const nb = EXEC[m](board);
    if (boardsEq(board, nb)) continue;
    scored.push({ m, h: scoreHeur(nb) + scoreMove(board, m) * 0.1 });
  }
  scored.sort((a, b) => b.h - a.h);
  return scored.map((s) => s.m);
}

function makeSearch() {
  const state = {
    trans: new Map(),
    depthLimit: 3,
    curdepth: 0,
    nodes: 0,
    deadline: Infinity,
    timedOut: false,
    checkN: 0,
  };

  function timedOut() {
    if ((++state.checkN & 255) !== 0) return state.timedOut;
    if (nowMs() > state.deadline) state.timedOut = true;
    return state.timedOut;
  }

  function scoreMoveNode(board, cprob) {
    let best = 0;
    state.curdepth++;
    for (let m = 0; m < 4; m++) {
      const nb = EXEC[m](board);
      state.nodes++;
      if (!boardsEq(board, nb)) {
        const s = scoreChanceNode(nb, cprob);
        if (s > best) best = s;
      }
    }
    state.curdepth--;
    return best;
  }

  function scoreChanceNode(board, cprob) {
    if (cprob < CPROB_THRESH || state.curdepth >= state.depthLimit || timedOut()) {
      return scoreHeur(board);
    }

    if (state.curdepth < CACHE_DEPTH_LIMIT) {
      const key = boardKey(board);
      const entry = state.trans.get(key);
      if (entry !== undefined && entry.d <= state.curdepth) {
        return entry.v;
      }
    }

    const empty = countEmpty(board);
    if (empty === 0) return scoreHeur(board);

    const nextProb = cprob / empty;
    let res = 0;
    for (let r = 0; r < 4; r++) {
      const row = board[r];
      for (let shift = 0; shift < 16; shift += 4) {
        if (((row >> shift) & 0xf) !== 0) continue;
        res += scoreMoveNode(spawnAt(board, r, shift, 1), nextProb * 0.9) * 0.9;
        res += scoreMoveNode(spawnAt(board, r, shift, 2), nextProb * 0.1) * 0.1;
      }
    }
    res /= empty;

    if (state.curdepth < CACHE_DEPTH_LIMIT && !state.timedOut) {
      state.trans.set(boardKey(board), { d: state.curdepth, v: res });
    }
    return res;
  }

  function searchRoot(board, depthLimit, deadline, keepCache) {
    if (!keepCache) state.trans = new Map();
    state.depthLimit = depthLimit;
    state.curdepth = 0;
    state.nodes = 0;
    state.deadline = deadline;
    state.timedOut = false;
    state.checkN = 0;

    let bestDir = -1;
    let bestScore = -Infinity;
    let finishedAll = true;
    const order = rootMoveOrder(board);
    for (let i = 0; i < order.length; i++) {
      const m = order[i];
      const nb = EXEC[m](board);
      const s = scoreChanceNode(nb, 1) + 1e-6;
      if (state.timedOut) {
        finishedAll = false;
        break;
      }
      if (s > bestScore) {
        bestScore = s;
        bestDir = m;
      }
    }
    return {
      dir: bestDir,
      score: bestScore,
      nodes: state.nodes,
      timedOut: state.timedOut || !finishedAll,
      complete: finishedAll && bestDir >= 0,
    };
  }

  return { searchRoot, state };
}

function firstLegal(board) {
  for (let m = 0; m < 4; m++) {
    if (!boardsEq(board, EXEC[m](board))) return m;
  }
  return -1;
}

function greedyMove(board) {
  let bestDir = -1;
  let best = -Infinity;
  for (let m = 0; m < 4; m++) {
    const nb = EXEC[m](board);
    if (boardsEq(board, nb)) continue;
    const s = scoreHeur(nb) + scoreMove(board, m);
    if (s > best) {
      best = s;
      bestDir = m;
    }
  }
  return bestDir;
}

function startDepthFor(board, cap) {
  const empty = countEmpty(board);
  const distinct = countDistinct(board);
  // Prefer finishing a reliable depth over starting too deep and timing out.
  let start = 4;
  if (empty <= 3) start = 6;
  else if (empty <= 5) start = 5;
  else if (empty >= 10) start = 3;
  if (distinct >= 9) start = Math.max(start, 5);
  return Math.min(Math.max(start, 3), cap);
}

function getBestMove(board, timeBudgetMs, fixedDepth) {
  const legal = firstLegal(board);
  if (legal < 0) return { dir: -1, depth: 0, nodes: 0 };

  const search = makeSearch();
  const cap = fixedDepth != null ? fixedDepth : ID_MAX_DEPTH;
  const deadline = timeBudgetMs == null ? Infinity : nowMs() + timeBudgetMs;
  const startDepth =
    fixedDepth != null ? fixedDepth : startDepthFor(board, cap);

  let chosen = {
    dir: greedyMove(board),
    depth: 0,
    nodes: 0,
    score: -Infinity,
  };
  if (chosen.dir < 0) chosen.dir = legal;

  // Clear TT each ID depth: cached values are tied to that depthLimit.
  for (let depth = Math.min(startDepth, cap); depth <= cap; depth++) {
    if (nowMs() >= deadline && chosen.depth > 0) break;
    const r = search.searchRoot(board, depth, deadline, false);
    chosen.nodes += r.nodes;
    if (r.complete && r.dir >= 0) {
      chosen.dir = r.dir;
      chosen.depth = depth;
      chosen.score = r.score;
      continue;
    }
    break;
  }
  if (chosen.dir < 0) chosen.dir = legal;
  return chosen;
}

function encodeGrid(grid) {
  const rows = [0, 0, 0, 0];
  for (let r = 0; r < 4; r++) {
    let row = 0;
    for (let c = 0; c < 4; c++) {
      const v = grid[r][c];
      const exp = v === 0 ? 0 : Math.round(Math.log2(v));
      row |= (exp & 0xf) << (4 * c);
    }
    rows[r] = row;
  }
  return rows;
}

/**
 * Arena runner 调用：chooseMove(board) → 'up'|'down'|'left'|'right'|null
 * board 是 4×4 number[][]，0 为空格。
 */
function chooseMove(board) {
  const packed = encodeGrid(board);
  const pick = getBestMove(packed, THINK_MS, null);
  if (pick.dir < 0) return null;
  return DIR_NAME[pick.dir];
}
