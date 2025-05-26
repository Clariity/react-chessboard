import type { StoryObj } from "@storybook/react";
import { Chess } from "chess.js";
import { useState } from "react";

import { Chessboard } from "../../src";
import meta from "./Default.stories";
import { PieceDropHandlerArgs } from "../../src/types";

type Story = StoryObj<typeof meta>;

export const BoardOrientation: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(new Chess());
    const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");

    function makeRandomMove() {
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      chessGame.move(randomMove);
      setChessGame(new Chess(chessGame.fen()));
    }

    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // always promote to a queen for example simplicity
        });

        setChessGame(new Chess(chessGame.fen()));

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 200);
      } catch {
        // illegal move
      }
    }

    const chessboardOptions = {
      boardOrientation,
      position: chessGame.fen(),
      onPieceDrop,
    };

    return (
      <>
        <Chessboard options={chessboardOptions} />

        <button
          onClick={() =>
            setBoardOrientation((prev) => (prev === "white" ? "black" : "white"))
          }
        >
          Switch board orientation to {boardOrientation === "white" ? "black" : "white"}
        </button>
      </>
    );
  },
};
