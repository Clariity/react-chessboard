import { useState, ReactNode } from "react";

import { useChessboard } from "../context/chessboard-context";
import { CustomPieceFn, PromotionPieceOption } from "../types";

type Props = {
  option: PromotionPieceOption;
};

export function PromotionOption({ option }: Props) {
  const [isHover, setIsHover] = useState(false);

  const {
    boardWidth,
    chessPieces,
    customDarkSquareStyle,
    customLightSquareStyle,
    handleSetPosition,
    onPromotionPieceSelect,
    promoteFromSquare,
    promoteToSquare,
    promotionDialogVariant,
  } = useChessboard();

  const backgroundColor = () => {
    switch (option[1]) {
      case "Q":
        return customDarkSquareStyle.backgroundColor;
      case "R":
        return customLightSquareStyle.backgroundColor;
      case "N":
        return promotionDialogVariant === "default"
          ? customLightSquareStyle.backgroundColor
          : customDarkSquareStyle.backgroundColor;
      case "B":
        return promotionDialogVariant === "default"
          ? customDarkSquareStyle.backgroundColor
          : customLightSquareStyle.backgroundColor;
    }
  };

  return (
    <div
      onClick={() => {
        onPromotionPieceSelect?.length
          ? onPromotionPieceSelect(option)
          : handleSetPosition(
              promoteFromSquare!,
              promoteToSquare!,
              option,
              true
            );
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      data-piece={option}
      style={{
        cursor: "pointer",
        backgroundColor: isHover ? backgroundColor() : `${backgroundColor()}aa`,
        borderRadius: "4px",
        transition: "all 0.1s ease-out",
      }}
    >
      {typeof chessPieces[option] === "function" ? (
        <div
          style={{
            transition: "all 0.1s ease-out",
            transform: isHover ? "scale(1)" : "scale(0.85)",
          }}
        >
          {(chessPieces[option] as CustomPieceFn)({
            squareWidth: boardWidth / 8,
            isDragging: false,
          })}
        </div>
      ) : (
        <svg
          viewBox={"1 1 43 43"}
          width={boardWidth / 8}
          height={boardWidth / 8}
          style={{
            transition: "all 0.1s ease-out",
            transform: isHover ? "scale(1)" : "scale(0.85)",
          }}
        >
          <g>{chessPieces[option] as ReactNode}</g>
        </svg>
      )}
    </div>
  );
}
