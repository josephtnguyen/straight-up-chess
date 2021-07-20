import React from 'react';

export default function GameModeButton(props) {
  const { type } = props;
  const text = type === 's' ? 'Singleplayer' : 'Multiplayer';
  return (
    <button className="btn gamemode">{text}</button>
  );
}
