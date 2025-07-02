import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { PieceDropHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnPieceDrop',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPieceDrop: Story = {
  render: () => {
    const [sourceSquare, setSourceSquare] = useState<string>('None');
    const [targetSquare, setTargetSquare] = useState<string>('None');
    const [droppedPiece, setDroppedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece drop
    const onPieceDrop = ({
      sourceSquare,
      targetSquare,
      piece,
    }: PieceDropHandlerArgs) => {
      setSourceSquare(sourceSquare);
      setTargetSquare(targetSquare || 'None');
      setDroppedPiece(piece.pieceType);
      setIsSparePiece(piece.isSparePiece);
      return true; // Allow the drop
    };

    // chessboard options
    const chessboardOptions = {
      onPieceDrop,
      id: 'on-piece-drop',
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
          Source square: {sourceSquare}
          <br />
          Target square: {targetSquare}
          <br />
          Dropped piece: {droppedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Drag and drop pieces to see the drop events
        </p>
      </div>
    );
  },
};
