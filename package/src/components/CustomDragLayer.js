import React from 'react';
import { DragLayer } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

function CDragLayer(props) {
  const { boardWidth, chessPieces, id } = useChessboard();
  const { isDragging, item, currentOffset } = props;

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10,
    left: 0,
    top: 0
  };

  const getItemStyle = (currentOffset) => {
    if (!currentOffset) return { display: 'none' };

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;

    return {
      transform,
      WebkitTransform: transform,
      touchAction: 'none'
    };
  };

  return isDragging && item.id === id ? (
    <div style={layerStyles}>
      <div style={getItemStyle(currentOffset)}>
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
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export const CustomDragLayer = DragLayer(collect)(CDragLayer);
