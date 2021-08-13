import React from 'react';
import Coords from '../lib/coords';

const coords = new Coords();

export default function Board(props) {
  const { board, side, highlighted, selected } = props;

  // generate plain board
  const rows = [];
  let row = [];
  for (const coord of coords) {
    row.push(coord);
    if (coord % 10 === 8) {
      rows.push(row);
      row = [];
    }
  }
  const tiles = rows.map((row, index) => {
    const rowClass = side === 'white'
      ? 'board-row d-flex'
      : 'board-row d-flex flex-row-reverse';
    return (
      <div key={index} className={rowClass}>
        {row.map(coord => {
          const highlight = highlighted.includes(coord) ? ' highlighted' : '';
          const select = selected === coord ? ' selected' : '';
          const tileClass = 'tile' + highlight + select;
          return (
            <div key={coord} className={tileClass} id={coord} />
          );
        })}
      </div>
    );
  });

  // add pieces
  const pieces = [];
  for (const coord of coords) {
    if (board[coord].piece) {
      pieces.push({
        coord,
        description: board[coord].player + board[coord].piece,
        pieceId: board[coord].pieceId
      });
    }
  }
  const renderedPieces = pieces.map(piece => {
    const src = `/images/${piece.description}.svg`;
    let [row, col] = piece.coord.toString();
    if (side === 'black') {
      row = 9 - row;
      col = 9 - col;
    }
    const pieceClass = `chess-piece playing board-row-${row} board-col-${col}`;
    return (<img key={piece.pieceId} src={src} className={pieceClass} />);
  });

  const boardClass = side === 'white'
    ? 'board d-flex flex-column-reverse'
    : 'board d-flex flex-column';
  return (
    <>
      <div className={boardClass}>
        {tiles}
      </div>
      {renderedPieces}
    </>
  );
}
