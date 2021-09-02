import { useState } from 'react';

import { Notation } from './Notation';
import { Piece } from './Piece';
import { Square } from './Square';
import { Squares } from './Squares';
import { useChessboard } from '../context/chessboard-context';
import { WhiteKing } from './ErrorBoundary';

export function Board() {
  const [squares, setSquares] = useState({});

  const { boardWidth, showBoardNotation, currentPosition, screenSize, premoves } = useChessboard();

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
          const squareHasPremove = premoves.find((p) => p.sourceSq === square || p.targetSq === square);
          const squareHasPremoveTarget = premoves.find((p) => p.targetSq === square);
          return (
            <Square
              key={`${col}${row}`}
              square={square}
              squareColor={squareColor}
              setSquares={setSquares}
              squareHasPremove={squareHasPremove}
            >
              {currentPosition[square] && (
                <Piece
                  square={square}
                  piece={currentPosition[square]}
                  getSquareCoordinates={getSquareCoordinates}
                  getSingleSquareCoordinates={getSingleSquareCoordinates}
                />
              )}
              {squareHasPremoveTarget && (
                <Piece
                  isPremovedPiece={true}
                  square={square}
                  piece={squareHasPremoveTarget.piece}
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
