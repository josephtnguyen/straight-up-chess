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
      meta: this.props.details
    };
    this.cancelGame = this.cancelGame.bind(this);
  }

  cancelGame() {
    const { postId } = this.state.meta;
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/cancel-post/${postId}`, req)
      .then(res => res.json())
      .then(result => {
        window.location.hash = '#join';
      });
  }

  render() {
    const { board } = this.state;
    const player = { username: 'Anonymous' };
    return (
      <div className="game container page-height">
        <PlayerPalette player={null} cancelAction={this.cancelGame} />
        <div>
          <ReactBoard board={board} />
        </div>
        <PlayerPalette player={player} />
      </div>
    );
  }
}
