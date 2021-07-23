import React from 'react';
import { io } from 'socket.io-client';
import ReactBoard from '../components/board';
import PlayerPalette from '../components/player-palette';
import Board from '../lib/board';
import GameState from '../lib/gamestate';
import RouteContext from '../lib/route-context';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Board(),
      gamestate: new GameState(),
      meta: null,
      side: null
    };
    this.cancelGame = this.cancelGame.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    const { socket } = this;
    const { params } = this.context;
    const gameId = params.get('gameId');
    const side = params.get('side');
    socket.on('room joined', () => {
      fetch(`/api/games/${gameId}`)
        .then(res => res.json())
        .then(result => {
          this.setState({ meta: result });
        });
    });

    fetch(`/api/games/${gameId}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ meta: result, side });
        socket.emit('join room', this.state.meta.gameId);
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

  render() {
    const { board, meta, side } = this.state;
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

            <div className="board-container my-2">
              <ReactBoard board={board} side={side} />
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
