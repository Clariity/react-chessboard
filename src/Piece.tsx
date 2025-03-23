import { useDraggable } from "@dnd-kit/core";

import { defaultPieces } from "./pieces";
import type { PieceType } from "./types";

type Props = {
  clone?: boolean;
  disabled?: boolean;
  id: string;
  position?: { x: number; y: number };
  type: PieceType;
};

export function Piece({ clone, disabled, id, position, type }: Props) {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  const PieceSvg = defaultPieces[type];

  return (
    <div
      id={id as string}
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
  type: PieceType;
};

export function SparePiece({ type }: SparePieceProps) {
  return <Piece id={type} type={type} />;
}
