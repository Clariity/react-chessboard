import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories.js';
import { Chessboard } from '../../../src/index.js';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnPieceDragCancel',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPieceDragCancel: Story = {
  render: () => {
    const [cancelCount, setCancelCount] = useState<number>(0);

    // handle piece drag cancel
    const onPieceDragCancel = () => {
      setCancelCount((prev) => prev + 1);
    };

    // chessboard options
    const chessboardOptions = {
      onPieceDragCancel,
      id: 'on-piece-drag-cancel',
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
          Drag cancelled: {cancelCount} time{cancelCount !== 1 ? 's' : ''}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Start dragging a piece and click right click or press Escape to
          trigger a drag cancel
        </p>
      </div>
    );
  },
};
