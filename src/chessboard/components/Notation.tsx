import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";

type NotationProps = {
  file: string;
  rank: string;
  row: number;
  col: number;
  numRows: number;
};

export function Notation({ file, rank, row, col, numRows }: NotationProps) {
  const {
    boardOrientation,
    boardWidth,
    customDarkSquareStyle,
    customLightSquareStyle,
    customNotationStyle,
  } = useChessboard();

  const whiteColor = customLightSquareStyle.backgroundColor;
  const blackColor = customDarkSquareStyle.backgroundColor;

  const isRow = col === 0;
  const isColumn = row === numRows - 1;
  const isBottomLeftSquare = isRow && isColumn;

  function renderBottomLeft() {
    return (
      <>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: whiteColor },
            ...numericStyle(boardWidth, customNotationStyle),
          }}
        >
          {rank}
        </div>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: whiteColor },
            ...alphaStyle(boardWidth, customNotationStyle),
          }}
        >
          {file}
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
          ...{ color: col % 2 !== 0 ? blackColor : whiteColor },
          ...alphaStyle(boardWidth, customNotationStyle),
        }}
      >
        {file}
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
          ...(boardOrientation === "black"
            ? { color: row % 2 === 0 ? blackColor : whiteColor }
            : { color: row % 2 === 0 ? blackColor : whiteColor }),
          ...numericStyle(boardWidth, customNotationStyle),
        }}
      >
        {rank}
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

const alphaStyle = (width: number, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-end",
  paddingLeft: width / 8 - width / 48,
  fontSize: width / 48,
  ...customNotationStyle
});

const numericStyle = (width: number, customNotationStyle?: Record<string, string | number>) => ({
  alignSelf: "flex-start",
  paddingRight: width / 8 - width / 48,
  fontSize: width / 48,
  ...customNotationStyle
});
