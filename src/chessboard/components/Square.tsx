import { CSSProperties, ReactNode, useEffect, useRef } from "react";
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
    boardWidth,
    boardOrientation,
    clearArrows,
    currentPosition,
    customBoardStyle,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customPremoveDarkSquareStyle,
    customPremoveLightSquareStyle,
    customSquare: CustomSquare,
    customSquareStyles,
    handleSetPosition,
    lastPieceColour,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceDrop,
    onRightClickDown,
    onRightClickUp,
    onSquareClick,
    isWaitingForAnimation,
    currentRightClickDown,
    drawNewArrow,
    onArrowDrawEnd,
  } = useChessboard();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "piece",
      drop: (item: { piece: Piece; square: Sq; id: number }) =>
        handleSetPosition(item.square, square, item.piece),
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
  customBoardStyle?: CSSProperties
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
