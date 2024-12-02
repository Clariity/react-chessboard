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

  const boardHeight = (boardWidth * boardDimensions.rows) / boardDimensions.columns;

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
    console.log("bottom left: ", getRow(), getColumn());
    return (
      <>
        <div
          style={{
            userSelect: "none",
            zIndex: 3,
            position: "absolute",
            ...{ color: ((boardOrientation === "white") ? whiteColor : ((boardDimensions.rows % 2 === 0) === (boardDimensions.columns % 2 === 0)) ? whiteColor : blackColor) },
            ...numericStyle(boardWidth, boardHeight, boardDimensions, customNotationStyle),
          }}
        >
          {getRow()}
        </div>
        <div
          style={{
            userSelect: "none",
            zIndex: 3,
            position: "absolute",
            ...{ color: ((boardOrientation === "white") ? whiteColor : ((boardDimensions.rows % 2 === 0) === (boardDimensions.columns % 2 === 0)) ? whiteColor : blackColor) },
            ...alphaStyle(boardWidth, boardHeight, boardDimensions, customNotationStyle),
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
          ...{ color: boardOrientation === "white" ? ((col % 2 === 0) ? whiteColor : blackColor) : ((col % 2 !== 0) === (boardDimensions.rows % 2 === 0) === (boardDimensions.columns % 2 === 0) ? blackColor : whiteColor) },
          ...alphaStyle(boardWidth, boardHeight, boardDimensions, customNotationStyle),
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
          ...({ color: boardOrientation === "white" ? ((row % 2 === 0) === (boardDimensions.rows % 2 !== 0) ? whiteColor : blackColor) : ((row % 2 === 0) === (boardDimensions.columns % 2 !== 0) ? whiteColor : blackColor) }),
          ...numericStyle(boardWidth, boardHeight, boardDimensions, customNotationStyle),
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

const alphaStyle = (width: number, height: number, boardDimensions: BoardDimensions, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-end",
  paddingLeft: Math.max(width, height) / Math.max(boardDimensions.rows, boardDimensions.columns) - Math.max(width, height) / 48,
  fontSize: Math.max(width, height) / 48,
  ...customNotationStyle
});

const numericStyle = (width: number, height: number, boardDimensions: BoardDimensions, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-start",
  paddingRight: Math.max(width, height) / Math.max(boardDimensions.rows, boardDimensions.columns) - Math.max(width, height) / 48,
  fontSize: Math.max(width, height) / 48,
  ...customNotationStyle
});
