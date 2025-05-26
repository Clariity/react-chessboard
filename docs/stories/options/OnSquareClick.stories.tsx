import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";
import type { SquareHandlerArgs } from "../../../src/types";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/SquareClick",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnSquareClick: Story = {
  render: () => {
    const [clickedSquare, setClickedSquare] = useState<string | null>(null);
    const [clickedPiece, setClickedPiece] = useState<string | null>(null);

    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
      setClickedSquare(square);
      setClickedPiece(piece?.pieceType || null);
    };

    const chessboardOptions = {
      onSquareClick,
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
          <div>Clicked square: {clickedSquare || "None"}</div>
          <div>Piece in clicked square: {clickedPiece || "None"}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: "0.8rem", color: "#666" }}>
          Click on squares to see the click events in action
        </p>
      </div>
    );
  },
};
