import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { SquareHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnSquareClick',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnSquareMouseDown: Story = {
  render: () => {
    const [mouseDownSquare, setMouseDownSquare] = useState<string | null>(null);
    const [mouseDownPiece, setMouseDownPiece] = useState<string | null>(null);
    const [buttonPressed, setButtonPressed] = useState<string | null>(null);

    // handle square click
    const onSquareMouseDown = (
      { square, piece }: SquareHandlerArgs,
      e: React.MouseEvent,
    ) => {
      setMouseDownSquare(square);
      setMouseDownPiece(piece?.pieceType || null);
      setButtonPressed(
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
      onSquareMouseDown,
      id: 'on-square-mouse-down',
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
          <div>Mouse last pressed in: {mouseDownSquare || 'None'}</div>
          <div>Piece in square: {mouseDownPiece || 'None'}</div>
          <div>Button pressed: {buttonPressed || 'None'}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Press mouse button down on squares to see the mouse down events in
          action
        </p>
      </div>
    );
  },
};
