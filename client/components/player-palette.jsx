import React from 'react';

export default function PlayerPalette(props) {
  const { username } = props.player;
  return (
    <div className="player-palette">
      <div className="d-flex align-items-center">
        <img src="images/default-avatar.png" className="palette-avatar" />
        <span className="font-24 palette-username">{username}</span>
      </div>
    </div>
  );
}
