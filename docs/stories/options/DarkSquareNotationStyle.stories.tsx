import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/DarkSquareNotationStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkSquareNotationStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      darkSquareNotationStyle: {
        color: 'cyan',
        fontWeight: 'bold',
      },
      id: 'dark-square-notation-style',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
