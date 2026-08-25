/** Minimal runnable bot — random direction each turn. */
export const STARTER_SCRIPT = `/**
 * chooseMove(board) → 'up' | 'down' | 'left' | 'right'
 * board: 4×4 grid, 0 = empty cell
 *
 * Or write async function play(api) and call api.move(dir) yourself.
 */

function chooseMove(board) {
  const dirs = ['up', 'right', 'down', 'left'];
  return dirs[Math.floor(Math.random() * dirs.length)];
}
`;

export const SCRIPT_HELP =
  "Paste JavaScript below. Export chooseMove(board) to return a direction, or write async function play(api) to drive the loop. Run anytime; claim a site when you want the score on the board.";
