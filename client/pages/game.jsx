import React from 'react';
import ReactBoard from '../components/board';
import PlayerPalette from '../components/player-palette';
import Board from '../lib/board';
import GameState from '../lib/gamestate';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Board(),
      gamestate: new GameState(),
      player: 'w'
    };
  }

  render() {
    const { board } = this.state;
    const player = { username: 'Anonymous' };
    return (
      <div className="game container page-height">
        <div>
          <ReactBoard board={board} />
        </div>
        <PlayerPalette player={player} />
      </div>
    );
  }
}
