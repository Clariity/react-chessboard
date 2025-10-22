import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ClearArrowsOnPositionChange',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClearArrowsOnPositionChange: Story = {
  render: () => {
    const [clearArrowsOnPositionChange, setClearArrowsOnPositionChange] =
      useState(true);
    const [arrows] = useState([
      { startSquare: 'e2', endSquare: 'e4', color: 'red' },
      { startSquare: 'g1', endSquare: 'f3', color: 'blue' },
    ]);
    const [position, setPosition] = useState(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    );

    // generate random FEN position
    function generateRandomFen() {
      const pieces = [
        'r',
        'n',
        'b',
        'q',
        'k',
        'p',
        'R',
        'N',
        'B',
        'Q',
        'K',
        'P',
      ];
      let fen = '';

      // create 8 rows of random pieces
      for (let i = 0; i < 8; i++) {
        let emptyCount = 0;

        // create 8 columns of random pieces or empty squares
        for (let j = 0; j < 8; j++) {
          if (Math.random() < 0.2) {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }

            fen += pieces[Math.floor(Math.random() * pieces.length)];
          } else {
            emptyCount++;
          }
        }

        // add empty count to FEN string if there are empty squares
        if (emptyCount > 0) {
          fen += emptyCount;
        }

        // add slash between rows
        if (i < 7) {
          fen += '/';
        }
      }

      // set the position
      setPosition(fen);
    }

    // chessboard options
    const chessboardOptions = {
      arrows,
      clearArrowsOnPositionChange,
      id: 'clear-arrows-on-click',
      position,
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
            checked={clearArrowsOnPositionChange}
            onChange={(e) => setClearArrowsOnPositionChange(e.target.checked)}
          />
          Clear arrows on position change
        </label>

        <button onClick={generateRandomFen}>
          Generate random FEN position
        </button>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Toggle the checkbox to enable/disable clearing arrows when the
          position changes.
        </p>
      </div>
    );
  },
};
