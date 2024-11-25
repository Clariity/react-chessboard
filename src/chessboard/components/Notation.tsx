import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";
import { BoardDimensions } from "../types";

type NotationProps = {
  row: number;
  col: number;
};

export function Notation({ row, col }: NotationProps) {
  const {
    boardDimensions,
    boardOrientation,
    boardWidth,
    customDarkSquareStyle,
    customLightSquareStyle,
    customNotationStyle,
  } = useChessboard();

  const whiteColor = customLightSquareStyle.backgroundColor;
  const blackColor = customDarkSquareStyle.backgroundColor;

  const isRow = col === 0;
  const isColumn = row === (boardDimensions.rows - 1);
  const isBottomLeftSquare = isRow && isColumn;

  function getRow() {
    return boardOrientation === "white" ? boardDimensions.rows - row : row + 1;
  }

  function getColumn() {
    return boardOrientation === "black" ? COLUMNS[(boardDimensions.columns - 1) - col] : COLUMNS[col];
  }

  function renderBottomLeft() {
    return (
      <>
        <div
          style={{
            userSelect: "none",
            zIndex: 3,
            position: "absolute",
            ...{ color: whiteColor },
            ...numericStyle(boardWidth, boardDimensions, customNotationStyle),
          }}
        >
          {getRow()}
        </div>
        <div
          style={{
            userSelect: "none",
            zIndex: 3,
            position: "absolute",
            ...{ color: whiteColor },
            ...alphaStyle(boardWidth, boardDimensions, customNotationStyle),
          }}
        >
          {getColumn()}
        </div>
      </>
    );
  }

  function renderLetters() {
    return (
      <div
        style={{
          userSelect: "none",
          zIndex: 3,
          position: "absolute",
          ...{ color: (col % 2 !== 0) ? blackColor : whiteColor },
          ...alphaStyle(boardWidth, boardDimensions, customNotationStyle),
        }}
      >
        {getColumn()}
      </div>
    );
  }

  function renderNumbers() {
    return (
      <div
        style={{
          userSelect: "none",
          zIndex: 3,
          position: "absolute",
          ...({ color: (row % 2 === 0) === (boardDimensions.columns % 2 === 0) ? blackColor : whiteColor }),
          ...numericStyle(boardWidth, boardDimensions, customNotationStyle),
        }}
      >
        {getRow()}
      </div>
    );
  }

  if (isBottomLeftSquare) {
    return renderBottomLeft();
  }

  if (isColumn) {
    return renderLetters();
  }

  if (isRow) {
    return renderNumbers();
  }

  return null;
}

const alphaStyle = (width: number, boardDimensions: BoardDimensions, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-end",
  paddingLeft: width / Math.max(boardDimensions.rows, boardDimensions.columns) - width / 48,
  fontSize: width / 48,
  ...customNotationStyle
});

const numericStyle = (width: number, boardDimensions: BoardDimensions, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-start",
  paddingRight: width / Math.max(boardDimensions.rows, boardDimensions.columns) - width / 48,
  fontSize: width / 48,
  ...customNotationStyle
});
