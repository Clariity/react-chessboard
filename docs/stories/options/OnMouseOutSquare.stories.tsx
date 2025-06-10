import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { SquareHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnMouseOutSquare',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnMouseOutSquare: Story = {
  render: () => {
    const [lastOutSquare, setLastOutSquare] = useState<string>('None');
    const [lastOutPiece, setLastOutPiece] = useState<string | null>('None');

    // handle mouse out square
    const onMouseOutSquare = ({ square, piece }: SquareHandlerArgs) => {
      setLastOutSquare(square);
      setLastOutPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onMouseOutSquare,
      id: 'on-mouse-out-square',
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
          Last square mouse left: {lastOutSquare}
          <br />
          Piece in last square mouse left: {lastOutPiece}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Move your mouse over and out of squares to see the mouse out events
        </p>
      </div>
    );
  },
};
