import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { PieceHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnPieceDrag',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPieceDrag: Story = {
  render: () => {
    const [draggedSquare, setDraggedSquare] = useState<string>('None');
    const [draggedPiece, setDraggedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece drag start
    const onPieceDrag = ({ square, piece, isSparePiece }: PieceHandlerArgs) => {
      setDraggedSquare(square || 'None');
      setDraggedPiece(piece.pieceType);
      setIsSparePiece(isSparePiece);
    };

    // chessboard options
    const chessboardOptions = {
      onPieceDrag,
      id: 'on-piece-drag-start',
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
          Dragged from square: {draggedSquare}
          <br />
          Dragged piece: {draggedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Start dragging pieces to see the drag start events
        </p>
      </div>
    );
  },
};
