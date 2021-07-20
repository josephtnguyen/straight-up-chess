import React from 'react';

export default function SideSelectButton(props) {
  const { type, side, handleSelect } = props;
  const btnClass = `side-select ${type.toLowerCase()}${side === type ? ' selected' : ''}`;
  return (
    <button className={btnClass} onClick={handleSelect}>
      {type}
    </button>
  );
}
