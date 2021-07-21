import React from 'react';
import ReactBoard from '../components/board';
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
    return (
      <div className="game container page-height">
        <ReactBoard board={board} />
      </div>
    );
  }
}
