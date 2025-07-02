import type { Meta, StoryObj } from '@storybook/react';
import { Chess } from 'chess.js';
import { useState, useRef } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { PieceDropHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/AnimationDurationInMs',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AnimationDurationInMs: Story = {
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the animation duration in state
    const [animationDuration, setAnimationDuration] = useState(300);

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves
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
    const onPieceDrop = ({
      sourceSquare,
      targetSquare,
    }: PieceDropHandlerArgs) => {
      if (!targetSquare) return false;

      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to a queen for example simplicity
        });

        // update the position state
        setChessPosition(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    };

    // chessboard options
    const chessboardOptions = {
      animationDurationInMs: animationDuration,
      position: chessPosition,
      onPieceDrop,
      id: 'animation-duration-in-ms',
    };

    // render
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <label style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          Animation duration (ms):
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={animationDuration}
            onChange={(e) => setAnimationDuration(Number(e.target.value))}
          />
          {animationDuration}ms
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Play against random moves. Try moving pieces to see the animation
          effects
        </p>
      </div>
    );
  },
};
