import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/DraggingPieceStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DraggingPieceStyle: Story = {
  render: () => {
    const [scale, setScale] = useState(1.2);
    const [rotate, setRotate] = useState(0);

    // chessboard options
    const chessboardOptions = {
      draggingPieceStyle: {
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      },
      id: 'dragging-piece-style',
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
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            Scale:
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
            {scale}x
          </label>

          <label style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            Rotate:
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
            />
            {rotate}°
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Drag a piece to see the custom dragging style. Adjust the sliders to
          change the scale and rotation of the dragged piece.
        </p>
      </div>
    );
  },
};
