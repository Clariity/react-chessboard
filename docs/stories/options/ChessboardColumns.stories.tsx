import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ChessboardColumns',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChessboardColumns: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      chessboardColumns: 16,
      id: 'chessboard-columns',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
