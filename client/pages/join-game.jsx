import React from 'react';
import AddPostButton from '../components/add-post-button';

export default class JoinGame extends React.Component {
  render() {
    return (
      <div className="join-page container page-height">
        <div className="row">
          <div className="col d-flex justify-center">
            <AddPostButton />
          </div>
        </div>

        <div className="row">
          <div className="col">

          </div>
        </div>
      </div>
    );
  }
}
