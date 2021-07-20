import React from 'react';

export default class Header extends React.Component {
  render() {
    const avatarStyle = {
      backgroundImage: 'url(images/default-avatar.svg)'
    };
    return (
      <div className="header container d-flex justify-content-between align-items-center">
        <button className="btn hamburger-menu-btn">
          <img src="images/hamburger-menu.svg" />
        </button>
        <button className="btn avatar" style={avatarStyle}></button>
      </div>
    );
  }
}
