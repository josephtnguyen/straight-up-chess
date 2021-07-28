import React from 'react';

export default function PostGame(props) {
  const { player, opponent } = props;
  return (
    <div className="post-game w-100 position-fixed page-height">
      <div className="row">
        <div className="d-flex align-items-center my-2">
          <Player player={player} win={true} />
        </div>
        <div className="d-flex align-items-center my-2">
          <Player player={opponent} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Resolution resolution="win" />
        </div>
      </div>

      <div className="row justify-content-center my-3">
        <div className="col">
          <a className="return-to-game-btn" href="">Return to Game</a>
        </div>
      </div>

      <div className="row my-3">
        <div className="col justify-content-center">
          <a className="exit-btn" href="#join">Exit</a>
        </div>
      </div>
    </div>
  );
}

function Player(props) {
  let { player, win } = props;
  if (!player) {
    player = { username: 'Anonymous' };
  }
  const avatarStyle = {
    backgroundImage: 'url(images/default-avatar.png)'
  };
  const trophy = <img className="trophy mx-2" src="images/trophy.svg" />;
  return (
    <>
      <button className="dot gray mx-1" />
      <button className="btn avatar mx-2" style={avatarStyle} />
      <span className="font-24">{player.username}</span>
      {win && trophy}
    </>
  );
}

function Resolution(props) {
  const { resolution } = props;
  let text;
  if (resolution === 'win') {
    text = (
      <>
        <img className="trophy mx-2" src="images/trophy.svg" />
        {'You won!!'}
        <img className="trophy mx-2" src="images/trophy.svg" />
      </>
    );
  } else if (resolution === 'lose') {
    text = 'You lost...';
  } else if (resolution === 'draw') {
    text = 'Draw!';
  }
  return (
    <div className="resolution mt-5">
      {text}
    </div>
  );
}
