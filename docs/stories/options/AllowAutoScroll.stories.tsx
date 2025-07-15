import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/AllowAutoScroll',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowAutoScroll: Story = {
  render: () => {
    const [allowAutoScroll, setAllowAutoScroll] = useState(false);

    // chessboard options
    const chessboardOptions = {
      allowAutoScroll,
      id: 'allow-auto-scroll',
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
            checked={allowAutoScroll}
            onChange={(e) => setAllowAutoScroll(e.target.checked)}
          />
          Allow auto-scroll when dragging near screen edges
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Enable the checkbox and try dragging a piece near the edge of the
          screen to see auto-scroll behavior
        </p>
      </div>
    );
  },
};
