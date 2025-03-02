import { useChessboard } from "../context/chessboard-context";

type NotationProps = {
  file: string;
  rank: string;
  showNumbers: boolean;
  showLetters: boolean;
  squareColor: "white" | "black";
};

export function Notation({ file, rank, showNumbers, showLetters, squareColor }: NotationProps) {
  const {
    boardWidth,
    customDarkSquareStyle,
    customLightSquareStyle,
    customNotationStyle,
  } = useChessboard();

  const whiteColor = customLightSquareStyle.backgroundColor;
  const blackColor = customDarkSquareStyle.backgroundColor;

  const isBottomLeftSquare = showNumbers && showLetters;

  function renderBottomLeft() {
    return (
      <>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: squareColor === "white" ? blackColor : whiteColor },
            ...numericStyle(boardWidth, customNotationStyle),
          }}
        >
          {rank}
        </div>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: squareColor === "white" ? blackColor : whiteColor },
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
          ...{ color: squareColor === "white" ? blackColor : whiteColor },
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
          ...{ color: squareColor === "white" ? blackColor : whiteColor },
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

  if (showLetters) {
    return renderLetters();
  }

  if (showNumbers) {
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
