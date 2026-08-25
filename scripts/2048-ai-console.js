/**
 * 2048 自动游玩脚本（nneonneo 启发式 + 自适应深度 Expectimax）
 *
 * 设计来源：
 * - Robert Xiao / Petr Morávek，CMA-ES 调参的行列启发式查找表
 *   https://github.com/nneonneo/2048-ai
 *
 * 使用方法：打开 2048 网页，F12 → Console，粘贴本文件全部内容并回车。
 * start2048AI()            默认：约 150ms 思考，等动画结束后再走下一步
 * start2048AI(200)         提高思考上限（更稳）
 * start2048AI(150, 40)     思考 150ms；第二参数为步后额外间隔
 * stop2048AI()             停止
 *
 * Node 自对弈：node scripts/2048-ai-console.js --bench [局数] [深度]
 */

(function (root) {
  'use strict';

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

  function decodeGrid(b) {
    const g = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const exp = (b[r] >> (4 * c)) & 0xf;
        g[r][c] = exp === 0 ? 0 : 1 << exp;
      }
    }
    return g;
  }

  function randomEmptySpawn(board) {
    const cells = [];
    for (let r = 0; r < 4; r++) {
      for (let shift = 0; shift < 16; shift += 4) {
        if (((board[r] >> shift) & 0xf) === 0) cells.push([r, shift]);
      }
    }
    if (cells.length === 0) return null;
    const pick = cells[(Math.random() * cells.length) | 0];
    const exp = Math.random() < 0.9 ? 1 : 2;
    return spawnAt(board, pick[0], pick[1], exp);
  }

  function initBoard() {
    let b = [0, 0, 0, 0];
    b = randomEmptySpawn(b);
    b = randomEmptySpawn(b);
    return b;
  }

  function playOneGame(opts) {
    const timeBudgetMs = opts.timeBudgetMs;
    const fixedDepth = opts.fixedDepth;
    let board = initBoard();
    let score = 0;
    let moves = 0;
    while (true) {
      const pick = getBestMove(board, timeBudgetMs, fixedDepth);
      if (pick.dir < 0) break;
      const next = EXEC[pick.dir](board);
      if (boardsEq(board, next)) break;
      score += scoreMove(board, pick.dir);
      board = randomEmptySpawn(next);
      if (!board) break;
      moves++;
      if (opts.maxMoves && moves >= opts.maxMoves) break;
    }
    return {
      score,
      moves,
      maxTile: 1 << maxRank(board),
      board: decodeGrid(board),
    };
  }

  function parsePercent(styleValue) {
    if (!styleValue) return null;
    const m = String(styleValue).match(/(-?\d+(?:\.\d+)?)%/);
    return m ? parseFloat(m[1]) : null;
  }

  function snapGrid(pct) {
    if (pct === null || !isFinite(pct)) return null;
    const cell = pct / 25;
    const rounded = Math.round(cell);
    if (Math.abs(cell - rounded) > 0.2) return null;
    if (rounded < 0 || rounded > 3) return null;
    return rounded;
  }

  function cellFromElement(el) {
    const topRaw = el.style.top || '';
    const leftRaw = el.style.left || '';
    let row = snapGrid(parsePercent(topRaw));
    let col = snapGrid(parsePercent(leftRaw));
    if (row !== null && col !== null) return [row, col];

    const transform = el.style.transform || '';
    const tm = transform.match(
      /translate\(\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)/
    );
    if (tm) {
      col = snapGrid(parseFloat(tm[1]));
      row = snapGrid(parseFloat(tm[2]));
      if (row !== null && col !== null) return [row, col];
    }

    const cs = window.getComputedStyle(el);
    row = snapGrid(parsePercent(cs.top));
    col = snapGrid(parsePercent(cs.left));
    if (row !== null && col !== null) return [row, col];

    const parent = el.offsetParent || el.parentElement;
    if (!parent) return null;
    const pw = parent.clientWidth;
    const ph = parent.clientHeight;
    if (pw < 32 || ph < 32) return null;
    col = Math.round(el.offsetLeft / (pw / 4));
    row = Math.round(el.offsetTop / (ph / 4));
    if (row < 0 || row > 3 || col < 0 || col > 3) return null;
    return [row, col];
  }

  function parseTileValue(el) {
    const t = (el.textContent || '').replace(/\s+/g, '');
    if (!/^\d+$/.test(t)) return 0;
    const value = parseInt(t, 10);
    if (value < 2 || (value & (value - 1)) !== 0) return 0;
    return value;
  }

  function boardIsAnimating() {
    return Boolean(document.querySelector('.board-slot.is-sliding, .tile-merge-partner, .tile-pop'));
  }

  function readBoard() {
    // Never trust mid-slide frames: merging tiles share a cell and under-count.
    if (boardIsAnimating()) return null;

    const tileEls = Array.from(document.querySelectorAll('.tile-position'));
    if (tileEls.length === 0) return null;
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    let placed = 0;
    for (const el of tileEls) {
      const inner = el.firstElementChild;
      if (inner && /tile-merge-partner/.test(inner.className || '')) continue;
      const value = parseTileValue(el);
      if (!value) continue;
      const cell = cellFromElement(el);
      if (!cell) continue;
      const [row, col] = cell;
      if (board[row][col] !== 0 && board[row][col] !== value) {
        // Overlapping distinct values → still settling.
        return null;
      }
      board[row][col] = Math.max(board[row][col], value);
      placed++;
    }
    if (placed === 0) return null;
    return board;
  }

  function boardFingerprint(grid) {
    if (!grid) return '';
    return grid.map((row) => row.join(',')).join('|');
  }

  function isGameOverOverlay() {
    return Array.from(document.querySelectorAll('h3')).some((el) =>
      /game\s*over/i.test(el.textContent || '')
    );
  }

  function legalDirs(rows) {
    const dirs = [];
    for (let m = 0; m < 4; m++) {
      if (!boardsEq(rows, EXEC[m](rows))) dirs.push(m);
    }
    return dirs;
  }

  const KEY_MAP = {
    up: { key: 'ArrowUp', code: 'ArrowUp' },
    down: { key: 'ArrowDown', code: 'ArrowDown' },
    left: { key: 'ArrowLeft', code: 'ArrowLeft' },
    right: { key: 'ArrowRight', code: 'ArrowRight' },
  };

  function sendKey(direction) {
    const info = KEY_MAP[direction];
    const event = new KeyboardEvent('keydown', {
      key: info.key,
      code: info.code,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      timer = setTimeout(resolve, ms);
    });
  }

  function thinkBudgetMs(meanThink) {
    const jitter = 0.92 + Math.random() * 0.16;
    return Math.max(80, Math.round(meanThink * jitter));
  }

  let running = false;
  let timer = null;
  let lastBoardStr = null;
  let stallCount = 0;
  let moveCount = 0;
  let deadTries = 0;

  /** Arena slide ≈180ms + merge pop ≈ up to 380ms — never fire keys faster. */
  const SETTLE_POLL_MS = 40;
  const MOVE_APPLY_TIMEOUT_MS = 900;

  async function waitSettledBoard() {
    let prev = '';
    for (let i = 0; i < 20; i++) {
      if (boardIsAnimating()) {
        prev = '';
        await sleep(SETTLE_POLL_MS);
        if (!running) return null;
        continue;
      }
      const grid = readBoard();
      const fp = boardFingerprint(grid);
      if (grid && fp === prev && fp.length > 0) return grid;
      prev = fp;
      await sleep(SETTLE_POLL_MS);
      if (!running) return null;
    }
    return boardIsAnimating() ? null : readBoard();
  }

  async function waitBoardChanged(beforeFp) {
    const deadline = nowMs() + MOVE_APPLY_TIMEOUT_MS;
    while (running && nowMs() < deadline) {
      await sleep(SETTLE_POLL_MS);
      if (boardIsAnimating()) continue;
      const grid = readBoard();
      const fp = boardFingerprint(grid);
      if (grid && fp && fp !== beforeFp) {
        // One extra settle tick so spawn / pop flags clear.
        await sleep(SETTLE_POLL_MS);
        if (!running) return null;
        return waitSettledBoard();
      }
      if (isGameOverOverlay()) return null;
    }
    return waitSettledBoard();
  }

  function start2048AI(thinkTimeMs, tickIntervalMs) {
    const meanThink = typeof thinkTimeMs === 'number' ? thinkTimeMs : 150;
    // tickIntervalMs kept for API compat; real pacing is wait-for-board-change.
    const minGapAfterMove =
      typeof tickIntervalMs === 'number' ? Math.max(40, tickIntervalMs) : 40;
    if (running) {
      console.log('已经在运行中');
      return;
    }
    running = true;
    lastBoardStr = null;
    stallCount = 0;
    moveCount = 0;
    deadTries = 0;
    console.log(
      '2048 AI 已启动。思考约 ' +
        meanThink +
        'ms，每步等棋盘动画结束再走。输入 stop2048AI() 停止。'
    );

    const step = async () => {
      while (running) {
        if (isGameOverOverlay()) {
          console.log('页面已出现 GAME OVER。');
          stop2048AI();
          return;
        }

        const valueGrid = await waitSettledBoard();
        if (!running) return;
        if (!valueGrid) {
          await sleep(80);
          continue;
        }

        const boardStr = boardFingerprint(valueGrid);
        const stalled = boardStr === lastBoardStr;
        stallCount = stalled ? stallCount + 1 : 0;

        const rows = encodeGrid(valueGrid);
        const dirs = legalDirs(rows);
        let pick;

        if (dirs.length === 0) {
          deadTries++;
          if (isGameOverOverlay() || deadTries >= 8) {
            console.log('连续多次无有效移动，停止。');
            stop2048AI();
            return;
          }
          // Re-settle — may have read a transient frame.
          await sleep(120);
          continue;
        }

        deadTries = 0;
        if (stallCount >= 4) {
          pick = { dir: dirs[stallCount % dirs.length], depth: 0, nodes: 0 };
        } else {
          pick = getBestMove(rows, thinkBudgetMs(meanThink), null);
          if (pick.dir < 0 || dirs.indexOf(pick.dir) < 0) {
            pick = { dir: dirs[0], depth: 0, nodes: 0 };
          }
        }

        moveCount++;
        if (moveCount % 50 === 0) {
          console.log(
            '第 ' +
              moveCount +
              ' 步  最大块=' +
              (1 << maxRank(rows)) +
              '  深度=' +
              pick.depth +
              '  节点=' +
              pick.nodes +
              '  启发=' +
              Math.round(scoreHeur(rows))
          );
        }

        lastBoardStr = boardStr;
        sendKey(DIR_NAME[pick.dir]);
        const nextGrid = await waitBoardChanged(boardStr);
        if (!running) return;
        if (nextGrid) {
          lastBoardStr = boardFingerprint(nextGrid);
          stallCount = 0;
        } else if (isGameOverOverlay()) {
          console.log('页面已出现 GAME OVER。');
          stop2048AI();
          return;
        }
        await sleep(minGapAfterMove);
      }
    };

    step();
  }

  function stop2048AI() {
    running = false;
    if (timer) clearTimeout(timer);
    console.log('2048 AI 已停止。');
  }

  const api = {
    start2048AI,
    stop2048AI,
    getBestMove,
    playOneGame,
    encodeGrid,
    decodeGrid,
    scoreHeur,
    EXEC,
    DIR_NAME,
  };

  if (typeof window !== 'undefined') {
    window.start2048AI = start2048AI;
    window.stop2048AI = stop2048AI;
    window.__2048AI = api;
    console.log('脚本已加载。输入 start2048AI() 开始，stop2048AI() 停止。');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof process !== 'undefined' && process.argv && process.argv.includes('--bench')) {
    const games = parseInt(process.argv[3] || '8', 10);
    const depthOrBudget = process.argv[4] || '4';
    const useTime = String(depthOrBudget).endsWith('ms');
    const t0 = Date.now();
    const results = [];
    for (let i = 0; i < games; i++) {
      const r = useTime
        ? playOneGame({ timeBudgetMs: parseInt(depthOrBudget, 10) })
        : playOneGame({ fixedDepth: parseInt(depthOrBudget, 10) });
      results.push(r);
      console.log(
        '局 ' +
          (i + 1) +
          '/' +
          games +
          '  分数=' +
          r.score +
          '  最大块=' +
          r.maxTile +
          '  步数=' +
          r.moves
      );
    }
    results.sort((a, b) => a.score - b.score);
    const avg = results.reduce((s, r) => s + r.score, 0) / results.length;
    const hit100k = results.filter((r) => r.score >= 100000).length;
    const hit8192 = results.filter((r) => r.maxTile >= 8192).length;
    const hit16384 = results.filter((r) => r.maxTile >= 16384).length;
    console.log('---');
    console.log(
      (useTime ? '时限=' + depthOrBudget : '深度=' + depthOrBudget) +
        '  局数=' +
        games +
        '  耗时=' +
        ((Date.now() - t0) / 1000).toFixed(1) +
        's'
    );
    console.log(
      '平均分=' +
        Math.round(avg) +
        '  最低=' +
        results[0].score +
        '  最高=' +
        results[results.length - 1].score
    );
    console.log(
      '>=10万: ' +
        hit100k +
        '/' +
        games +
        '  >=8192: ' +
        hit8192 +
        '/' +
        games +
        '  >=16384: ' +
        hit16384 +
        '/' +
        games
    );
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
