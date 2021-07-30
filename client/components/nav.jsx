import React from 'react';
import GlobalContext from '../lib/global-context';
import LogInOut from './log-in-out';

export default class Nav extends React.Component {
  render() {
    const { navOpen } = this.props;
    const { user, handleClickNav } = this.context;
    const loggedOutLinks = [
      {
        href: '#home',
        text: 'Home'
      },
      {
        href: '#join',
        text: 'Join Game'
      }
    ];
    const loggedInLinks = [
      {
        href: '#home',
        text: 'Home'
      },
      {
        href: '#join',
        text: 'Join Game'
      }
    ];
    const links = !user.userId ? loggedOutLinks : loggedInLinks;
    const navBackgroundClass = 'nav-background position-absolute page-height' + (navOpen ? ' show' : '');
    const navClass = 'nav position-absolute flex-column page-height' + (navOpen ? ' show' : '');

    return (
      <>
        <div className={navBackgroundClass} onClick={handleClickNav} />
        <ul className={navClass}>
          {links.map(link => (
            <li key={link.href} className="nav-item">
              <a href={link.href} className="nav-link navbar-link" onClick={handleClickNav}>
                {link.text}
              </a>
              <hr className="navbar-sep" />
            </li>
          ))}

          <li>
            <LogInOut />
          </li>
        </ul>
      </>
    );
  }
}

Nav.contextType = GlobalContext;
