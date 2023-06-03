import { ReactNode, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { useChessboard } from "../context/chessboard-context";
import { Coords, CustomPieceFn, Piece as Pc, Square } from "../types";

type PieceProps = {
  isPremovedPiece?: boolean;
  piece: Pc;
  square: Square;
  squares: { [square in Square]?: Coords };
};

export function Piece({
  isPremovedPiece = false,
  piece,
  square,
  squares,
}: PieceProps) {
  const {
    animationDuration,
    arePiecesDraggable,
    arePremovesAllowed,
    boardWidth,
    chessPieces,
    currentPosition,
    id,
    isDraggablePiece,
    isWaitingForAnimation,
    onPieceClick,
    onPieceDragBegin,
    onPieceDragEnd,
    positionDifferences,
    premoves,
  } = useChessboard();

  const [pieceStyle, setPieceStyle] = useState({
    opacity: 1,
    zIndex: 5,
    touchAction: "none",
    cursor:
      arePiecesDraggable && isDraggablePiece({ piece, sourceSquare: square })
        ? "-webkit-grab"
        : "default",
  });

  const [{ canDrag, isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "piece",
      item: () => {
        onPieceDragBegin(piece, square);
        return { piece, square, id };
      },
      end: () => onPieceDragEnd(piece, square),
      collect: (monitor) => ({
        canDrag: isDraggablePiece({ piece, sourceSquare: square }),
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [piece, square, currentPosition, id]
  );

  // hide the default preview
  dragPreview(getEmptyImage(), { captureDraggingState: true });

  // hide piece on drag
  useEffect(() => {
    setPieceStyle((oldPieceStyle) => ({
      ...oldPieceStyle,
      opacity: isDragging ? 0 : 1,
    }));
  }, [isDragging]);

  // hide piece on matching premoves
  useEffect(() => {
    // if premoves aren't allowed, don't waste time on calculations
    if (!arePremovesAllowed) return;

    let hidePiece = false;
    // side effect: if piece moves into pre-moved square, its hidden

    // if there are any premove targets on this square, hide the piece underneath
    if (!isPremovedPiece && premoves.find((p) => p.targetSq === square))
      hidePiece = true;

    // if sourceSq === sq and piece matches then this piece has been pre-moved elsewhere?
    if (premoves.find((p) => p.sourceSq === square && p.piece === piece))
      hidePiece = true;

    // TODO: If a premoved piece returns to a premoved square, it will hide (e1, e2, e1)

    setPieceStyle((oldPieceStyle) => ({
      ...oldPieceStyle,
      display: hidePiece ? "none" : "unset",
    }));
  }, [currentPosition, premoves]);

  // new move has come in
  // if waiting for animation, then animation has started and we can perform animation
  // we need to head towards where we need to go, we are the source, we are heading towards the target
  useEffect(() => {
    const removedPiece = positionDifferences.removed?.[square];
    // return as null and not loaded yet
    if (!positionDifferences.added) return;
    // check if piece matches or if removed piece was a pawn and new square is on 1st or 8th rank (promotion)
    const newSquare = (
      Object.entries(positionDifferences.added) as [Square, Pc][]
    ).find(
      ([s, p]) =>
        p === removedPiece ||
        (removedPiece?.[1] === "P" && (s[1] === "1" || s[1] === "8"))
    );
    // we can perform animation if our square was in removed, AND the matching piece is in added AND this isn't a premoved piece
    if (
      isWaitingForAnimation &&
      removedPiece &&
      newSquare &&
      !isPremovedPiece
    ) {
      const { sourceSq, targetSq } = getSquareCoordinates(square, newSquare[0]);
      if (sourceSq && targetSq) {
        setPieceStyle((oldPieceStyle) => ({
          ...oldPieceStyle,
          transform: `translate(${targetSq.x - sourceSq.x}px, ${
            targetSq.y - sourceSq.y
          }px)`,
          transition: `transform ${animationDuration}ms`,
          zIndex: 6,
        }));
      }
    }
  }, [positionDifferences]);

  // translate to their own positions (repaint on undo)
  useEffect(() => {
    const { sourceSq } = getSingleSquareCoordinates();
    if (sourceSq) {
      setPieceStyle((oldPieceStyle) => ({
        ...oldPieceStyle,
        transform: `translate(${0}px, ${0}px)`,
        transition: `transform ${0}ms`,
      }));
    }
  }, [currentPosition]);

  // update is piece draggable
  useEffect(() => {
    setPieceStyle((oldPieceStyle) => ({
      ...oldPieceStyle,
      cursor:
        arePiecesDraggable && isDraggablePiece({ piece, sourceSquare: square })
          ? "-webkit-grab"
          : "default",
    }));
  }, [square, currentPosition, arePiecesDraggable]);

  function getSingleSquareCoordinates() {
    return { sourceSq: squares[square] };
  }

  function getSquareCoordinates(sourceSquare: Square, targetSquare: Square) {
    return {
      sourceSq: squares[sourceSquare],
      targetSq: squares[targetSquare],
    };
  }

  return (
    <div
      ref={arePiecesDraggable ? (canDrag ? drag : null) : null}
      onClick={() => onPieceClick(piece)}
      data-piece={piece}
      style={pieceStyle}
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
