import React from 'react';
import Coords from '../lib/coords';

const coords = new Coords();

export default function Board(props) {
  const { board, side, highlighted, selected } = props;
  const rows = [];
  let row = [];
  for (const coord of coords) {
    row.push(coord);
    if (coord % 10 === 8) {
      rows.push(row);
      row = [];
    }
  }

  // add pieces
  const pieces = [];
  for (const coord of coords) {
    if (board[coord].piece) {
      pieces.push({ coord, piece: board[coord].player + board[coord].piece });
    }
  }
  const renderedPieces = pieces.map(piece => {
    const src = `/images/${piece.piece}.svg`;
    return (<img key={piece.coord} src={src} className="new-chess-piece" />);
  });

  const tiles = rows.map((row, index) => {
    const rowClass = side === 'white'
      ? 'board-row d-flex'
      : 'board-row d-flex flex-row-reverse';
    return (
      <div key={index} className={rowClass}>
        {row.map(coord => {
          // const tile = board[coord];
          // let piece;
          // if (tile.piece) {
          //   const { player: side, piece: type } = tile;
          //   const src = `/images/${side + type}.svg`;
          //   piece = <img src={src} className="chess-piece" />;
          // }

          const highlight = highlighted.includes(coord) ? ' highlighted' : '';
          const select = selected === coord ? ' selected' : '';
          const tileClass = 'tile' + highlight + select;
          return (
            <div key={coord} className={tileClass} id={coord}>
              {/* {piece} */}
            </div>
          );
        })}
      </div>
    );
  });

  const boardClass = side === 'white'
    ? 'board d-flex flex-column-reverse'
    : 'board d-flex flex-column';
  return (
    <>
      <div className={boardClass}>
        {tiles}
      </div>
      {/* <img src={'/images/wp.svg'} className="new-chess-piece" />; */}
      {renderedPieces}
    </>
  );
}
