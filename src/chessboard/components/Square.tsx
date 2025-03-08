import { ReactNode, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

import { useChessboard } from "../context/chessboard-context";
import { BoardOrientation, Coords, Piece, Square as Sq } from "../types";

export enum SquareType {
  Normal = "Normal",
  NonExistent = "NonExistent", // maybe it should be bitmap but it felt overengineered so made it an enum
  NonExistentHighlighted = "NonExistentHighlighted",
}

type SquareProps = {
  children: ReactNode;
  setSquares: React.Dispatch<React.SetStateAction<{ [square in Sq]?: Coords }>>;
  location: Sq;
  squareColor: "white" | "black";
  squareHasPremove: boolean;
  clickCallback: (location: Sq) => void;
  mouseOverCb?: (location: Sq) => void;
  mouseOutCb?: (location: Sq) => void;
  squareType: SquareType;
};

export function Square({
  location: location,
  squareColor,
  setSquares,
  squareHasPremove,
  children,
  clickCallback,
  mouseOverCb,
  mouseOutCb,
  squareType
}: SquareProps) {
  const squareRef = useRef<HTMLElement>(null);
  const {
    autoPromoteToQueen,
    boardWidth,
    boardOrientation,
    clearArrows,
    boardState,
    currentRightClickDown,
    customBoardStyle,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customPremoveDarkSquareStyle,
    customPremoveLightSquareStyle,
    customSquare: CustomSquare,
    customSquareStyles,
    drawNewArrow,
    handleSetPosition,
    handleSparePieceDrop,
    isWaitingForAnimation,
    lastPieceColour,
    lastSquareDraggedOver,
    onArrowDrawEnd,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceDrop,
    onPromotionCheck,
    onRightClickDown,
    onRightClickUp,
    onSquareClick,
    setLastSquareDraggedOver,
    setPromoteFromSquare,
    setPromoteToSquare,
    setShowPromoteDialog,
  } = useChessboard();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "piece",
      drop: handleDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [
      location,
      boardState.getBoard(),
      onPieceDrop,
      isWaitingForAnimation,
      lastPieceColour,
    ]
  );

  type BoardPiece = {
    piece: Piece;
    readonly isSpare: false;
    square: Sq;
    id: number;
  };
  type SparePiece = { piece: Piece; readonly isSpare: true; id: number };

  function handleDrop(item: BoardPiece | SparePiece) {
    if (item.isSpare) {
      handleSparePieceDrop(item.piece, location);
      return;
    }
    if (onPromotionCheck(item.square, location, item.piece)) {
      if (autoPromoteToQueen) {
        handleSetPosition(
          item.square,
          location,
          item.piece[0] === "w" ? "wQ" : "bQ"
        );
      } else {
        setPromoteFromSquare(item.square);
        setPromoteToSquare(location);
        setShowPromoteDialog(true);
      }
    } else {
      handleSetPosition(item.square, location, item.piece, true);
    }
  }

  useEffect(() => {
    if (squareRef.current) {
      const { x, y } = squareRef.current.getBoundingClientRect();
      setSquares((oldSquares) => ({ ...oldSquares, [location]: { x, y } }));
    }
  }, [boardWidth, boardOrientation]);

  const defaultSquareStyle = {
    ...borderRadius(location, boardOrientation, customBoardStyle),
    ...(squareColor === "black"
      ? customDarkSquareStyle
      : customLightSquareStyle),
    ...(squareHasPremove &&
      (squareColor === "black"
        ? customPremoveDarkSquareStyle
        : customPremoveLightSquareStyle)),
    ...(isOver && customDropSquareStyle),
  };

  return (
    <div
      ref={drop}
      style={{
        ...defaultSquareStyle,
        ...sqTypeStyles(squareType),
      }}
      data-square-color={squareColor}
      data-square={location}
      onTouchMove={(e) => {
        // Handle touch events on tablet and mobile not covered by onMouseOver/onDragEnter
        const touchLocation = e.touches[0];
        const touchElement = document.elementsFromPoint(
          touchLocation.clientX,
          touchLocation.clientY
        );
        const draggedOverSquare = touchElement
          ?.find((el) => el.getAttribute("data-square"))
          ?.getAttribute("data-square") as Sq;
        if (draggedOverSquare && draggedOverSquare !== lastSquareDraggedOver) {
          setLastSquareDraggedOver(draggedOverSquare);
          onDragOverSquare(draggedOverSquare);
        }
      }}
      onMouseOver={(e) => {
        // noop if moving from child of square into square.
        if (e.buttons === 2 && currentRightClickDown) {
          drawNewArrow(currentRightClickDown, location);
        }

        if (
          e.relatedTarget &&
          e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          return;
        }

        mouseOverCb?.(location);
        onMouseOverSquare(location);
      }}
      onMouseOut={(e) => {
        // noop if moving from square into a child of square.
        if (
          e.relatedTarget &&
          e.currentTarget.contains(e.relatedTarget as Node)
        )
          return;
        mouseOutCb?.(location);
        onMouseOutSquare(location);
      }}
      onMouseDown={(e) => {
        if (e.button === 2) onRightClickDown(location);
      }}
      onMouseUp={(e) => {
        if (e.button === 2) {
          if (currentRightClickDown)
            onArrowDrawEnd(currentRightClickDown, location);
          onRightClickUp(location);
        }
      }}
      onDragEnter={() => onDragOverSquare(location)}
      onClick={() => {
        const piece = boardState.getPiece(location);
        onSquareClick(location, piece);
        clickCallback(location);
        clearArrows();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {typeof CustomSquare === "string" ? (
        <CustomSquare
          // Type is too complex to properly evaluate, so ignore this line.
          // @ts-ignore
          ref={squareRef as any}
          style={{
            ...size(boardWidth),
            ...center,
            ...(!squareHasPremove && customSquareStyles?.[location]),
          }}
        >
          {children}
        </CustomSquare>
      ) : (
        <CustomSquare
          ref={squareRef}
          square={location}
          squareColor={squareColor}
          style={{
            ...size(boardWidth),
            ...center,
            ...(!squareHasPremove && customSquareStyles?.[location]),
          }}
        >
          {children}
        </CustomSquare>
      )}
    </div>
  );
}

const center = {
  display: "flex",
  justifyContent: "center",
};

const sqTypeStyles = (sqType: SquareType) => {
  switch (sqType) {
    case SquareType.NonExistent:
      return { opacity: 0 };
    case SquareType.NonExistentHighlighted:
      return { opacity: 0.5 };
    default:
      return {};
  }
}

const size = (width: number) => ({
  width: width / 8,
  height: width / 8,
});

const borderRadius = (
  square: Sq,
  boardOrientation: BoardOrientation,
  customBoardStyle?: Record<string, string | number>
) => {
  if (!customBoardStyle?.borderRadius) return {};

  if (square === "a1") {
    return boardOrientation === "white"
      ? { borderBottomLeftRadius: customBoardStyle.borderRadius }
      : { borderTopRightRadius: customBoardStyle.borderRadius };
  }
  if (square === "a8") {
    return boardOrientation === "white"
      ? { borderTopLeftRadius: customBoardStyle.borderRadius }
      : { borderBottomRightRadius: customBoardStyle.borderRadius };
  }
  if (square === "h1") {
    return boardOrientation === "white"
      ? { borderBottomRightRadius: customBoardStyle.borderRadius }
      : { borderTopLeftRadius: customBoardStyle.borderRadius };
  }
  if (square === "h8") {
    return boardOrientation === "white"
      ? { borderTopRightRadius: customBoardStyle.borderRadius }
      : { borderBottomLeftRadius: customBoardStyle.borderRadius };
  }

  return {};
};
