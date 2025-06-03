import {
  DraggableAttributes,
  DraggableSyntheticListeners,
  useDraggable,
} from '@dnd-kit/core';
import { memo } from 'react';

import { useChessboardContext } from './ChessboardProvider';
import type { DraggingPieceDataType, PieceDataType, PieceType } from './types';
import { useEffect, useState } from 'react';

type PieceProps = {
  clone?: boolean;
  isSparePiece?: DraggingPieceDataType['isSparePiece'];
  position: DraggingPieceDataType['position'];
  pieceType: PieceDataType['pieceType'];
  isDragging: boolean;
  setNodeRef: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
};

// Pure presentation component that can be memoized
const PieceComponent = memo(function PieceComponent({
  clone,
  isSparePiece = false,
  position,
  pieceType,
  isDragging,
  setNodeRef,
  attributes,
  listeners,
}: PieceProps) {
  const {
    allowDragging,
    animationDurationInMs,
    boardOrientation,
    canDragPiece,
    pieces,
    positionDifferences,
    onPieceClick,
  } = useChessboardContext();

  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});

  let cursorStyle = clone ? 'grabbing' : 'grab';
  if (
    !allowDragging ||
    (canDragPiece &&
      !canDragPiece({ piece: { pieceType }, isSparePiece, square: position }))
  ) {
    cursorStyle = 'pointer';
  }

  useEffect(() => {
    if (positionDifferences[position]) {
      const sourceSquare = position;
      const targetSquare = positionDifferences[position];

      const squareWidth = document
        .querySelector(`[data-column="a"][data-row="1"]`)
        ?.getBoundingClientRect().width;

      if (!squareWidth) {
        throw new Error('Square width not found');
      }

      setAnimationStyle({
        transform: `translate(${
          (boardOrientation === 'black' ? -1 : 1) *
          (targetSquare.charCodeAt(0) - sourceSquare.charCodeAt(0)) *
          squareWidth
        }px, ${
          (boardOrientation === 'black' ? -1 : 1) *
          (Number(sourceSquare[1]) - Number(targetSquare[1])) *
          squareWidth
        }px)`,
        transition: `transform ${animationDurationInMs}ms`,
        position: 'relative', // creates a new stacking context so the piece stays above squares during animation
        zIndex: 10,
      });
    } else {
      setAnimationStyle({});
    }
  }, [positionDifferences]);

  const PieceSvg = pieces[pieceType];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      id={`${pieceType}-${position}`}
      data-piece={pieceType}
      style={{
        ...animationStyle,
        opacity: isDragging ? 0.5 : undefined,
        width: '100%',
        height: '100%',
        cursor: cursorStyle,
        touchAction: 'none', // prevent zooming and scrolling on touch devices
      }}
      onClick={() =>
        onPieceClick?.({ isSparePiece, piece: { pieceType }, square: position })
      }
    >
      <PieceSvg />
    </div>
  );
});

// Wrapper component that handles the draggable logic
export function Piece({
  clone,
  isSparePiece = false,
  position,
  pieceType,
}: Omit<PieceProps, 'isDragging' | 'setNodeRef' | 'attributes' | 'listeners'>) {
  const { allowDragging, canDragPiece } = useChessboardContext();
  const { isDragging, setNodeRef, attributes, listeners } = useDraggable({
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
    <PieceComponent
      clone={clone}
      isSparePiece={isSparePiece}
      position={position}
      pieceType={pieceType}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      attributes={attributes}
      listeners={listeners}
    />
  );
}

type SparePieceProps = {
  pieceType: PieceType;
};

export function SparePiece({ pieceType }: SparePieceProps) {
  return <Piece isSparePiece position={pieceType} pieceType={pieceType} />;
}
