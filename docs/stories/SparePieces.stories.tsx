import type { Meta, StoryObj } from '@storybook/react';
import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import { useEffect, useState } from 'react';

import defaultMeta from './Default.stories';
import { Chessboard } from '../../src';
import { ChessboardProvider } from '../../src/ChessboardProvider';
import { SparePiece } from '../../src/';
import { PieceDropHandlerArgs, PieceType } from '../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/SparePieces',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SparePieces: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(
      new Chess('8/8/8/8/8/8/8/8 w - - 0 1', { skipValidation: true }),
    );
    const [squareWidth, setSquareWidth] = useState<number | null>(null);

    // get the width of a square to use for the spare piece sizes
    useEffect(() => {
      const square = document
        .querySelector(`[data-column="a"][data-row="1"]`)
        ?.getBoundingClientRect();
      setSquareWidth(square?.width ?? null);
    }, []);

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece,
    }: PieceDropHandlerArgs) {
      const color = piece.pieceType[0];
      const type = piece.pieceType[1].toLowerCase();

      // if the piece is dropped off the board, we need to remove it from the board
      if (!targetSquare) {
        chessGame.remove(sourceSquare as Square);
        setChessGame(new Chess(chessGame.fen(), { skipValidation: true }));

        // successful drop off board
        return true;
      }

      // if the piece is not a spare piece, we need to remove it from it's original square
      if (!piece.isSparePiece) {
        chessGame.remove(sourceSquare as Square);
      }

      // try to place the piece on the board
      const success = chessGame.put(
        { color: color as Color, type: type as PieceSymbol },
        targetSquare as Square,
      );

      // show error message if cannot place another king
      if (!success) {
        alert(
          `The board already contains a ${color === 'w' ? 'white' : 'black'} King piece`,
        );
        return false;
      }

      // update the game state and return true if successful
      setChessGame(new Chess(chessGame.fen(), { skipValidation: true }));
      return true;
    }

    // get the piece types for the black and white spare pieces
    const blackPieceTypes: PieceType[] = [];
    const whitePieceTypes: PieceType[] = [];
    for (const pieceType of Object.values(PieceType)) {
      if (pieceType[0] === 'b') {
        blackPieceTypes.push(pieceType);
      } else {
        whitePieceTypes.push(pieceType);
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessGame.fen(),
      onPieceDrop,
    };

    // render the chessboard and spare pieces
    return (
      <ChessboardProvider options={chessboardOptions}>
        {squareWidth ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            {blackPieceTypes.map((pieceType) => (
              <div
                key={pieceType}
                style={{
                  width: `${squareWidth}px`,
                  height: `${squareWidth}px`,
                }}
              >
                <SparePiece pieceType={pieceType} />
              </div>
            ))}
          </div>
        ) : null}

        <Chessboard />

        {squareWidth ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            {whitePieceTypes.map((pieceType) => (
              <div
                key={pieceType}
                style={{
                  width: `${squareWidth}px`,
                  height: `${squareWidth}px`,
                }}
              >
                <SparePiece pieceType={pieceType} />
              </div>
            ))}
          </div>
        ) : null}
      </ChessboardProvider>
    );
  },
};
