import type { Meta, StoryObj } from '@storybook/react';
import { Chess } from 'chess.js';
import { useState, useRef, useEffect } from 'react';

import defaultMeta from './Default.stories';
import { Chessboard } from '../../src';
import { PieceDropHandlerArgs } from '../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/PlayVsRandom',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayVsRandom: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(new Chess());
    const chessGameRef = useRef(chessGame);

    // update the ref when the game state changes
    useEffect(() => {
      chessGameRef.current = chessGame;
    }, [chessGame]);

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGameRef.current.moves();

      // exit if the game is over
      if (chessGameRef.current.isGameOver()) {
        return;
      }

      // make a random move
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      chessGameRef.current.move(randomMove);
      setChessGame(new Chess(chessGameRef.current.fen()));
    }

    // handle piece drop
    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move
      try {
        chessGameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to a queen for example simplicity
        });

        // update the game state
        setChessGame(new Chess(chessGameRef.current.fen()));

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true if the move was successful
        return true;
      } catch {
        // return false if the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessGame.fen(),
      onPieceDrop,
      id: 'play-vs-random',
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  },
};
