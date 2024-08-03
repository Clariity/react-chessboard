import React, { useState } from "react";
import { ComponentMeta } from "@storybook/react";
import Chess from "chess.js";
import { Chessboard } from "../chessboard";

const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};

export default {
  title: "Example/Chessboard",
  component: Chessboard,
} as ComponentMeta<typeof Chessboard>;

export const BoardWithCustomArrows = () => {
  const colorVariants = [
    "darkred",
    "#48AD7E",
    "rgb(245, 192, 0)",
    "#093A3E",
    "#F75590",
    "#F3752B",
    "#058ED9",
  ];
  const [activeColor, setActiveColor] = useState(colorVariants[0]);
  return (
    <div style={boardWrapper}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>Choose arrow color</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {colorVariants.map((color) => (
            <div
              style={{
                width: "24px",
                height: "24px",
                background: color,
                borderRadius: "50%",
                cursor: "pointer",
                margin: "16px 6px",
                transform: color === activeColor ? "scale(1.5)" : "none",
                transition: "all 0.15s ease-in",
              }}
              onClick={() => setActiveColor(color)}
            />
          ))}
        </div>
      </div>
      <Chessboard
        id="BoardWithCustomArrows"
        customArrows={[
          ["a2", "a3", colorVariants[0]],
          ["b2", "b4", colorVariants[1]],
          ["c2", "c5", colorVariants[2]],
        ]}
        customArrowColor={activeColor}
        onArrowsChange={console.log}
      />
    </div>
  );
};
