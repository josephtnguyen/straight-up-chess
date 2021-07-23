import React from 'react';
import { io } from 'socket.io-client';
import AddPostButton from '../components/add-post-button';
import Post from '../components/post';
import parseRoute from '../lib/parse-route';

export default class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      socket: io()
    };
    this.loadGames = this.loadGames.bind(this);
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('game joined', () => {
      this.loadGames();
    });
    socket.emit('join lobby');
    this.loadGames();
  }

  componentWillUnmount() {
    const { socket } = this.state;
    if (parseRoute(window.location.hash).path === 'game') {
      socket.emit('game joined');
    }
    this.state.socket.disconnect();
  }

  loadGames() {
    fetch('/api/games')
      .then(res => res.json())
      .then(result => this.setState({ posts: result }));
  }

  render() {
    const posts = this.state.posts
      ? this.state.posts.map(post => <Post key={post.gameId} meta={post} />)
      : null;
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
              {posts}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
