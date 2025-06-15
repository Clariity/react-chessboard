import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/DropSquareStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropSquareStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      dropSquareStyle: {
        boxShadow: 'inset 0px 0px 0px 5px red',
      },
      id: 'drop-square-style',
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
          Drag a piece to see a custom drop square style
        </p>
      </div>
    );
  },
};
