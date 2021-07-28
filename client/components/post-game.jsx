import React from 'react';

export default function PostGame(props) {
  const { player, opponent } = props;
  return (
    <div className="post-game w-100 position-fixed page-height">
      <div className="d-flex align-items-center my-2">
        <Player player={player} win={true} />
      </div>
      <div className="d-flex align-items-center my-2">
        <Player player={opponent} />
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
