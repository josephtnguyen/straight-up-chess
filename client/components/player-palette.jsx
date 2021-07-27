import React from 'react';

export default function PlayerPalette(props) {
  if (!props.player) {
    return (
      <div className="player-palette d-flex flex-column justify-content-center align-items-center">
        <p className="font-24 palette-pending">Waiting for challenger...</p>
        <button className="cancel-btn" onClick={props.cancelAction}>Cancel</button>
      </div>
    );
  }

  const { player, dead } = props;
  const deadPieces = dead.map((piece, index) => {
    const src = `/images/${piece}.svg`;
    return <img key={index} src={src} className="dead chess-piece m-1" />;
  });
  return (
    <div className="player-palette">
      <div className="d-flex align-items-center">
        <img src="images/default-avatar.png" className="palette-avatar" />
        <span className="font-24 palette-username">{player.username}</span>
      </div>

      <div className="d-flex flex-wrap">
        {deadPieces}
      </div>
    </div>
  );
}
