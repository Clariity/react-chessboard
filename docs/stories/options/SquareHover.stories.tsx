import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";
import type { SquareHandlerArgs } from "../../../src/types";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/SquareHover",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareHover: Story = {
  render: () => {
    const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
    const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

    const onMouseOverSquare = ({ square, piece }: SquareHandlerArgs) => {
      setHoveredSquare(square);
      setHoveredPiece(piece?.pieceType || null);
    };

    const onMouseOutSquare = () => {
      setHoveredSquare(null);
      setHoveredPiece(null);
    };

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
          <div>Hovered square: {hoveredSquare || "None"}</div>
          <div>Hovered piece: {hoveredPiece || "None"}</div>
        </div>
        <Chessboard
          options={{
            onMouseOverSquare,
            onMouseOutSquare,
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Hover over squares to see the hover events in action
        </div>
      </div>
    );
  },
};
