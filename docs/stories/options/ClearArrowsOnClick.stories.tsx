import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ClearArrowsOnClick',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClearArrowsOnClick: Story = {
  render: () => {
    const [clearArrowsOnClick, setClearArrowsOnClick] = useState(true);
    const [arrows] = useState([
      { startSquare: 'e2', endSquare: 'e4', color: 'red' },
      { startSquare: 'g1', endSquare: 'f3', color: 'blue' },
    ]);

    // chessboard options
    const chessboardOptions = {
      arrows,
      clearArrowsOnClick,
      id: 'clear-arrows-on-click',
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
            checked={clearArrowsOnClick}
            onChange={(e) => setClearArrowsOnClick(e.target.checked)}
          />
          Clear arrows on click
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the checkbox to enable/disable clearing arrows when clicking on
          a square
        </p>
      </div>
    );
  },
};
