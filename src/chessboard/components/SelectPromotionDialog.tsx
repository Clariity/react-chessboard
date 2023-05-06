import React, { useState, ReactNode, CSSProperties } from "react";
import { useChessboard } from "../context/chessboard-context";
import { PromotionOption, CustomPieceFn, Piece, PromotionStyle } from "../types";
import {
  DEFAULT_PROMOTION_STYLE,
  LICHESS_PROMOTION_STYLE,
  MODAL_PROMOTION_STYLE,
} from "../consts";

const PromotionOptionSquare = ({
  style,
  onClick,
  width,
  pieceIcon,
  option,
  promotionDialogStyle = DEFAULT_PROMOTION_STYLE,
}: {
  style: CSSProperties;
  width: number;
  pieceIcon: CustomPieceFn | ReactNode;
  option: PromotionOption;
  onClick: (option: PromotionOption) => void;
  promotionDialogStyle: PromotionStyle;
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
        ...mapVariantToOptionSquareStyle?.[promotionDialogStyle]?.(isHover),
      }}
      onClick={() => onClick(option)}
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {SquareContent}
    </div>
  );
};

export const SelectPromotionDialog = ({
  handlePromotion,
  dialogCoords,
  style,
}: {
  handlePromotion: (piece: PromotionOption) => void;
  dialogCoords: { x: number; y: number } | undefined;
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
    promotion: { piece, promotionDialogStyle = DEFAULT_PROMOTION_STYLE },
    customDarkSquareStyle,
    customLightSquareStyle,
  } = useChessboard();

  const pieceColor = piece?.[0] as "b" | "w";

  return (
    <div
      style={dialogStyles(boardWidth, dialogCoords, style, promotionDialogStyle)}
      title="Choose promotion piece"
    >
      {promotionOptions.map(({ option, getOptionPiece }, i) => {
        const { backgroundColor } =
          promotionDialogStyle === DEFAULT_PROMOTION_STYLE
            ? i === 0 || i === 3
              ? customDarkSquareStyle
              : customLightSquareStyle
            : { backgroundColor: "auto" };

        return (
          <PromotionOptionSquare
            style={{
              ...optionStyles(boardWidth),
              backgroundColor,
            }}
            promotionDialogStyle={promotionDialogStyle}
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

const mapVariantToDialogStyle = {
  [DEFAULT_PROMOTION_STYLE]: (width: number, userCustomStyles: CSSProperties) => ({
    ...userCustomStyles,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    transform: `translate(${-width / 8}px, ${-width / 8}px) ${
      userCustomStyles.transform ?? ""
    }`,
  }),
  [LICHESS_PROMOTION_STYLE]: (width: number, userCustomStyles: CSSProperties) => ({
    ...userCustomStyles,
    transform: `translate(${-width / 16}px, ${-width / 16}px) ${
      userCustomStyles.transform ?? ""
    }`,
  }),
  [MODAL_PROMOTION_STYLE]: (width: number, userCustomStyles: CSSProperties) => ({
    ...userCustomStyles,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: `translate(0px, ${(3 * width) / 8}px) ${userCustomStyles.transform ?? ""}`,
    width: "100%",
    height: `${width / 4}px`,
    top: 0,
    backgroundColor: "white",
    left: 0,
  }),
};

const dialogStyles = (
  boardWidth: number,
  dialogCoords: { x: number; y: number } | undefined,
  userCustomStyles: CSSProperties,
  variant: PromotionStyle
): CSSProperties => ({
  position: "absolute",
  top: `${dialogCoords?.y}px`,
  left: `${dialogCoords?.x}px`,
  zIndex: 1000,
  ...mapVariantToDialogStyle[variant ?? "grid"](boardWidth, userCustomStyles),
});

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

const mapVariantToOptionSquareStyle = {
  [DEFAULT_PROMOTION_STYLE]: () => {},
  [MODAL_PROMOTION_STYLE]: () => {},
  [LICHESS_PROMOTION_STYLE]: (isOnHover: boolean): CSSProperties =>
    isOnHover
      ? { boxShadow: "inset 0 0 48px 8px #d64f00", borderRadius: "0%" }
      : {
          borderRadius: "50%",
          backgroundColor: "#b0b0b0",
          boxShadow: "inset 0 0 25px 3px grey",
        },
};
