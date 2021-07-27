import Coords from './coords';

const coords = new Coords();

export default function pseudoCopy(board) {
  const copy = {};
  for (const coord of coords) {
    copy[coord] = board[coord].player + board[coord].piece;
  }

  return copy;
}
