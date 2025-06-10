import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/AllowDragOffBoard',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowDragOffBoard: Story = {
  render: () => {
    const [allowDragOffBoard, setAllowDragOffBoard] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDragOffBoard,
      id: 'allow-drag-off-board',
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
        <label>
          <input
            type="checkbox"
            checked={allowDragOffBoard}
            onChange={(e) => setAllowDragOffBoard(e.target.checked)}
          />
          Allow dragging pieces off board
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Try dragging a piece off the board when the checkbox is unchecked
        </p>
      </div>
    );
  },
};
