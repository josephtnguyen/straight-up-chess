import React from 'react';
import AddPostButton from '../components/add-post-button';
import Post from '../components/post';

const dummy = {
  createdAt: '2021-07-22T16:11:11.537Z',
  gameId: 22,
  message: 'hi hi',
  opponentName: null,
  playerName: 'Anonymous',
  playerSide: 'white'
};

export default class JoinGame extends React.Component {
  render() {
    return (
      <div className="join-page container page-height w-100">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <AddPostButton />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="scroller px-1 py-2">
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
              <Post meta={dummy} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
