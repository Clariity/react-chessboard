import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { PieceHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnPieceClick',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPieceClick: Story = {
  render: () => {
    const [clickedSquare, setClickedSquare] = useState<string>('None');
    const [clickedPiece, setClickedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece click
    const onPieceClick = ({
      square,
      piece,
      isSparePiece,
    }: PieceHandlerArgs) => {
      setClickedSquare(square || 'None');
      setClickedPiece(piece.pieceType);
      setIsSparePiece(isSparePiece);
    };

    // chessboard options
    const chessboardOptions = {
      allowDragging: false,
      onPieceClick,
      id: 'on-piece-click',
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
          Clicked square: {clickedSquare}
          <br />
          Clicked piece: {clickedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Click on pieces to see the click events
        </p>
      </div>
    );
  },
};
