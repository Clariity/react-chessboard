import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard, ChessboardOptions } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/SquareRenderer',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareRenderer: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions: ChessboardOptions = {
      squareRenderer: ({ square, children }) => (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {children}

          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            {square}
          </span>
        </div>
      ),
      id: 'square-renderer',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
