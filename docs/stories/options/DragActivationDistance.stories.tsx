import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/DragActivationDistance',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DragActivationDistance: Story = {
  render: () => {
    const [dragActivationDistance, setDragActivationDistance] = useState(2);

    // chessboard options
    const chessboardOptions = {
      dragActivationDistance,
      id: 'drag-activation-distance',
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
        <label style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          Drag activation distance:
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={dragActivationDistance}
            onChange={(e) => setDragActivationDistance(Number(e.target.value))}
          />
          {dragActivationDistance}px
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Adjust the slider to change how far you need to drag a piece before it
          starts moving
        </p>
      </div>
    );
  },
};
