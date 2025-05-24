import { useDraggable } from "@dnd-kit/core";

import { useChessboardContext } from "./ChessboardProvider";
import { defaultPieces } from "./pieces";
import type { DraggingPieceDataType, PieceDataType, PieceType } from "./types";
import { useEffect, useState } from "react";

type Props = {
  clone?: boolean;
  isSparePiece?: DraggingPieceDataType["isSparePiece"];
  position: DraggingPieceDataType["position"];
  pieceType: PieceDataType["pieceType"];
};

export function Piece({ clone, isSparePiece = false, position, pieceType }: Props) {
  const { animationDurationInMs, boardOrientation, positionDifferences, onPieceClick } =
    useChessboardContext();
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: position,
    data: {
      isSparePiece,
      pieceType,
    },
  });

  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (positionDifferences[position]) {
      const sourceSquare = position;
      const targetSquare = positionDifferences[position];

      const squareWidth = document
        .querySelector(`[data-column="a"][data-row="1"]`)
        ?.getBoundingClientRect().width;

      if (!squareWidth) {
        throw new Error("Square width not found");
      }

      setAnimationStyle({
        transform: `translate(${
          (boardOrientation === "black" ? -1 : 1) *
          (targetSquare.charCodeAt(0) - sourceSquare.charCodeAt(0)) *
          squareWidth
        }px, ${
          (boardOrientation === "black" ? -1 : 1) *
          (Number(sourceSquare[1]) - Number(targetSquare[1])) *
          squareWidth
        }px)`,
        transition: `transform ${animationDurationInMs}ms`,
        zIndex: 10,
      });
    } else {
      setAnimationStyle({});
    }
  }, [positionDifferences]);

  const PieceSvg = defaultPieces[pieceType];

  return (
    <div
      id={`${pieceType}-${position}`}
      data-piece={pieceType}
      ref={setNodeRef}
      style={{
        ...animationStyle,
        opacity: isDragging ? 0.5 : undefined,
        width: "100%",
        height: "100%",
        cursor: clone ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onClick={() =>
        onPieceClick?.({ isSparePiece, piece: { pieceType }, square: position })
      }
      {...attributes}
      {...listeners}
    >
      <PieceSvg />
    </div>
  );
}

type SparePieceProps = {
  pieceType: PieceType;
};

export function SparePiece({ pieceType }: SparePieceProps) {
  return <Piece isSparePiece position={pieceType} pieceType={pieceType} />;
}
