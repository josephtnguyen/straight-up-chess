import React from 'react';
import { io } from 'socket.io-client';
import ReactBoard from '../components/board';
import PlayerPalette from '../components/player-palette';
import Board from '../lib/board';
import GameState from '../lib/gamestate';
import Coords from '../lib/coords';
import RouteContext from '../lib/route-context';

const coords = new Coords();

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Board(),
      gamestate: new GameState(),
      meta: null,
      side: 'white',
      phase: 'selecting',
      selected: 0,
      highlighted: []
    };
    this.cancelGame = this.cancelGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.decideMove = this.decideMove.bind(this);
    this.checkmateScan = this.checkmateScan.bind(this);
    this.checkScan = this.checkScan.bind(this);
    this.drawScan = this.drawScan.bind(this);
  }

  componentDidMount() {
    const { params } = this.context;
    const gameId = params.get('gameId');
    const side = params.get('side');
    this.socket = io('/', { query: { gameId } });

    this.socket.on('room joined', meta => {
      if (this.state.meta) {
        if (this.state.meta.opponentName) {
          return;
        }
      }
      this.setState({ meta, side });
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  cancelGame() {
    const { gameId } = this.state.meta;
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/games/${gameId}`, req)
      .then(res => res.json())
      .then(result => {
        window.location.hash = '#join';
      });
  }

  handleClick(event) {
    const { phase } = this.state;
    const { showOptions, decideMove } = this;
    const coord = parseInt(event.target.closest('.tile').id);
    if (Number.isNaN(coord)) {
      return;
    }
    if (phase === 'selecting') {
      showOptions(coord);
    } else if (phase === 'showing options') {
      decideMove(coord);
    }
  }

  showOptions(start) {
    const { board, gamestate } = this.state;
    if (isEmptyAt(board, start)) {
      return;
    }

    if (!isViableStart(board, gamestate, start, gamestate.turn)) {
      return;
    }

    // find all potential moves
    const highlighted = [];
    const moveSpace = findMoveSpace(board, gamestate.turn, start, false, gamestate);
    for (let i = 0; i < moveSpace.length; i++) {
      if (isViableMove(board, gamestate.turn, start, moveSpace[i])) {
        highlighted.push(moveSpace[i]);
      }
    }

    this.setState({
      selected: start,
      phase: 'showing options',
      highlighted
    });
  }

  decideMove(end) {
    const { board, gamestate, highlighted, selected } = this.state;
    const { checkmateScan, checkScan, drawScan } = this;
    if (!highlighted.includes(end)) {
      this.setState({
        phase: 'selecting',
        selected: 0,
        highlighted: []
      });
      return;
    }

    const nextBoard = copy(board);
    const nextGamestate = copy(gamestate);

    // update draw counter
    if (board[end].piece) {
      nextGamestate.pawnOrKillCounter = 0;
    } else if (board[selected].piece === 'p') {
      nextGamestate.pawnOrKillCounter = 0;
    } else {
      nextGamestate.pawnOrKillCounter++;
    }

    // record en passant
    if (board[selected].piece === 'p' && (selected > 20 && selected < 29) && (end > 40 && end < 49)) {
      nextGamestate.enPassantWhite = selected;
    } else if (board[selected].piece === 'p' && (selected > 70 && selected < 79) && (end > 50 && end < 59)) {
      nextGamestate.enPassantBlack = selected;
    }

    // move piece
    movePiece(nextBoard, selected, end);

    // apply scans
    // pawnScan(board, gamestate);
    checkmateScan(nextBoard, nextGamestate);
    drawScan(nextBoard, nextGamestate);
    checkScan(nextBoard, nextGamestate);
    // castleScan(board, gamestate);

    // change turn
    changeTurn(nextGamestate);
    this.setState({
      board: nextBoard,
      gamestate: nextGamestate,
      phase: 'selecting',
      selected: 0,
      highlighted: []
    });
  }

  checkmateScan(board, gamestate) {
    const enemyCoords = [];

    // find location of all enemies
    for (const coord of coords) {
      if (board[coord]) {
        if (board[coord].player === gamestate.turn[1]) {
          enemyCoords.push(coord);
        }
      }
    }

    // return if there is no checkmate
    for (const enemyCoord of enemyCoords) {
      if (isViableStart(board, gamestate, enemyCoord, gamestate.nextTurn)) {
        return;
      }
    }

    // otherwise checkmate
    gamestate.checkmate = true;
    console.log('Checkmate!!'); // eslint-disable-line
  }

  checkScan(board, gamestate) {
    if (gamestate.checkmate) {
      return;
    }

    const allyMoveSpace = findEnemyMoveSpace(board, gamestate.nextTurn, gamestate);

    // find enemy king coord after move
    let kingCoord;
    for (const coord of coords) {
      if (board[coord].player === gamestate.turn[1] && board[coord].piece === 'k') {
        kingCoord = coord;
        break;
      }
    }

    // change gamestate if there is check
    gamestate.check[gamestate.turn] = false;
    if (allyMoveSpace.includes(kingCoord)) {
      gamestate.check[gamestate.nextTurn] = true;
      console.log('Check!'); // eslint-disable-line
    }
  }

  drawScan(board, gamestate) {
    gamestate.pastBoards.push(pseudoCopy(board));

    const { turn } = gamestate;
    // 50 move rule draw
    if (gamestate.pawnOrKillCounter === 100) {
      gamestate.drawCase = '50 move rule';
      gamestate.draw = true;
    }

    // statemate draw
    const enemyCoords = [];

    for (const coord of coords) {
      if (isEmptyAt(board, coord)) {
        continue;
      } else if (board[coord].player === turn[1]) {
        enemyCoords.push(coord);
      }
    }

    let enemyCanMove = false;
    for (const enemyCoord of enemyCoords) {
      const eachMoveSpace = findMoveSpace(board, turn[1] + turn[0], enemyCoord, false, gamestate);
      if (eachMoveSpace.length !== 0) {
        enemyCanMove = true;
        break;
      }
    }

    if (!enemyCanMove) {
      gamestate.drawCase = 'stalemate';
      gamestate.draw = true;
    }

    // threefold-repetition draw
    for (let i = 0; i < gamestate.pastBoards.length; i++) {
      let repeats = 1;
      const currentBoard = gamestate.pastBoards[i];
      // create a copy of pastBoards and remove the currentBoard from the copy
      const pastBoardsCopy = [...gamestate.pastBoards];
      pastBoardsCopy.splice(i, 1);
      // see if there are any repeats
      for (const otherBoard of pastBoardsCopy) {
        if (currentBoard === otherBoard) {
          repeats++;
        }
      }
      if (repeats > 2) {
        gamestate.drawCase = 'threefold repetition';
        gamestate.draw = true;
        break;
      }
    }

    // insufficient material draw
    // list all black and white squares
    const blackSquares = [];
    const whiteSquares = [];
    for (const coord of coords) {
      const tens = Math.floor(coord / 10);
      const ones = coord % 10;
      if ((tens % 2) === 0) {
        if ((ones % 2) === 0) {
          blackSquares.push(coord);
        } else {
          whiteSquares.push(coord);
        }
      } else {
        if ((ones % 2) === 0) {
          whiteSquares.push(coord);
        } else {
          blackSquares.push(coord);
        }
      }
    }
    // find remaining pieces
    const whitePieces = [];
    const blackPieces = [];
    for (const coord of coords) {
      if (board[coord].player === 'w') {
        whitePieces.push(board[coord].piece);
      } else if (board[coord].player === 'b') {
        blackPieces.push(board[coord].piece);
      }
    }
    // cases
    if (blackPieces.length === 1) {
      if (whitePieces.length === 1) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      } else if (whitePieces.length === 2) {
        if (whitePieces.includes('b') || whitePieces.includes('n')) {
          gamestate.drawCase = 'insufficient materials';
          gamestate.draw = true;
        }
      }
    } else if (whitePieces.length === 1) {
      if (blackPieces.length === 1) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      } else if (blackPieces.length === 2) {
        if (blackPieces.includes('b') || blackPieces.includes('n')) {
          gamestate.drawCase = 'insufficient materials';
          gamestate.draw = true;
        }
      }
    } else if (blackPieces.length === 2 && whitePieces.length === 2) {
      if (blackPieces.includes('b') && whitePieces.includes('b')) {
        const bishopCoords = [];
        for (const coord of coords) {
          if (board[coord].piece === 'b') {
            bishopCoords.push(coord);
          }
        }
        if (blackSquares.includes(bishopCoords[0]) && blackSquares.includes(bishopCoords[1])) {
          gamestate.drawCase = 'insufficient materials';
          gamestate.draw = true;
        } else if (whitePieces.includes(bishopCoords[0]) && whitePieces.includes(bishopCoords[1])) {
          gamestate.drawCase = 'insufficient materials';
          gamestate.draw = true;
        }
      }
    }
    if (gamestate.draw) {
      console.log(`Draw by ${gamestate.drawCase}`); // eslint-disable-line
    }
  }

  render() {
    const { board, meta, side, selected, highlighted } = this.state;
    const dummy = {
      username: 'Anonymous'
    };
    let player = dummy;
    let opponent = null;
    if (meta) {
      player = { username: meta.playerName };
      if (meta.opponentName) {
        if (side === meta.playerSide) {
          player = { username: meta.playerName };
          opponent = { username: meta.opponentName };
        } else {
          player = { username: meta.opponentName };
          opponent = { username: meta.playerName };
        }
      }
    }

    return (
      <div className="game page-height mx-auto">
        <div className="w-100 d-block d-md-none p-2">
          <PlayerPalette player={opponent} cancelAction={this.cancelGame} />
        </div>

        <div className="w-100 row">
          <div className="col">

            <div className="board-container my-2" onClick={this.handleClick}>
              <ReactBoard board={board} highlighted={highlighted} selected={selected} side={side} />
            </div>
          </div>

          <div className="col-auto d-none d-md-block">
            <div className="w-100 p-2">
              <PlayerPalette player={opponent} cancelAction={this.cancelGame} />
            </div>
            <div className="w-100 p-2">
              <PlayerPalette player={player} />
            </div>
          </div>
        </div>

        <div className="w-100 d-block d-md-none p-2">
          <PlayerPalette player={player} />
        </div>
      </div>
    );
  }
}

Game.contextType = RouteContext;

function copy(obj) {
  return { ...obj };
}

function pseudoCopy(board) {
  const copy = {};
  for (const coord of coords) {
    copy[coord] = board[coord].player + board[coord].piece;
  }

  return copy;
}

function empty(board, coord) {
  board[coord] = {
    piece: null,
    player: null
  };
}

function isEmptyAt(board, coord) {
  if (!board[coord].piece) {
    return true;
  } else {
    return false;
  }
}

function movePiece(board, start, end) {
  // castling
  if (board[start].piece === 'k') {
    if (start === 15 && end === 13) {
      movePiece(board, 11, 14);
    } else if (start === 15 && end === 17) {
      movePiece(board, 18, 16);
    } else if (start === 85 && end === 83) {
      movePiece(board, 81, 84);
    } else if (start === 85 && end === 87) {
      movePiece(board, 88, 86);
    }
  }

  // en passant
  if (board[start].piece === 'p') {
    if ((end - start === 11 || end - start === 9) && !board[end].piece) {
      empty(board, end - 10);
    } else if ((end - start === -11 || end - start === -9) && !board[end].piece) {
      empty(board, end + 10);
    }
  }

  // basic move piece
  board[end] = board[start];
  empty(board, start);
}

function findMoveSpace(board, turn, start, killsOnly, gamestate) {
  const piece = board[start].piece;
  const moveSpace = [];

  if (piece === 'p') {
    // turn is 'wb' or 'bw' where turn[0] is the current turn
    if (board[start].player === 'w') {
      // starting moves
      if (!killsOnly) {
        if (!board[start + 10].piece) {
          moveSpace.push(start + 10);
        }
        if ((start < 30) && isEmptyAt(board, start + 10) && isEmptyAt(board, start + 20)) {
          moveSpace.push(start + 20);
        }
      }
      // attack moves
      const pawnMoves = [9, 11];
      for (const pawnMove of pawnMoves) {
        const newSpot = start + pawnMove;
        if (!coords.isCoord(newSpot)) {
          continue;
        } else if (isEmptyAt(board, newSpot)) {
          continue;
        } else if (board[newSpot].player === turn[0]) {
          continue;
        } else if (board[newSpot].player === turn[1]) {
          moveSpace.push(newSpot);
        }
      }
      // en passant
      const potentialEnPassants = [-1, 1];
      for (const potentialEnPassant of potentialEnPassants) {
        const newSpot = start + potentialEnPassant;
        if (!coords.isCoord(newSpot)) {
          continue;
        } else if ((start > 50 && start < 59) &&
          (board[newSpot].player === 'b' && board[newSpot].piece === 'p') &&
          gamestate.enPassantBlack === (newSpot + 20)) {
          moveSpace.push(newSpot + 10);
        }
      }
    } else if (board[start].player === 'b') {
      // starting moves
      if (!killsOnly) {
        if (!board[start - 10].piece) {
          moveSpace.push(start - 10);
        }
        if ((start > 70) && isEmptyAt(board, start - 10) && isEmptyAt(board, start - 20)) {
          moveSpace.push(start - 20);
        }
      }
      // attack moves
      const pawnMoves = [-9, -11];
      for (const pawnMove of pawnMoves) {
        const newSpot = start + pawnMove;
        if (!coords.isCoord(newSpot)) {
          continue;
        } else if (isEmptyAt(board, newSpot)) {
          continue;
        } else if (board[newSpot].player === turn[0]) {
          continue;
        } else if (board[newSpot].player === turn[1]) {
          moveSpace.push(newSpot);
        }
      }
      // en passant
      const potentialEnPassants = [-1, 1];
      for (const potentialEnPassant of potentialEnPassants) {
        const newSpot = start + potentialEnPassant;
        if (!coords.isCoord(newSpot)) {
          continue;
        } else if ((start > 40 && start < 49) &&
          (board[newSpot].player === 'w' && board[newSpot].piece === 'p') &&
          gamestate.enPassantWhite === (newSpot - 20)) {
          moveSpace.push(newSpot - 10);
        }
      }
    }
  } else if (piece === 'r') {
    const rookMoves = [1, -1, 10, -10];
    for (const rookmove of rookMoves) {
      for (let multiplier = 1; multiplier < 9; multiplier++) {
        const newSpot = start + rookmove * multiplier;
        if (!coords.isCoord(newSpot)) {
          break;
        } else if (isEmptyAt(board, newSpot)) {
          moveSpace.push(newSpot);
        } else if (board[newSpot].player === turn[0]) {
          break;
        } else if (board[newSpot].player === turn[1]) {
          moveSpace.push(newSpot);
          break;
        }
      }
    }
  } else if (piece === 'n') {
    const knightMoves = [21, 12, -21, -12, 8, 19, -8, -19];
    for (const knightMove of knightMoves) {
      const newSpot = start + knightMove;
      if (!coords.isCoord(newSpot)) {
        continue;
      } else if (isEmptyAt(board, newSpot)) {
        moveSpace.push(newSpot);
      } else if (board[newSpot].player === turn[0]) {
        continue;
      } else if (board[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
      }
    }
  } else if (piece === 'b') {
    const bishopMoves = [11, -11, 9, -9];
    for (const bishopMove of bishopMoves) {
      for (let multiplier = 1; multiplier < 9; multiplier++) {
        const newSpot = start + bishopMove * multiplier;
        if (!coords.isCoord(newSpot)) {
          break;
        } else if (isEmptyAt(board, newSpot)) {
          moveSpace.push(newSpot);
        } else if (board[newSpot].player === turn[0]) {
          break;
        } else if (board[newSpot].player === turn[1]) {
          moveSpace.push(newSpot);
          break;
        }
      }
    }
  } else if (piece === 'q') {
    const queenMoves = [1, -1, 10, -10, 11, -11, 9, -9];
    for (const queenMove of queenMoves) {
      for (let multiplier = 1; multiplier < 9; multiplier++) {
        const newSpot = start + queenMove * multiplier;
        if (!coords.isCoord(newSpot)) {
          break;
        } else if (isEmptyAt(board, newSpot)) {
          moveSpace.push(newSpot);
        } else if (board[newSpot].player === turn[0]) {
          break;
        } else if (board[newSpot].player === turn[1]) {
          moveSpace.push(newSpot);
          break;
        }
      }
    }
  } else if (piece === 'k') {
    const kingMoves = [10, -10, 1, -1, 11, -11, 9, -9];

    // normal moves
    for (const kingMove of kingMoves) {
      const newSpot = start + kingMove;
      if (!coords.isCoord(newSpot)) {
        continue;
      } else if (isEmptyAt(board, newSpot)) {
        moveSpace.push(newSpot);
      } else if (board[newSpot].player === turn[0]) {
        continue;
      } else if (board[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
      }
    }

    // castling
    if (!killsOnly) {
      const canCastleKeys = turn === 'wb'
        ? ['whiteKingCanCastle', 'whiteQueenCanCastle']
        : ['blackKingCanCastle', 'blackQueenCanCastle'];
      for (const canCastleKey of canCastleKeys) {
        if (gamestate[canCastleKey]) {
          if (canCastleKey === 'whiteKingCanCastle') {
            moveSpace.push(17);
          } else if (canCastleKey === 'whiteQueenCanCastle') {
            moveSpace.push(13);
          } else if (canCastleKey === 'blackKingCanCastle') {
            moveSpace.push(87);
          } else if (canCastleKey === 'blackQueenCanCastle') {
            moveSpace.push(83);
          }
        }
      }
    }
  }

  return moveSpace;
}

function findEnemyMoveSpace(board, turn, gamestate) {
  const enemyMoveSpace = new Set();
  const enemyCoords = [];

  // find location of all enemy pieces
  for (const coord of coords) {
    if (isEmptyAt(board, coord)) {
      continue;
    } else if (board[coord].player === turn[1]) {
      enemyCoords.push(coord);
    }
  }

  // union all move spaces of enemy pieces
  for (const enemyCoord of enemyCoords) {
    const eachMoveSpace = findMoveSpace(board, turn[1] + turn[0], enemyCoord, true, gamestate);
    for (const move of eachMoveSpace) {
      enemyMoveSpace.add(move);
    }
  }
  return [...enemyMoveSpace];
}

function isViableStart(board, gamestate, start, turn) {
  if (board[start].player !== turn[0]) {
    return false;
  }

  // find move space of start
  const moveSpace = findMoveSpace(board, turn, start, false, gamestate);
  if (!moveSpace) {
    return false;
  }

  // is viable start if it has viable moves
  for (let i = 0; i < moveSpace.length; i++) {
    if (isViableMove(board, gamestate, turn, start, moveSpace[i])) {
      return true;
    }
  }

  return false;
}

function isViableMove(board, gamestate, turn, start, end) {
  const potentialBoard = copy(board);
  movePiece(potentialBoard, start, end);
  const enemyMoveSpace = findEnemyMoveSpace(potentialBoard, turn, gamestate);

  // find ally king coord after move
  const coords = new Coords();
  let kingCoord;
  for (const coord of coords) {
    if (potentialBoard[coord].player === turn[0] && potentialBoard[coord].piece === 'k') {
      kingCoord = coord;
      break;
    }
  }

  // is not viable if king is in enemy move space
  for (let i = 0; i < enemyMoveSpace.length; i++) {
    if (kingCoord === enemyMoveSpace[i]) {
      return false;
    }
  }

  return true;
}

function changeTurn(gamestate) {
  if (gamestate.turn === 'bw') {
    gamestate.turnNum++;
    console.log('turnNum:', gamestate.turnNum); // eslint-disable-line
    gamestate.enPassantWhite = 0;
  } else {
    gamestate.enPassantBlack = 0;
  }
  gamestate.nextTurn = gamestate.turn;
  gamestate.turn = gamestate.turn[1] + gamestate.turn[0];
}
