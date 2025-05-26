import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/SquareColors",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareColors: Story = {
  render: () => {
    const [darkSquareColor, setDarkSquareColor] = useState("#B58863");
    const [lightSquareColor, setLightSquareColor] = useState("#F0D9B5");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            Dark square color:
            <input
              type="color"
              value={darkSquareColor}
              onChange={(e) => setDarkSquareColor(e.target.value)}
            />
            {darkSquareColor}
          </label>
          <label>
            Light square color:
            <input
              type="color"
              value={lightSquareColor}
              onChange={(e) => setLightSquareColor(e.target.value)}
            />
            {lightSquareColor}
          </label>
        </div>
        <Chessboard
          options={{
            darkSquareStyle: {
              backgroundColor: darkSquareColor,
            },
            lightSquareStyle: {
              backgroundColor: lightSquareColor,
            },
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Customize the colors of the dark and light squares
        </div>
      </div>
    );
  },
};
