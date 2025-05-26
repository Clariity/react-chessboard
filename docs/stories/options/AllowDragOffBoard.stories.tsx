import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";
import type { PieceDropHandlerArgs } from "../../../src/types";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/AllowDragOffBoard",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowDragOffBoard: Story = {
  render: () => {
    const [allowDragOffBoard, setAllowDragOffBoard] = useState(true);
    const [position, setPosition] = useState(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    );

    const onPieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      // If targetSquare is null, the piece was dropped off the board
      if (!targetSquare) {
        // Remove the piece from the source square
        const newPosition = position
          .split(" ")[0]
          .split("/")
          .map((rank, rankIndex) => {
            if (rankIndex === 8 - parseInt(sourceSquare[1])) {
              return rank.replace(sourceSquare[0], "1");
            }
            return rank;
          })
          .join("/");
        setPosition(newPosition);
        return true;
      }
      return false;
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
              checked={allowDragOffBoard}
              onChange={(e) => setAllowDragOffBoard(e.target.checked)}
            />
            Allow dragging pieces off board
          </label>
        </div>

        <Chessboard
          options={{
            allowDragOffBoard,
            position,
            onPieceDrop,
          }}
        />

        <p style={{ fontSize: "0.8rem", color: "#666" }}>
          Try dragging a piece off the board when the option is enabled
        </p>
      </div>
    );
  },
};
