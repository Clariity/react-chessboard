import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/AllowDrawingArrows',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowDrawingArrows: Story = {
  render: () => {
    const [allowDrawingArrows, setAllowDrawingArrows] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDrawingArrows,
      id: 'allow-drawing-arrows',
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
            checked={allowDrawingArrows}
            onChange={(e) => setAllowDrawingArrows(e.target.checked)}
          />
          Allow drawing arrows
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the checkbox to enable/disable drawing arrows by holding right
          click and dragging
        </p>
      </div>
    );
  },
};
