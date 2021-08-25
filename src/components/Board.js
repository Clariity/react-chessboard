import { useState } from 'react';

import Piece from './Piece';
import Square from './Square';
import Notation from './Notation';
import Squares from './Squares';
import { useChessboard } from '../context/chessboard-context';
import { WhiteKing } from './ErrorBoundary';

export default function Board() {
  const [squares, setSquares] = useState({});

  const { boardWidth, showBoardNotation, currentPosition, screenSize } = useChessboard();

  function getSingleSquareCoordinates(square) {
    return { sourceSq: squares[square] };
  }

  function getSquareCoordinates(sourceSquare, targetSquare) {
    return {
      sourceSq: squares[sourceSquare],
      targetSq: squares[targetSquare]
    };
  }

  return screenSize && boardWidth ? (
    <>
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
