import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

export function Square({ square, squareColor, setSquares, squareHasPremove, children }) {
  const squareRef = useRef();
  const {
    boardWidth,
    boardOrientation,
    clearArrows,
    currentPosition,
    customBoardStyle,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customPremoveDarkSquareStyle,
    customPremoveLightSquareStyle,
    customSquareStyles,
    handleSetPosition,
    lastPieceColour,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onRightClickDown,
    onRightClickUp,
    onSquareClick,
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
    [square, currentPosition, waitingForAnimation, lastPieceColour]
  );

  useEffect(() => {
    const { x, y } = squareRef.current.getBoundingClientRect();
    setSquares((oldSquares) => ({ ...oldSquares, [square]: { x, y } }));
  }, [boardWidth]);

  const defaultSquareStyle = {
    ...borderRadius(customBoardStyle, square, boardOrientation),
    ...(squareColor === 'black' ? customDarkSquareStyle : customLightSquareStyle),
    ...(squareHasPremove && (squareColor === 'black' ? customPremoveDarkSquareStyle : customPremoveLightSquareStyle)),
    ...(isOver && customDropSquareStyle)
  };

  return (
    <div
      ref={drop}
      style={defaultSquareStyle}
      onMouseOver={() => onMouseOverSquare(square)}
      onMouseOut={() => onMouseOutSquare(square)}
      onMouseDown={(e) => {
        if (e.button === 2) onRightClickDown(square);
      }}
      onMouseUp={(e) => {
        if (e.button === 2) onRightClickUp(square);
      }}
      onDragEnter={() => onDragOverSquare(square)}
      onClick={() => {
        onSquareClick(square);
        clearArrows();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
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
