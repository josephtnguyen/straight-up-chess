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
    return (
      <ul className="nav position-absolute flex-column">
        {loggedOutLinks.map(link => (
          <li key={link.href} className="nav-item">
            <a href={link.href} className="nav-link navbar-link">{link.text}</a>
            <hr className="navbar-sep" />
          </li>
        ))}
      </ul>
    );
  }
}
