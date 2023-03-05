import { useState, ReactNode, CSSProperties } from "react";
import { useChessboard } from "../context/chessboard-context";
import { PromotionOption, CustomPieces } from "../types";

const PromotionOptionSquare = ({
  style,
  onClick,
  width,
  pieceIcon,
  option,
}: {
  style: CSSProperties;
  width: number;
  pieceIcon: CustomPieces | Record<string, ReactNode>;
  option: PromotionOption;
  onClick: (option: PromotionOption) => void;
}) => {
  const [hoverStyle, setStyleOnHoverEvent] = useState({
    ...style,
    backgroundColor: `${style.backgroundColor}50`,
    transition: "all 0.3s ease-out",
  });

  const handleMouseEnter = () => {
    setStyleOnHoverEvent({
      ...hoverStyle,
      transform: "scale(1.05)",
      backgroundColor: `${style.backgroundColor}`,
    });
  };
  const handleMouseLeave = () => {
    setStyleOnHoverEvent({
      ...hoverStyle,
      transform: "scale(1)",
      backgroundColor: `${style.backgroundColor}50`,
    });
  };

  return (
    <div
      style={hoverStyle}
      onClick={() => onClick(option)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox={"1 1 43 43"} width={width} height={width}>
        {/* @ts-ignore */}
        <g>{pieceIcon}</g>
      </svg>
    </div>
  );
};

export const SelectPromotionDialog = ({
  handlePromotion,
  popupCoords,
}: {
  handlePromotion: (piece: PromotionOption) => void;
  popupCoords: { x: number; y: number } | undefined;
}) => {
  const promotionOptions: PromotionOption[] = ["q", "r", "n", "b"];
  const {
    boardWidth,
    chessPieces,
    promotion: { piece },
    customDarkSquareStyle,
    customLightSquareStyle,
  } = useChessboard();

  return (
    <div
      style={{
        position: "absolute",
        display: "grid",
        width: boardWidth / 4,
        height: boardWidth / 4,
        top: `${popupCoords?.y}px`,
        left: `${popupCoords?.x}px`,
        zIndex: 100,
        gridTemplateColumns: "1fr 1fr",
        transform: `translate(${-boardWidth / 8}px, ${-boardWidth / 8}px)`,
      }}
    >
      {promotionOptions.map((option, i) => {
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
            //  @ts-ignore
            pieceIcon={chessPieces[piece[0] + option.toUpperCase()]}
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
  boxShadow: "2px 2px 10px 0px rgba(34, 60, 80, 0.2)",
});
