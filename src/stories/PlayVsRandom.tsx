import type { StoryObj } from "@storybook/react";
import { Chess } from "chess.js";
import { useState, useRef, useEffect } from "react";

import { Chessboard } from "..";
import meta from "./Chessboard.stories";
import { PieceDropHandlerArgs } from "../types";

type Story = StoryObj<typeof meta>;

export const PlayVsRandom: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(new Chess());
    const chessGameRef = useRef(chessGame);

    useEffect(() => {
      chessGameRef.current = chessGame;
    }, [chessGame]);

    function makeRandomMove() {
      const possibleMoves = chessGameRef.current.moves();

      // exit if the game is over
      if (chessGameRef.current.isGameOver()) {
        return;
      }

      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      chessGameRef.current.move(randomMove);
      setChessGame(new Chess(chessGameRef.current.fen()));
    }

    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      try {
        chessGameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // always promote to a queen for example simplicity
        });

        setChessGame(new Chess(chessGameRef.current.fen()));

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        return true;
      } catch {
        // illegal move
        return false;
      }
    }

    const chessboardOptions = {
      position: chessGame.fen(),
      onPieceDrop,
    };

    return <Chessboard options={chessboardOptions} />;
  },
};
