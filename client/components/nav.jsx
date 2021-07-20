import React from 'react';

export default class Nav extends React.Component {
  render() {
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
    const { navOpen, handleClickNav } = this.props;
    const navBackgroundClass = 'nav-background position-absolute page-height' + (navOpen ? ' show' : '');
    const navClass = 'nav position-absolute flex-column page-height' + (navOpen ? ' show' : '');

    return (
      <>
        <div className={navBackgroundClass} onClick={handleClickNav} />
        <ul className={navClass}>
          {loggedOutLinks.map(link => (
            <li key={link.href} className="nav-item">
              <a href={link.href} className="nav-link navbar-link" onClick={handleClickNav}>
                {link.text}
              </a>
              <hr className="navbar-sep" />
            </li>
          ))}
        </ul>
      </>
    );
  }
}
