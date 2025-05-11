import type { StoryObj } from "@storybook/react";

import { Chessboard } from "..";
import meta from "./Chessboard.stories";
import { useState } from "react";

type Story = StoryObj<typeof meta>;

export const Position: Story = {
  render: () => {
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
    };

    return (
      <>
        <button onClick={generateRandomFen}>Generate random FEN position</button>
        <p>{position}</p>
        <Chessboard options={chessboardOptions} />
      </>
    );
  },
};
