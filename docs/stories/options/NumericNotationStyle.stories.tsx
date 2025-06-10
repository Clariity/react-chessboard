import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/NumericNotationStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumericNotationStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      numericNotationStyle: {
        color: 'cyan',
        fontSize: '20px',
        fontWeight: 'bold',
      },
      id: 'numeric-notation-style',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
