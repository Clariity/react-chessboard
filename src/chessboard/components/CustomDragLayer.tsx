import { ReactNode, useCallback } from "react";
import { useDragLayer, XYCoord } from "react-dnd";

import { useChessboard } from "../context/chessboard-context";
import { CustomPieceFn, Piece, Square } from "../types";

export function CustomDragLayer() {
  const { boardWidth, chessPieces, id, snapToCursor } = useChessboard();

  const collectedProps = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const {
    isDragging,
    item,
    clientOffset,
    sourceClientOffset,
  }: {
    item: { piece: Piece; square: Square; id: number };
    clientOffset: XYCoord | null;
    sourceClientOffset: XYCoord | null;
    isDragging: boolean;
  } = collectedProps;

  const getItemStyle = useCallback(
    (clientOffset: XYCoord | null, sourceClientOffset: XYCoord | null) => {
      if (!clientOffset || !sourceClientOffset) return { display: "none" };

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
        touchAction: "none",
      };
    },
    [boardWidth, snapToCursor]
  );

  return isDragging && item.id === id ? (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 10,
        left: 0,
        top: 0,
      }}
    >
      <div style={getItemStyle(clientOffset, sourceClientOffset)}>
        {typeof chessPieces[item.piece] === "function" ? (
          (chessPieces[item.piece] as CustomPieceFn)({
            squareWidth: boardWidth / 8,
            isDragging: true,
          })
        ) : (
          <svg viewBox={"1 1 43 43"} width={boardWidth / 8} height={boardWidth / 8}>
            <g>{chessPieces[item.piece] as ReactNode}</g>
          </svg>
        )}
      </div>
    </div>
  ) : null;
}
