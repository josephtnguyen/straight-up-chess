import React from 'react';
import Header from './components/header';
import Nav from './components/nav';
import Home from './pages/home';
import JoinGame from './pages/join-game';
import PostForm from './pages/post-form';
import Game from './pages/game';
import parseRoute from './lib/parse-route';
import RouteContext from './lib/route-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      route: parseRoute(window.location.hash)
    };
    this.handleClickNav = this.handleClickNav.bind(this);
    this.renderPage = this.renderPage.bind(this);
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

  renderPage() {
    switch (this.state.route.path) {
      case 'home':
        return <Home />;
      case 'join':
        return <JoinGame />;
      case 'post':
        return <PostForm />;
      case 'game':
        return <Game />;
      default:
        window.location.hash = '#home';
    }
  }

  render() {
    const { navOpen } = this.state;
    const { handleClickNav } = this;
    return (
      <RouteContext.Provider value={this.state.route}>
        <>
          <Header navOpen={navOpen} handleClickNav={handleClickNav} />
          <Nav navOpen={navOpen} handleClickNav={handleClickNav} />
          {this.renderPage()}
        </>
      </RouteContext.Provider>
    );
  }
}
