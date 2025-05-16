import type { StoryObj } from "@storybook/react";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

import { Chessboard } from "..";
import { ChessboardProvider } from "../ChessboardProvider";
import { SparePiece } from "../Piece";
import { DraggingPieceDataType, PieceType } from "../types";
import meta from "./Chessboard.stories";

type Story = StoryObj<typeof meta>;

export const SparePieces: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(
      new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true })
    );

    function onPieceDrop(
      sourceSquare: string,
      targetSquare: string,
      piece: DraggingPieceDataType
    ) {
      const color = piece.pieceType[0];
      const type = piece.pieceType[1].toLowerCase();

      // if the piece is not a spare piece, we need to remove it from it's original square
      if (!piece.isSparePiece) {
        chessGame.remove(sourceSquare as Square);
      }

      const success = chessGame.put(
        { color: color as Color, type: type as PieceSymbol },
        targetSquare as Square
      );

      if (!success) {
        alert(
          `The board already contains a ${color === "w" ? "white" : "black"} King piece`
        );
        return;
      }

      setChessGame(new Chess(chessGame.fen(), { skipValidation: true }));
    }

    const chessboardOptions = {
      position: chessGame.fen(),
      onPieceDrop,
    };

    return (
      <ChessboardProvider options={chessboardOptions}>
        <Chessboard />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            width: "fit-content",
          }}
        >
          {Object.values(PieceType).map((pieceType) => (
            <div
              key={pieceType}
              style={{
                width: "80px",
                height: "80px",
              }}
            >
              <SparePiece pieceType={pieceType} />
            </div>
          ))}
        </div>
      </ChessboardProvider>
    );
  },
};
