import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

export default function Square({ square, squareColor, setSquares, children }) {
  const squareRef = useRef();
  const {
    boardWidth,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customSquareStyles,
    handleSetPosition,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onSquareClick,
    onSquareRightClick,
    waitingForAnimation
  } = useChessboard();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'piece',
      drop: (item) => handleSetPosition(item.square, square, item.piece),
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    [square, waitingForAnimation]
  );

  useEffect(() => {
    const { x, y } = squareRef.current.getBoundingClientRect();
    setSquares((oldSquares) => ({ ...oldSquares, [square]: { x, y } }));
  }, [boardWidth]);

  const defaultSquareStyle = {
    ...size(boardWidth),
    ...center,
    ...(squareColor === 'black' ? customDarkSquareStyle : customLightSquareStyle),
    ...(isOver && customDropSquareStyle)
  };

  return (
    <div
      data-testid={`${squareColor}-square`}
      data-squareid={square}
      ref={drop}
      style={defaultSquareStyle}
      onMouseOver={() => onMouseOverSquare(square)}
      onMouseOut={() => onMouseOutSquare(square)}
      onDragEnter={() => onDragOverSquare(square)}
      // onMouseDown={() => console.log(square)}
      // onMouseUp={() => console.log(square)}
      onClick={() => onSquareClick(square)}
      onContextMenu={(e) => {
        e.preventDefault();
        onSquareRightClick(square);
      }}
    >
      <div
        ref={squareRef}
        style={{
          ...size(boardWidth),
          ...center,
          ...customSquareStyles?.[square]
        }}
      >
        {children}
      </div>
    </div>
  );
}

const center = {
  display: 'flex',
  justifyContent: 'center'
};

const size = (width) => ({
  width: width / 8,
  height: width / 8
});
