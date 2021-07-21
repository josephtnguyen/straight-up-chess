import React from 'react';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      gamestate: null,
      player: 'w'
    };
  }

  render() {
    return (
      <div className="game container page-height">

      </div>
    );
  }
}
