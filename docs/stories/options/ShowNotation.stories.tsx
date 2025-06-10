import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ShowNotation',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowNotation: Story = {
  render: () => {
    const [showNotation, setShowNotation] = useState(true);

    // chessboard options
    const chessboardOptions = {
      showNotation,
      id: 'show-notation',
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
            checked={showNotation}
            onChange={(e) => setShowNotation(e.target.checked)}
          />
          Show notation
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the checkbox to show/hide board coordinates
        </p>
      </div>
    );
  },
};
