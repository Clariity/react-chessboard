import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/AllowDragging',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowDragging: Story = {
  render: () => {
    const [allowDragging, setAllowDragging] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDragging,
      id: 'allow-dragging',
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
            checked={allowDragging}
            onChange={(e) => setAllowDragging(e.target.checked)}
          />
          Allow dragging pieces
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the checkbox to enable/disable piece dragging
        </p>
      </div>
    );
  },
};
