export default function changeTurn(gamestate) {
  if (gamestate.turn === 'bw') {
    gamestate.turnNum++;
    gamestate.enPassantWhite = 0;
  } else {
    gamestate.enPassantBlack = 0;
  }
  gamestate.nextTurn = gamestate.turn;
  gamestate.turn = gamestate.turn[1] + gamestate.turn[0];
}
