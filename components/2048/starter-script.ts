/** Starter bot: sync chooseMove(board) API. */
export const STARTER_SCRIPT = `/**
 * Arena API
 * - chooseMove(board): 'up' | 'down' | 'left' | 'right' | null
 *   board is a 4x4 number grid; 0 means empty
 * - or async function play(api) { ... }
 *   api.board() / api.score() / api.over() / api.move(dir) / api.sleep(ms) / api.log(...)
 */

function chooseMove(board) {
  const dirs = ['up', 'right', 'down', 'left'];
  let best = null;
  let bestScore = -Infinity;

  for (const dir of dirs) {
    const next = simulate(board, dir);
    if (!next) continue;
    const s = heuristic(next);
    if (s > bestScore) {
      bestScore = s;
      best = dir;
    }
  }
  return best;
}

function heuristic(board) {
  let empty = 0;
  let mono = 0;
  let merges = 0;
  let max = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = board[r][c];
      if (v === 0) { empty++; continue; }
      max = Math.max(max, v);
      if (c < 3 && board[r][c + 1] === v) merges++;
      if (r < 3 && board[r + 1][c] === v) merges++;
      if (c < 3 && board[r][c + 1] && board[r][c + 1] < v) mono -= Math.log2(v);
      if (r < 3 && board[r + 1][c] && board[r + 1][c] < v) mono -= Math.log2(v);
    }
  }
  const corner =
    board[0][0] === max || board[0][3] === max ||
    board[3][0] === max || board[3][3] === max ? max : 0;
  return empty * 270 + merges * 700 + mono * 47 + Math.log2(max || 2) * 10 + corner * 0.01;
}

function simulate(board, dir) {
  const next = board.map((row) => row.slice());
  let changed = false;
  const lanes = [0, 1, 2, 3];
  for (const lane of lanes) {
    const cells = [];
    for (let i = 0; i < 4; i++) {
      if (dir === 'left') cells.push([lane, i]);
      if (dir === 'right') cells.push([lane, 3 - i]);
      if (dir === 'up') cells.push([i, lane]);
      if (dir === 'down') cells.push([3 - i, lane]);
    }
    const vals = cells.map(([r, c]) => next[r][c]).filter((v) => v !== 0);
    const out = [];
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        out.push(vals[i] * 2);
        i++;
      } else out.push(vals[i]);
    }
    while (out.length < 4) out.push(0);
    cells.forEach(([r, c], i) => {
      if (next[r][c] !== out[i]) changed = true;
      next[r][c] = out[i];
    });
  }
  return changed ? next : null;
}
`;

export const SCRIPT_HELP =
  "Paste your own JavaScript. Export chooseMove(board) to return a direction, or write async function play(api) to drive the loop yourself. The board resets each UTC day; scores are tied to your site.";
