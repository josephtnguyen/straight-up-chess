import React from 'react';
import Header from './components/header';
import Nav from './components/nav';
import Home from './pages/home';
import JoinGame from './pages/join-game';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      route: parseRoute(window.location.hash)
    };
    this.renderPage = this.renderPage.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    switch (this.state.route) {
      case 'home':
        return <Home />;
      case 'join':
        return <JoinGame />;
      default:
        console.log(`Could not find page for ${this.state.route}`); // eslint-disable-line
    }
  }

  render() {
    return (
      <>
        <Header />
        <Nav />
        {this.renderPage()}
      </>
    );
  }
}
