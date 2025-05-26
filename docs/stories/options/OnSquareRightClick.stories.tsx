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

export const OnSquareRightClick: Story = {
  render: () => {
    const [rightClickedSquare, setRightClickedSquare] = useState<string | null>(null);
    const [rightClickedPiece, setRightClickedPiece] = useState<string | null>(null);

    const onSquareRightClick = ({ square, piece }: SquareHandlerArgs) => {
      setRightClickedSquare(square);
      setRightClickedPiece(piece?.pieceType || null);
    };

    const chessboardOptions = {
      onSquareRightClick,
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
          <div>Right-clicked square: {rightClickedSquare || "None"}</div>
          <div>Piece in right-clicked square: {rightClickedPiece || "None"}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: "0.8rem", color: "#666" }}>
          Right-click on squares to see the right-click events in action
        </p>
      </div>
    );
  },
};
