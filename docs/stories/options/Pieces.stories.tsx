import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";
import type { PieceRenderObject } from "../../../src/types";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/Pieces",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pieces: Story = {
  render: () => {
    const [useCustomPieces, setUseCustomPieces] = useState(false);

    // Example of custom piece renderers
    const customPieces: PieceRenderObject = {
      wP: () => <div style={{ color: "white", fontSize: "2rem" }}>♟</div>,
      wN: () => <div style={{ color: "white", fontSize: "2rem" }}>♞</div>,
      wB: () => <div style={{ color: "white", fontSize: "2rem" }}>♝</div>,
      wR: () => <div style={{ color: "white", fontSize: "2rem" }}>♜</div>,
      wQ: () => <div style={{ color: "white", fontSize: "2rem" }}>♛</div>,
      wK: () => <div style={{ color: "white", fontSize: "2rem" }}>♚</div>,
      bP: () => <div style={{ color: "black", fontSize: "2rem" }}>♟</div>,
      bN: () => <div style={{ color: "black", fontSize: "2rem" }}>♞</div>,
      bB: () => <div style={{ color: "black", fontSize: "2rem" }}>♝</div>,
      bR: () => <div style={{ color: "black", fontSize: "2rem" }}>♜</div>,
      bQ: () => <div style={{ color: "black", fontSize: "2rem" }}>♛</div>,
      bK: () => <div style={{ color: "black", fontSize: "2rem" }}>♚</div>,
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
        <div>
          <label>
            <input
              type="checkbox"
              checked={useCustomPieces}
              onChange={(e) => setUseCustomPieces(e.target.checked)}
            />
            Use custom pieces
          </label>
        </div>
        <Chessboard
          options={{
            pieces: useCustomPieces ? customPieces : undefined,
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Toggle the checkbox to switch between default and custom piece renderers
        </div>
      </div>
    );
  },
};
