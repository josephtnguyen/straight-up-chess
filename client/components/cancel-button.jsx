import React from 'react';

export default function CancelButton(props) {
  const { href } = props;
  return (
    <a href={href} className="cancel-btn">
      <span>Cancel</span>
    </a>
  );
}
