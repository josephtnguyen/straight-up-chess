import React from 'react';

export default function CancelButton(props) {
  const { href } = props;
  return (
    <a href={href}>
      <button className="cancel-btn">Cancel</button>
    </a>
  );
}
