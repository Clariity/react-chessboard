import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { SquareHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnMouseOverSquare',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnMouseOverSquare: Story = {
  render: () => {
    const [lastOverSquare, setLastOverSquare] = useState<string>('None');
    const [lastOverPiece, setLastOverPiece] = useState<string | null>('None');

    // handle mouse over square
    const onMouseOverSquare = ({ square, piece }: SquareHandlerArgs) => {
      setLastOverSquare(square);
      setLastOverPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onMouseOverSquare,
      id: 'on-mouse-over-square',
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
        <div>
          Last square mouse entered: {lastOverSquare}
          <br />
          Piece in last square mouse entered: {lastOverPiece}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Move your mouse over squares to see the mouse over events
        </p>
      </div>
    );
  },
};
