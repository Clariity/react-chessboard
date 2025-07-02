import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/DraggingPieceGhostStyle',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DraggingPieceGhostStyle: Story = {
  render: () => {
    const [opacity, setOpacity] = useState(0.5);
    const [blur, setBlur] = useState(0);

    // chessboard options
    const chessboardOptions = {
      draggingPieceGhostStyle: {
        opacity,
        filter: `blur(${blur}px)`,
      },
      id: 'dragging-piece-ghost-style',
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
            Opacity:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
            {opacity}
          </label>

          <label style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            Blur:
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
            />
            {blur}px
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Drag a piece to see the ghost piece style. Adjust the sliders to
          change the opacity and blur of the ghost piece.
        </p>
      </div>
    );
  },
};
