import React from 'react';

import { COLUMNS } from '../consts';
import { useChessboard } from '../context/chessboard-context';

export default function Squares({ children }) {
  const { boardOrientation, boardWidth, customBoardStyle, id } = useChessboard();

  let squareColor = 'white';

  return (
    <div style={{ ...boardStyles(boardWidth), ...customBoardStyle }} data-boardid={id}>
      {[...Array(8)].map((_, r) => {
        return (
          <div key={r.toString()} style={rowStyles(boardWidth)}>
            {[...Array(8)].map((_, c) => {
              // a1, a2 ...
              const square = boardOrientation === 'black' ? COLUMNS[7 - c] + (r + 1) : COLUMNS[c] + (8 - r);
              squareColor = c % 2 === 0 ? (r % 2 === 0 ? 'white' : 'black') : r % 2 === 0 ? 'black' : 'white';
              return children({ square, squareColor, col: c, row: r });
            })}
          </div>
        );
      })}
    </div>
  );
}

const boardStyles = (width) => ({
  cursor: 'default',
  height: width,
  width
});

const rowStyles = (width) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  width
});
