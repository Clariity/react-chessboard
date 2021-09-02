import React from 'react';

import { Piece } from './Piece';
import { useChessboard } from '../context/chessboard-context';

export function SparePieces({ placement }) {
  const { boardOrientation, boardWidth } = useChessboard();

  const spares =
    boardOrientation === 'black' ? ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'] : ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];

  return (
    <div style={spareStyles(boardWidth)}>
      {spares.map((p) => (
        <div key={p}>
          <Piece piece={p} square={'spare'} draggable={true} />
        </div>
      ))}
    </div>
  );
}

const spareStyles = (width) => ({
  display: 'flex',
  justifyContent: 'center',
  width
});
