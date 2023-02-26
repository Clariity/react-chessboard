import React from "react";
import { useChessboard } from "../context/chessboard-context";

export const SelectPromotionDialog = ({
  onChange,
  popupCoords,
}: {
  onChange: any;
  popupCoords: any;
}) => {
  const promotionoptions = ["q", "r", "n", "b"];
  const {
    boardWidth,

    chessPieces,
    promotion: { color = "w" },
  } = useChessboard();
  console.log({ color });
  return (
    <div
      style={{
        position: "absolute",
        display: "grid",
        width: "100px",
        height: "100px",
        top: `${popupCoords.y}px`,
        left: `${popupCoords.x}px`,
        zIndex: 100,
        gridTemplateColumns: "1fr 1fr",
        transform: "translate(-50px, -50px)",
      }}
    >
      {promotionoptions.map((option) => (
        <div
          style={optionStyles(boardWidth)}
          key={option}
          onClick={() => onChange(option)}
        >
          <svg viewBox={"1 1 43 43"} width={boardWidth / 8} height={boardWidth / 8}>
            {/* @ts-ignore */}
            <g>{chessPieces[color + option.toUpperCase()]}</g>
          </svg>
        </div>
      ))}
    </div>
  );
};

const optionStyles = (width: number) => ({
  cursor: "pointer",
  height: width / 8,
  width: width / 8,
  background: "rgb(89 210 80 / 54%)",
});
