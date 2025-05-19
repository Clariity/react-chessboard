import { useDroppable } from "@dnd-kit/core";

import { useChessboardContext } from "./ChessboardProvider";
import { CellDataType } from "./types";
import { columnIndexToChessColumn } from "./utils";

type Props = {
  children?: React.ReactNode;
  cellId: CellDataType["cellId"];
  isLightSquare: CellDataType["isLightSquare"];
};

export function Cell({ children, cellId, isLightSquare }: Props) {
  const {
    boardOrientation,
    chessboardColumns,
    chessboardRows,
    squareStyle,
    darkSquareStyle,
    lightSquareStyle,
    dropSquareStyle,
    darkSquareNotationStyle,
    lightSquareNotationStyle,
    alphaNotationStyle,
    numericNotationStyle,
    showNotation,
  } = useChessboardContext();

  const { isOver, setNodeRef } = useDroppable({
    id: cellId,
  });

  const column = cellId.match(/^[a-z]+/)?.[0];
  const row = cellId.match(/\d+$/)?.[0];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...squareStyle,
        ...(isLightSquare ? lightSquareStyle : darkSquareStyle),
        ...(isOver ? dropSquareStyle : {}),
      }}
      data-column={column}
      data-row={row}
    >
      {showNotation ? (
        <span style={isLightSquare ? lightSquareNotationStyle : darkSquareNotationStyle}>
          {row === (boardOrientation === "white" ? "1" : chessboardRows.toString()) && (
            <span style={numericNotationStyle}>{column}</span>
          )}
          {column ===
            (boardOrientation === "white"
              ? "a"
              : columnIndexToChessColumn(0, chessboardColumns, boardOrientation)) && (
            <span style={alphaNotationStyle}>{row}</span>
          )}
        </span>
      ) : null}

      {children}
    </div>
  );
}
