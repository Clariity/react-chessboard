import { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';

import { useChessboard } from '../context/chessboard-context';

export default function Piece({ square, piece, getSquareCoordinates, getSingleSquareCoordinates }) {
  const {
    animationDuration,
    arePiecesDraggable,
    boardWidth,
    id,
    isDraggablePiece,
    onPieceClick,
    chessPieces,
    dropTarget,
    positionDifferences,
    waitingForAnimation,
    currentPosition
  } = useChessboard();

  const [pieceStyle, setPieceStyle] = useState({
    opacity: 1,
    zIndex: 5,
    touchAction: 'none',
    cursor: arePiecesDraggable
      ? isDraggablePiece({ piece, sourceSquare: square })
        ? '-webkit-grab'
        : 'not-allowed'
      : 'default'
  });

  const [{ canDrag, isDragging }, drag] = useDrag(
    () => ({
      type: 'piece',
      item: { piece, square, id },
      collect: (monitor) => ({
        canDrag: isDraggablePiece({ piece, sourceSquare: square }),
        isDragging: !!monitor.isDragging()
      })
    }),
    [piece, square, currentPosition]
  );

  // hide piece on drag
  useEffect(() => {
    setPieceStyle({
      ...pieceStyle,
      opacity: isDragging ? 0 : 1
    });
  }, [isDragging]);

  useEffect(() => {
    // new move has come in
    // if waiting for animation, then animation has started and we can perform animation
    // we need to head towards where we need to go, we are the source, we are heading towards the target
    const removedPiece = positionDifferences.removed?.[square];
    // check if piece matches or if removed piece was a pawn and new square is on 1st or 8th rank (promotion)
    const newSquare = Object.entries(positionDifferences.added).find(
      ([s, p]) => p === removedPiece || (removedPiece?.[1] === 'P' && (s[1] === '1' || s[1] === '8'))
    );
    // we can perform animation if our square was in removed, AND the matching piece is in added
    if (waitingForAnimation && removedPiece && newSquare) {
      const { sourceSq, targetSq } = getSquareCoordinates(square, newSquare[0]);
      if (sourceSq && targetSq) {
        setPieceStyle({
          ...pieceStyle,
          transform: `translate(${targetSq.x - sourceSq.x}px, ${targetSq.y - sourceSq.y}px)`,
          transition: `transform ${animationDuration}ms`
        });
      }
    }
  }, [positionDifferences]);

  // translate to their own positions (repaint on undo)
  useEffect(() => {
    const { sourceSq } = getSingleSquareCoordinates(square);
    if (sourceSq) {
      setPieceStyle({
        ...pieceStyle,
        transform: `translate(${0}px, ${0}px)`,
        transition: `transform ${0}ms`
      });
    }
  }, [currentPosition]);

  return (
    <div
      ref={arePiecesDraggable ? (canDrag ? drag : null) : null}
      onClick={() => onPieceClick(piece)}
      style={pieceStyle}
    >
      {typeof chessPieces[piece] === 'function' ? (
        chessPieces[piece]({
          squareWidth: boardWidth / 8,
          isDragging,
          droppedPiece: dropTarget?.piece,
          targetSquare: dropTarget?.target,
          sourceSquare: dropTarget?.source
        })
      ) : (
        <svg viewBox={'1 1 43 43'} width={boardWidth / 8} height={boardWidth / 8}>
          <g>{chessPieces[piece]}</g>
        </svg>
      )}
    </div>
  );
}
