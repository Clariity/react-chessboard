import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { CustomPieceFn, Piece as Pc } from "../types";
import { defaultPieces } from "../media/pieces";

type PieceProps = {
  piece: Pc;
  width: number;
  customPieceJSX?: CustomPieceFn;
  dndId: string;
};

export const SparePiece = ({
  piece,
  width,
  customPieceJSX,
  dndId,
}: PieceProps) => {
  const renderPiece = customPieceJSX ?? defaultPieces[piece];
  const [{ canDrag, isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "piece",
      item: () => {
        return { piece, isSpare: true, id: dndId };
      },

      collect: (monitor) => ({
        canDrag: true,
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [piece, dndId]
  );

  // hide the default preview
  dragPreview(getEmptyImage(), { captureDraggingState: true });

  return (
    <div
      ref={canDrag ? drag : null}
      data-piece={piece}
      style={{ cursor: "move" }}
    >
      {typeof renderPiece === "function" ? (
        (renderPiece as CustomPieceFn)({
          squareWidth: width,
          isDragging,
        })
      ) : (
        <svg viewBox={"1 1 43 43"} width={width} height={width}>
          <g>{renderPiece as ReactNode}</g>
        </svg>
      )}
    </div>
  );
};
