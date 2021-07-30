import React from 'react';
import Header from './components/header';
import Nav from './components/nav';
import Home from './pages/home';
import JoinGame from './pages/join-game';
import PostForm from './pages/post-form';
import Game from './pages/game';
import AuthForm from './pages/auth-form';
import parseRoute from './lib/parse-route';
import GlobalContext from './lib/global-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      route: parseRoute(window.location.hash),
      user: { username: 'Anonymous' }
    };
    this.handleClickNav = this.handleClickNav.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
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

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
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
      case 'sign-up':
        return <AuthForm />;
      case 'sign-in':
        return <AuthForm />;
      default:
        window.location.hash = '#home';
    }
  }

  render() {
    const { navOpen, route } = this.state;
    const { handleClickNav, handleSignIn } = this;
    const contextValue = {
      route,
      handleSignIn
    };
    return (
      <GlobalContext.Provider value={contextValue}>
        <>
          <Header navOpen={navOpen} handleClickNav={handleClickNav} />
          <Nav navOpen={navOpen} handleClickNav={handleClickNav} />
          {this.renderPage()}
        </>
      </GlobalContext.Provider>
    );
  }
}
