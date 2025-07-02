import { useDraggable } from '@dnd-kit/core';

import { useChessboardContext } from './ChessboardProvider';
import type { DraggingPieceDataType, PieceDataType } from './types';

type DraggableProps = {
  children: React.ReactNode;
  isSparePiece?: DraggingPieceDataType['isSparePiece'];
  pieceType: PieceDataType['pieceType'];
  position: DraggingPieceDataType['position'];
};

export function Draggable({
  children,
  isSparePiece = false,
  pieceType,
  position,
}: DraggableProps) {
  const { allowDragging, canDragPiece } = useChessboardContext();

  const { setNodeRef, attributes, listeners } = useDraggable({
    id: position,
    data: {
      isSparePiece,
      pieceType,
    },
    disabled:
      !allowDragging ||
      (canDragPiece &&
        !canDragPiece({
          piece: { pieceType },
          isSparePiece,
          square: position,
        })),
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
