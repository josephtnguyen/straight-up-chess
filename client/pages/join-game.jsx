import React from 'react';
import { io } from 'socket.io-client';
import AddPostButton from '../components/add-post-button';
import Post from '../components/post';
import RouteContext from '../lib/route-context';

export default class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    };
    this.loadGames = this.loadGames.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    const { socket } = this;
    socket.on('game joined', () => {
      this.loadGames();
    });
    socket.emit('join lobby');
    this.loadGames();
  }

  componentWillUnmount() {
    const { socket } = this;
    if (this.context.path === 'game') {
      socket.emit('game joined');
    }
    socket.disconnect();
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

JoinGame.contextType = RouteContext;
