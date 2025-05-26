import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/Position",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Position: Story = {
  render: () => {
    const [showAnimations, setShowAnimations] = useState(true);
    const [position, setPosition] = useState(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    );

    function generateRandomFen() {
      const pieces = ["r", "n", "b", "q", "k", "p", "R", "N", "B", "Q", "K", "P"];
      let fen = "";

      for (let i = 0; i < 8; i++) {
        let emptyCount = 0;

        for (let j = 0; j < 8; j++) {
          if (Math.random() < 0.2) {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }

            fen += pieces[Math.floor(Math.random() * pieces.length)];
          } else {
            emptyCount++;
          }
        }

        if (emptyCount > 0) {
          fen += emptyCount;
        }

        if (i < 7) {
          fen += "/";
        }
      }

      setPosition(fen);
    }

    const chessboardOptions = {
      position,
      showAnimations,
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
        <button onClick={generateRandomFen}>Generate random FEN position</button>
        <label>
          <input
            type="checkbox"
            checked={showAnimations}
            onChange={() => setShowAnimations(!showAnimations)}
          />
          Show animations
        </label>
        <p>{position}</p>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: "0.8rem", color: "#666" }}>
          Click on the button to generate a random FEN position
        </p>
      </div>
    );
  },
};
