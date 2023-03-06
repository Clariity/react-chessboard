import React, { useState, ReactNode, CSSProperties } from "react";
import { useChessboard } from "../context/chessboard-context";
import { PromotionOption, CustomPieceFn, Piece } from "../types";

const PromotionOptionSquare = ({
  style,
  onClick,
  width,
  pieceIcon,
  option,
}: {
  style: CSSProperties;
  width: number;
  pieceIcon: CustomPieceFn | ReactNode;
  option: PromotionOption;
  onClick: (option: PromotionOption) => void;
}) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  let SquareContent;
  if (typeof pieceIcon === "function") {
    const CustomIcon = pieceIcon({ squareWidth: width * 0.8, isDragging: false });

    SquareContent = React.cloneElement(CustomIcon, {
      style: {
        ...CustomIcon.props.style,
        transition: "all 0.3s ease-out",
        transform: isHover ? "scale(1.2)" : "scale(1)",
      },
    });
  } else {
    SquareContent = (
      <svg
        style={{
          transition: "all 0.3s ease-out",
          transform: isHover ? "scale(1.2)" : "scale(1)",
        }}
        viewBox={"1 1 43 43"}
        width={width * 0.8}
        height={width * 0.8}
      >
        <g>{pieceIcon}</g>
      </svg>
    );
  }

  return (
    <div
      style={{
        ...style,
        backgroundColor: isHover ? style.backgroundColor : `${style.backgroundColor}aa`,
      }}
      onClick={() => onClick(option)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {SquareContent}
    </div>
  );
};

export const SelectPromotionDialog = ({
  handlePromotion,
  popupCoords,
  style,
}: {
  handlePromotion: (piece: PromotionOption) => void;
  popupCoords: { x: number; y: number } | undefined;
  style: CSSProperties;
}) => {
  const promotionOptions: Array<{
    option: PromotionOption;
    getOptionPiece: (color: "w" | "b") => Piece;
  }> = [
    { option: "q", getOptionPiece: (color) => `${color}Q` },
    { option: "r", getOptionPiece: (color) => `${color}R` },
    { option: "n", getOptionPiece: (color) => `${color}N` },
    { option: "b", getOptionPiece: (color) => `${color}B` },
  ];

  const {
    boardWidth,
    chessPieces,
    promotion: { piece },
    customDarkSquareStyle,
    customLightSquareStyle,
  } = useChessboard();

  const pieceColor = piece?.[0] as "b" | "w";

  return (
    <div
      style={{
        ...style,
        position: "absolute",
        display: "grid",
        width: boardWidth / 4,
        height: boardWidth / 4,
        top: `${popupCoords?.y}px`,
        left: `${popupCoords?.x}px`,
        zIndex: 100,
        gridTemplateColumns: "1fr 1fr",
        transform: `translate(${-boardWidth / 8}px, ${-boardWidth / 8}px) ${
          style.transform
        }`,
      }}
      title="Choose promotion piece"
    >
      {promotionOptions.map(({ option, getOptionPiece }, i) => {
        const { backgroundColor } =
          i === 0 || i === 3 ? customDarkSquareStyle : customLightSquareStyle;

        return (
          <PromotionOptionSquare
            style={{
              ...optionStyles(boardWidth),
              backgroundColor,
            }}
            key={option}
            option={option}
            width={boardWidth / 8}
            onClick={() => handlePromotion(option)}
            pieceIcon={chessPieces[getOptionPiece(pieceColor)]}
          />
        );
      })}
    </div>
  );
};

const optionStyles = (width: number) => ({
  cursor: "pointer",
  height: width / 8,
  width: width / 8,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease-out",
  borderRadius: "4px",
});
