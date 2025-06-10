import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import { PositionDataType } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ChessboardRows',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChessboardRows: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      chessboardRows: 16,
      position: {
        a1: { pieceType: 'wR' },
        a2: { pieceType: 'wP' },
        a15: { pieceType: 'bP' },
        a16: { pieceType: 'bR' },
        b1: { pieceType: 'wN' },
        b2: { pieceType: 'wP' },
        b15: { pieceType: 'bP' },
        b16: { pieceType: 'bN' },
        c1: { pieceType: 'wB' },
        c2: { pieceType: 'wP' },
        c15: { pieceType: 'bP' },
        c16: { pieceType: 'bB' },
        d1: { pieceType: 'wQ' },
        d2: { pieceType: 'wP' },
        d15: { pieceType: 'bP' },
        d16: { pieceType: 'bQ' },
        e1: { pieceType: 'wK' },
        e2: { pieceType: 'wP' },
        e15: { pieceType: 'bP' },
        e16: { pieceType: 'bK' },
        f1: { pieceType: 'wB' },
        f2: { pieceType: 'wP' },
        f15: { pieceType: 'bP' },
        f16: { pieceType: 'bB' },
        g1: { pieceType: 'wN' },
        g2: { pieceType: 'wP' },
        g15: { pieceType: 'bP' },
        g16: { pieceType: 'bN' },
        h1: { pieceType: 'wR' },
        h2: { pieceType: 'wP' },
        h15: { pieceType: 'bP' },
        h16: { pieceType: 'bR' },
      } as PositionDataType,
      id: 'chessboard-rows',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
