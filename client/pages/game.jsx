import React from 'react';
import { io } from 'socket.io-client';
import ReactBoard from '../components/board';
import PlayerPalette from '../components/player-palette';
import Board from '../lib/board';
import GameState from '../lib/gamestate';
import Coords from '../lib/coords';
import RouteContext from '../lib/route-context';

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
    this.isViableMove = this.isViableMove.bind(this);
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
    const coord = parseInt(event.target.closest('.tile').id);
    if (Number.isNaN(coord)) {
      return;
    }
    if (this.state.phase === 'selecting') {
      this.showOptions(coord);
    }
  }

  showOptions(start) {
    const { board, gamestate } = this.state;
    const { isViableMove } = this;
    if (board.isEmptyAt(start)) {
      return;
    }

    // find all potential moves
    const highlighted = [];
    const moveSpace = board.findMoveSpace(gamestate.turn, start, false, gamestate);
    for (let i = 0; i < moveSpace.length; i++) {
      if (isViableMove(gamestate.turn, start, moveSpace[i])) {
        highlighted.push(moveSpace[i]);
      }
    }

    this.setState({
      selected: start,
      phase: 'showing options',
      highlighted
    });
  }

  isViableMove(turn, start, end) {
    const { board, gamestate } = this.state;
    const potentialBoard = { ...board };
    Object.setPrototypeOf(potentialBoard, Board.prototype);
    potentialBoard.movePiece(start, end);
    const enemyMoveSpace = potentialBoard.findEnemyMoveSpace(turn, gamestate);

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
