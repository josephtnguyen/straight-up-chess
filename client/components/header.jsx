import React from 'react';

export default class Header extends React.Component {
  render() {
    const { navOpen, handleClickNav } = this.props;
    const hamburgerClass = 'btn hamburger-menu-btn' + (navOpen ? ' selected' : '');
    const avatarStyle = {
      backgroundImage: 'url(images/default-avatar.png)'
    };
    return (
      <div className="header container d-flex justify-content-between align-items-center">
        <button className={hamburgerClass} onClick={handleClickNav}>
          <img src="images/hamburger-menu.svg" />
        </button>
        <button className="btn avatar" style={avatarStyle} />
      </div>
    );
  }
}
