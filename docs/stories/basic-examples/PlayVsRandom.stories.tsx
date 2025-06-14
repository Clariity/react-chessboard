import type { Meta, StoryObj } from '@storybook/react';
import { Chess } from 'chess.js';
import { useState, useRef } from 'react';

import defaultMeta from './Default.stories';
import { Chessboard, PieceDropHandlerArgs } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/PlayVsRandom',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayVsRandom: Story = {
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // handle piece drop
    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setChessPosition(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'play-vs-random',
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  },
};
