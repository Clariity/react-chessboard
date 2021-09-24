import { useState, useRef, useEffect } from 'react';

import { Notation } from './Notation';
import { Piece } from './Piece';
import { Square } from './Square';
import { Squares } from './Squares';
import { useChessboard } from '../context/chessboard-context';
import { WhiteKing } from './ErrorBoundary';

export function Board() {
  const boardRef = useRef();
  const [squares, setSquares] = useState({});

  const {
    arrows,
    boardWidth,
    clearCurrentRightClickDown,
    customArrowColor,
    showBoardNotation,
    currentPosition,
    screenSize,
    premoves
  } = useChessboard();

  useEffect(() => {
    function handleClickOutside(event) {
      if (boardRef.current && !boardRef.current.contains(event.target)) {
        clearCurrentRightClickDown();
      }
    }

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

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
    <div ref={boardRef} style={{ position: 'relative' }}>
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
      <svg
        width={boardWidth}
        height={boardWidth}
        style={{ position: 'absolute', top: '0', left: '0', pointerEvents: 'none', zIndex: '10' }}
      >
        {arrows.map((arrow, i) => (
          <>
            <defs>
              <marker id="arrowhead" markerWidth="2" markerHeight="2.5" refX="1.25" refY="1.25" orient="auto">
                <polygon points="0 0, 2 1.25, 0 2.5" style={{ fill: customArrowColor }} />
              </marker>
            </defs>
            <line
              x1={arrow[0].x}
              y1={arrow[0].y}
              x2={arrow[1].x}
              y2={arrow[1].y}
              key={i}
              style={{ stroke: customArrowColor, strokeWidth: boardWidth / 36 }}
              markerEnd="url(#arrowhead)"
            />
          </>
        ))}
      </svg>
    </div>
  ) : (
    <WhiteKing />
  );
}
