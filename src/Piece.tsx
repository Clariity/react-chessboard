import { useDraggable } from "@dnd-kit/core";

import { defaultPieces } from "./pieces";
import type { PieceDataType, PieceType } from "./types";

type Props = {
  clone?: boolean;
  position: PieceDataType["position"] | PieceType;
  pieceType: PieceDataType["pieceType"];
};

export function Piece({ clone, position, pieceType }: Props) {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: position,
  });

  const PieceSvg = defaultPieces[pieceType];

  return (
    <div
      id={position}
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.5 : undefined,
        width: "100%",
        height: "100%",
        cursor: clone ? "grabbing" : "grab",
        touchAction: "none",
      }}
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
  return <Piece position={pieceType} pieceType={pieceType} />;
}
