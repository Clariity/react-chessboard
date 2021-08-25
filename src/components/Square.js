import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

export default function Square({ square, squareColor, setSquares, children }) {
  const squareRef = useRef();
  const {
    boardWidth,
    boardOrientation,
    currentPosition,
    customBoardStyle,
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
    [square, currentPosition, waitingForAnimation]
  );

  useEffect(() => {
    const { x, y } = squareRef.current.getBoundingClientRect();
    setSquares((oldSquares) => ({ ...oldSquares, [square]: { x, y } }));
  }, [boardWidth]);

  const defaultSquareStyle = {
    ...size(boardWidth),
    ...center,
    ...borderRadius(customBoardStyle, square, boardOrientation),
    ...(squareColor === 'black' ? customDarkSquareStyle : customLightSquareStyle),
    ...(isOver && customDropSquareStyle)
  };

  return (
    <div
      ref={drop}
      style={defaultSquareStyle}
      onMouseOver={() => onMouseOverSquare(square)}
      onMouseOut={() => onMouseOutSquare(square)}
      onDragEnter={() => onDragOverSquare(square)}
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

const borderRadius = (customBoardStyle, square, boardOrientation) => {
  if (!customBoardStyle.borderRadius) return {};

  if (square === 'a1') {
    return boardOrientation === 'white'
      ? { borderBottomLeftRadius: customBoardStyle.borderRadius }
      : { borderTopRightRadius: customBoardStyle.borderRadius };
  }
  if (square === 'a8') {
    return boardOrientation === 'white'
      ? { borderTopLeftRadius: customBoardStyle.borderRadius }
      : { borderBottomRightRadius: customBoardStyle.borderRadius };
  }
  if (square === 'h1') {
    return boardOrientation === 'white'
      ? { borderBottomRightRadius: customBoardStyle.borderRadius }
      : { borderTopLeftRadius: customBoardStyle.borderRadius };
  }
  if (square === 'h8') {
    return boardOrientation === 'white'
      ? { borderTopRightRadius: customBoardStyle.borderRadius }
      : { borderBottomLeftRadius: customBoardStyle.borderRadius };
  }

  return {};
};
