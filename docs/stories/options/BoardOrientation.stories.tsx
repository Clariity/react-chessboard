import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/BoardOrientation',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoardOrientation: Story = {
  render: () => {
    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
      'white',
    );

    // chessboard options
    const chessboardOptions = {
      boardOrientation,
      id: 'board-orientation',
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
          <label>
            <input
              type="radio"
              checked={boardOrientation === 'white'}
              onChange={() => setBoardOrientation('white')}
            />
            White at bottom
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              checked={boardOrientation === 'black'}
              onChange={() => setBoardOrientation('black')}
            />
            Black at bottom
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the radio buttons to change the board orientation
        </p>
      </div>
    );
  },
};
