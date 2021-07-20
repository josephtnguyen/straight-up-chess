import React from 'react';

export default class Header extends React.Component {
  render() {
    const avatarStyle = {
      backgroundImage: 'url(images/default-avatar.svg)'
    };
    return (
      <div className="navbar container header">
        <button className="btn hamburger-menu-btn">
          <img src="images/hamburger-menu.svg" />
        </button>
        <button className="btn avatar" style={avatarStyle}></button>
      </div>
    );
  }
}
