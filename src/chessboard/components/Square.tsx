import { ReactNode, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

import { useChessboard } from "../context/chessboard-context";
import { BoardOrientation, Coords, Piece, Square as Sq } from "../types";

type SquareProps = {
  children: ReactNode;
  setSquares: React.Dispatch<React.SetStateAction<{ [square in Sq]?: Coords }>>;
  square: Sq;
  squareColor: "white" | "black";
  squareHasPremove: boolean;
};

export function Square({
  square,
  squareColor,
  setSquares,
  squareHasPremove,
  children,
}: SquareProps) {
  const squareRef = useRef<HTMLElement>(null);
  const {
    autoPromoteToQueen,
    boardWidth,
    boardOrientation,
    clearArrows,
    currentPosition,
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
    isWaitingForAnimation,
    lastPieceColour,
    onArrowDrawEnd,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceDrop,
    onPromotionDialogOpen,
    onRightClickDown,
    onRightClickUp,
    onSquareClick,
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
      square,
      currentPosition,
      onPieceDrop,
      isWaitingForAnimation,
      lastPieceColour,
    ]
  );

  function handleDrop(item: { piece: Piece; square: Sq; id: number }) {
    if (
      Math.abs(item.square[0].charCodeAt(0) - square[0].charCodeAt(0)) <= 1 &&
      ((item.piece === "wP" && item.square[1] === "7" && square[1] === "8") ||
        (item.piece === "bP" && item.square[1] === "2" && square[1] === "1"))
    ) {
      if (autoPromoteToQueen) {
        handleSetPosition(item.square, square, square[1] === "8" ? "wQ" : "bQ");
      } else {
        const isValidPromotion = onPromotionDialogOpen(item.square, square);
        if (isValidPromotion) {
          setPromoteFromSquare(item.square);
          setPromoteToSquare(square);
          setShowPromoteDialog(true);
        }
      }
    } else {
      handleSetPosition(item.square, square, item.piece, true);
    }
  }

  useEffect(() => {
    if (squareRef.current) {
      const { x, y } = squareRef.current.getBoundingClientRect();
      setSquares((oldSquares) => ({ ...oldSquares, [square]: { x, y } }));
    }
  }, [boardWidth, boardOrientation]);

  const defaultSquareStyle = {
    ...borderRadius(square, boardOrientation, customBoardStyle),
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
      style={defaultSquareStyle}
      data-square-color={squareColor}
      data-square={square}
      onMouseOver={(e) => {
        // noop if moving from child of square into square.

        if (e.buttons === 2 && currentRightClickDown) {
          drawNewArrow(currentRightClickDown, square);
        }

        if (
          e.relatedTarget &&
          e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          return;
        }

        onMouseOverSquare(square);
      }}
      onMouseOut={(e) => {
        // noop if moving from square into a child of square.
        if (
          e.relatedTarget &&
          e.currentTarget.contains(e.relatedTarget as Node)
        )
          return;
        onMouseOutSquare(square);
      }}
      onMouseDown={(e) => {
        if (e.button === 2) onRightClickDown(square);
      }}
      onMouseUp={(e) => {
        if (e.button === 2) {
          if (currentRightClickDown)
            onArrowDrawEnd(currentRightClickDown, square);
          onRightClickUp(square);
        }
      }}
      onDragEnter={() => onDragOverSquare(square)}
      onClick={() => {
        onSquareClick(square);
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
            ...(!squareHasPremove && customSquareStyles?.[square]),
          }}
        >
          {children}
        </CustomSquare>
      ) : (
        <CustomSquare
          ref={squareRef}
          square={square}
          squareColor={squareColor}
          style={{
            ...size(boardWidth),
            ...center,
            ...(!squareHasPremove && customSquareStyles?.[square]),
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
