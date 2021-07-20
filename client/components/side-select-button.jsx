import React from 'react';

export default function SideSelectButton(props) {
  const { type } = props;
  const btnClass = 'side-select ' + type.toLowerCase();
  return (
    <button className={btnClass}>
      {type}
    </button>
  );
}
