import React from 'react';

import { COLUMNS } from '../consts';
import { useChessboard } from '../context/chessboard-context';

export function Squares({ children }) {
  const { boardOrientation, boardWidth, customBoardStyle, id } = useChessboard();

  return (
    <div data-boardid={id} style={{ ...boardStyles(boardWidth), ...customBoardStyle }}>
      {[...Array(8)].map((_, r) => {
        return (
          <div key={r.toString()} style={rowStyles(boardWidth)}>
            {[...Array(8)].map((_, c) => {
              // a1, a2 ...
              const square = boardOrientation === 'black' ? COLUMNS[7 - c] + (r + 1) : COLUMNS[c] + (8 - r);
              const squareColor = c % 2 === r % 2 ? 'white' : 'black';
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
