import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import { PieceHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/CanDragPiece',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CanDragPiece: Story = {
  render: () => {
    function canDragPiece({ piece }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // chessboard options
    const chessboardOptions = {
      canDragPiece,
      id: 'can-drag-piece',
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
        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Only white pieces can be dragged
        </p>
      </div>
    );
  },
};
