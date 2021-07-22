import React from 'react';
import AddPostButton from '../components/add-post-button';
import Post from '../components/post';

export default class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    };
  }

  componentDidMount() {
    const req = {
      method: 'GET'
    };
    fetch('/api/games', req)
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
