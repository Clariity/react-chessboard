import { useDragLayer } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

// Terribly inefficient, will just deal with half opaque pieces

export default function CustomDragLayer() {
  const { boardWidth, chessPieces, id } = useChessboard();

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  };

  function getItemStyles() {
    if (!currentOffset) return { display: 'none' };

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform
    };
  }

  return isDragging && item.id === id ? (
    <div style={layerStyles}>
      <div style={getItemStyles()}>
        <div
          style={{
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
      </div>
    </div>
  ) : null;
}
