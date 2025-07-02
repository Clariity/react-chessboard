import type { Meta, StoryObj } from '@storybook/react';
import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import { useEffect, useRef, useState } from 'react';

import defaultMeta from './Default.stories';
import {
  Chessboard,
  ChessboardProvider,
  defaultPieces,
  PieceDropHandlerArgs,
  SparePiece,
} from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/SparePieces',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SparePieces: Story = {
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(
      new Chess('8/8/8/8/8/8/8/8 w - - 0 1', { skipValidation: true }),
    );
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
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
        setChessPosition(chessGame.fen());

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
      setChessPosition(chessGame.fen());
      return true;
    }

    // get the piece types for the black and white spare pieces
    const blackPieceTypes: string[] = [];
    const whitePieceTypes: string[] = [];
    for (const pieceType of Object.keys(defaultPieces)) {
      if (pieceType[0] === 'b') {
        blackPieceTypes.push(pieceType as string);
      } else {
        whitePieceTypes.push(pieceType as string);
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'spare-pieces',
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
