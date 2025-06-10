import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/SquareStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      squareStyle: {
        border: '2px dashed #666',
        borderRadius: '8px',
        background:
          'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)',
      },
      id: 'square-style',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
