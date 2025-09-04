import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { SquareHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnSquareClick',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnSquareMouseUp: Story = {
  render: () => {
    const [mouseUpSquare, setMouseUpSquare] = useState<string | null>(null);
    const [mouseUpPiece, setMouseUpPiece] = useState<string | null>(null);
    const [buttonReleased, setButtonReleased] = useState<string | null>(null);

    // handle square click
    const onSquareMouseUp = (
      { square, piece }: SquareHandlerArgs,
      e: React.MouseEvent,
    ) => {
      setMouseUpSquare(square);
      setMouseUpPiece(piece?.pieceType || null);
      setButtonReleased(
        e.button === 0
          ? 'Left'
          : e.button === 1
            ? 'Middle'
            : e.button === 2
              ? 'Right'
              : `Button ${e.button}`,
      );
    };

    // chessboard options
    const chessboardOptions = {
      onSquareMouseUp,
      id: 'on-square-mouse-up',
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
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div>Mouse released in square: {mouseUpSquare || 'None'}</div>
          <div>Piece in square: {mouseUpPiece || 'None'}</div>
          <div>Button released: {buttonReleased || 'None'}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Release mouse button on squares to see the mouse up events in action
        </p>
      </div>
    );
  },
};
