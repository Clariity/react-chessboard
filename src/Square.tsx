import { useDroppable } from "@dnd-kit/core";

import { useChessboardContext } from "./ChessboardProvider";
import {
  defaultAlphaNotationStyle,
  defaultDarkSquareNotationStyle,
  defaultDarkSquareStyle,
  defaultDropSquareStyle,
  defaultLightSquareNotationStyle,
  defaultLightSquareStyle,
  defaultNumericNotationStyle,
  defaultSquareStyle,
} from "./styles";
import { SquareDataType } from "./types";
import { columnIndexToChessColumn } from "./utils";

type Props = {
  children?: React.ReactNode;
  squareId: SquareDataType["squareId"];
  isLightSquare: SquareDataType["isLightSquare"];
};

export function Square({ children, squareId, isLightSquare }: Props) {
  const {
    boardOrientation,
    chessboardColumns,
    chessboardRows,
    currentPosition,
    squareStyle,
    darkSquareStyle,
    lightSquareStyle,
    dropSquareStyle,
    darkSquareNotationStyle,
    lightSquareNotationStyle,
    alphaNotationStyle,
    numericNotationStyle,
    showNotation,
    onMouseOutSquare,
    onMouseOverSquare,
    onSquareClick,
    onSquareRightClick,
  } = useChessboardContext();

  const { isOver, setNodeRef } = useDroppable({
    id: squareId,
  });

  const column = squareId.match(/^[a-z]+/)?.[0];
  const row = squareId.match(/\d+$/)?.[0];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...defaultSquareStyle,
        ...squareStyle,
        ...(isLightSquare
          ? { ...defaultLightSquareStyle, ...lightSquareStyle }
          : { ...defaultDarkSquareStyle, ...darkSquareStyle }),
        ...(isOver ? { ...defaultDropSquareStyle, ...dropSquareStyle } : {}),
      }}
      data-column={column}
      data-row={row}
      onClick={(e) => {
        if (e.button === 0) {
          onSquareClick?.({ piece: currentPosition[squareId] ?? null, square: squareId });
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onSquareRightClick?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        });
      }}
      onMouseOver={() =>
        onMouseOverSquare?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        })
      }
      onMouseLeave={() =>
        onMouseOutSquare?.({ piece: currentPosition[squareId] ?? null, square: squareId })
      }
    >
      {showNotation ? (
        <span
          style={
            isLightSquare
              ? { ...defaultLightSquareNotationStyle, ...lightSquareNotationStyle }
              : { ...defaultDarkSquareNotationStyle, ...darkSquareNotationStyle }
          }
        >
          {row === (boardOrientation === "white" ? "1" : chessboardRows.toString()) && (
            <span style={{ ...defaultAlphaNotationStyle, ...alphaNotationStyle }}>
              {column}
            </span>
          )}
          {column ===
            (boardOrientation === "white"
              ? "a"
              : columnIndexToChessColumn(0, chessboardColumns, boardOrientation)) && (
            <span style={{ ...defaultNumericNotationStyle, ...numericNotationStyle }}>
              {row}
            </span>
          )}
        </span>
      ) : null}

      {children}
    </div>
  );
}
