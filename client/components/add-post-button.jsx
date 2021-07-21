import React from 'react';

export default function AddPostButton(props) {
  return (
    <a href="#post">
      <button className="add-post-btn justify-center align-items-center">
        <img src="/images/add-icon.svg" />
      </button>
    </a>
  );
}
