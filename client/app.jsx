import React from 'react';
import Header from './components/header';
import Nav from './components/nav';
import Home from './pages/home';
import JoinGame from './pages/join-game';
import parseRoute from './lib/parse-route';
import PostForm from './pages/post-form';
import Game from './pages/game';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      route: parseRoute(window.location.hash),
      gameDetails: null
    };
    this.handleClickNav = this.handleClickNav.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  handleClickNav() {
    if (this.state.navOpen) {
      this.setState({ navOpen: false });
    } else {
      this.setState({ navOpen: true });
    }
  }

  joinGame(gameDetails) {
    this.setState({ gameDetails });
  }

  renderPage() {
    switch (this.state.route.path) {
      case 'home':
        return <Home />;
      case 'join':
        return <JoinGame />;
      case 'post':
        return <PostForm onCreate={this.joinGame} />;
      case 'game':
        return <Game details={this.state.gameDetails} />;
      default:
        window.location.hash = '#home';
    }
  }

  render() {
    const { navOpen } = this.state;
    const { handleClickNav } = this;
    return (
      <>
        <Header navOpen={navOpen} handleClickNav={handleClickNav} />
        <Nav navOpen={navOpen} handleClickNav={handleClickNav} />
        {this.renderPage()}
      </>
    );
  }
}
