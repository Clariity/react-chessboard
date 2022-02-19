import React, { useCallback } from 'react';
import { DragLayer } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

function CDragLayer(props) {
  const { boardWidth, chessPieces, id, snapToCursor } = useChessboard();
  const { isDragging, item, clientOffset, sourceClientOffset } = props;

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10,
    left: 0,
    top: 0
  };

  const getItemStyle = useCallback(
    (clientOffset, sourceClientOffset) => {
      if (!clientOffset || !sourceClientOffset) return { display: 'none' };

      let { x, y } = snapToCursor ? clientOffset : sourceClientOffset;
      if (snapToCursor) {
        const halfSquareWidth = boardWidth / 8 / 2;
        x -= halfSquareWidth;
        y -= halfSquareWidth;
      }
      const transform = `translate(${x}px, ${y}px)`;

      return {
        transform,
        WebkitTransform: transform,
        touchAction: 'none'
      };
    },
    [boardWidth, snapToCursor]
  );

  return isDragging && item.id === id ? (
    <div style={layerStyles}>
      <div style={getItemStyle(clientOffset, sourceClientOffset)}>
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
    </div>
  ) : null;
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export const CustomDragLayer = DragLayer(collect)(CDragLayer);
