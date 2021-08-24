import { useState } from 'react';
import { usePreview } from 'react-dnd-multi-backend';

import Piece from './Piece';
import Square from './Square';
import Notation from './Notation';
import Squares from './Squares';
import { useChessboard } from '../context/chessboard-context';
import { WhiteKing } from './ErrorBoundary';

export default function Board() {
  const [squares, setSquares] = useState({});

  const { boardWidth, chessPieces, showBoardNotation, currentPosition, screenSize } = useChessboard();

  function getSingleSquareCoordinates(square) {
    return { sourceSq: squares[square] };
  }

  function getSquareCoordinates(sourceSquare, targetSquare) {
    return {
      sourceSq: squares[sourceSquare],
      targetSq: squares[targetSquare]
    };
  }

  const HookPreview = () => {
    const { display, item, style } = usePreview();
    if (!display) {
      return null;
    }
    return (
      <div
        style={{
          ...style,
          touchAction: 'none'
        }}
      >
        {typeof chessPieces[item.piece] === 'function' ? (
          chessPieces[item.piece]({
            squareWidth: boardWidth / 8,
            isDragging: true
          })
        ) : (
          <svg viewBox={'1 1 43 43'} width={boardWidth / 8} height={boardWidth / 8}>
            <g>{chessPieces[item.piece]}</g>
          </svg>
        )}
      </div>
    );
  };

  return screenSize && boardWidth ? (
    <>
      <HookPreview />
      <Squares>
        {({ square, squareColor, col, row }) => {
          return (
            <Square key={`${col}${row}`} square={square} squareColor={squareColor} setSquares={setSquares}>
              {currentPosition[square] && (
                <Piece
                  square={square}
                  piece={currentPosition[square]}
                  getSquareCoordinates={getSquareCoordinates}
                  getSingleSquareCoordinates={getSingleSquareCoordinates}
                />
              )}
              {showBoardNotation && <Notation row={row} col={col} />}
            </Square>
          );
        }}
      </Squares>
    </>
  ) : (
    <WhiteKing />
  );
}
