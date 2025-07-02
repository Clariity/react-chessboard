import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard, defaultPieces } from '../../../src';
import type { PieceRenderObject } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/Pieces',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pieces: Story = {
  render: () => {
    const customPieces: PieceRenderObject = {
      ...defaultPieces, // exported from react-chessboard
      wK: () => (
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      bK: () => (
        <svg viewBox="0 0 24 24" fill="black">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
    };

    // chessboard options
    const chessboardOptions = {
      pieces: customPieces,
      id: 'pieces',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
