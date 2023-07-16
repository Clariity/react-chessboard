import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { useChessboard } from "../context/chessboard-context";
import { CustomPieceFn, Piece as Pc } from "../types";

type PieceProps = {
  piece: Pc;
};

export function SparePiece({ piece }: PieceProps) {
  const { boardWidth, chessPieces, id } = useChessboard();

  const [{ canDrag, isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "piece",
      item: () => {
        return { piece, isSpare: true, id };
      },

      collect: (monitor) => ({
        canDrag: true,
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [piece, id]
  );

  // hide the default preview
  dragPreview(getEmptyImage(), { captureDraggingState: true });

  return (
    <div
      ref={canDrag ? drag : null}
      onClick={() => console.log("CLICL")}
      data-piece={piece}
      style={{ cursor: "move" }}
    >
      {typeof chessPieces[piece] === "function" ? (
        (chessPieces[piece] as CustomPieceFn)({
          squareWidth: boardWidth / 8,
          isDragging,
        })
      ) : (
        <svg
          viewBox={"1 1 43 43"}
          width={boardWidth / 8}
          height={boardWidth / 8}
        >
          <g>{chessPieces[piece] as ReactNode}</g>
        </svg>
      )}
    </div>
  );
}
