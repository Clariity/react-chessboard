import { useDroppable } from "@dnd-kit/core";

import { useChessboardContext } from "./ChessboardProvider";

type Props = {
  children?: React.ReactNode;
  id: string;
  isLightSquare: boolean;
  column: string;
  row: string;
};

export function Cell({ children, id, isLightSquare, column, row }: Props) {
  const {
    darkSquareColor,
    lightSquareColor,
    darkSquareNotationColor,
    lightSquareNotationColor,
    alphaNotationStyle,
    numericNotationStyle,
    showNotation,
  } = useChessboardContext();
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        aspectRatio: "1/1",
        backgroundColor: isLightSquare ? lightSquareColor : darkSquareColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        border: isOver ? "1px solid black" : "",
      }}
      data-column={column}
      data-row={row}
    >
      {showNotation ? (
        <span
          style={{
            color: isLightSquare ? lightSquareNotationColor : darkSquareNotationColor,
          }}
        >
          {row === "1" && <span style={numericNotationStyle}>{column}</span>}
          {column === "a" && <span style={alphaNotationStyle}>{row}</span>}
        </span>
      ) : null}

      {children}
    </div>
  );
}
