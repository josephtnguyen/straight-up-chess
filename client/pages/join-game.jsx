import React from 'react';
import { io } from 'socket.io-client';
import AddPostButton from '../components/add-post-button';
import Post from '../components/post';

export default class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loadingGames: true
    };
    this.loadGames = this.loadGames.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    const { socket } = this;
    socket.on('game joined', removed => {
      const posts = this.state.posts.filter(post => post.gameId !== removed.gameId);
      this.setState({ posts });
    });
    socket.on('disconnect', reason => {
      if (reason === 'io server disconnect') {
        console.error({ error: 'an unexpected error occurred' });
      }
    });
    socket.emit('join lobby');

    this.loadGames();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  loadGames() {
    fetch('/api/games')
      .then(res => res.json())
      .then(result => this.setState({ posts: result, loadingGames: false }));
  }

  render() {
    const { posts, loadingGames } = this.state;
    if (loadingGames) {
      return null;
    }
    let noGames = <div className="no-games py-4">There are no games posted...</div>;
    if (posts.length !== 0) {
      noGames = null;
    }
    const reactPosts = posts.map(post => <Post key={post.gameId} meta={post} />);
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
              {noGames}
              {reactPosts}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
