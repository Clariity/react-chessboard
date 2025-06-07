import type { Meta, StoryObj } from '@storybook/react';
import { Chess } from 'chess.js';
import { useState, useRef, useEffect } from 'react';

import defaultMeta from '../Default.stories';
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
    const [animationDuration, setAnimationDuration] = useState(300);
    const [chessGame, setChessGame] = useState(new Chess());
    const chessGameRef = useRef(chessGame);

    // update the ref when the game state changes
    useEffect(() => {
      chessGameRef.current = chessGame;
    }, [chessGame]);

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves
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
    const onPieceDrop = ({
      sourceSquare,
      targetSquare,
    }: PieceDropHandlerArgs) => {
      if (!targetSquare) return false;

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

        return true;
      } catch {
        return false;
      }
    };

    // chessboard options
    const chessboardOptions = {
      animationDurationInMs: animationDuration,
      position: chessGame.fen(),
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
