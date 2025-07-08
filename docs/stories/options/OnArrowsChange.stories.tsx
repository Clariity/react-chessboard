import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import type { Arrow } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/OnArrowsChange',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnArrowsChange: Story = {
  render: () => {
    const [internalArrows, setInternalArrows] = useState<Arrow[]>([]);
    const [arrowHistory, setArrowHistory] = useState<Arrow[][]>([]);

    // handle arrows change
    const onArrowsChange = ({ arrows }: { arrows: Arrow[] }) => {
      setInternalArrows(arrows);
      setArrowHistory((prev) => [...prev, arrows]);
    };

    // clear arrow history
    const clearHistory = () => {
      setArrowHistory([]);
    };

    // chessboard options
    const chessboardOptions = {
      onArrowsChange,
      id: 'on-arrows-change',
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
          <h4>Current Internal Arrows:</h4>
          <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            {internalArrows.length === 0 ? (
              <span style={{ color: '#666' }}>No arrows drawn</span>
            ) : (
              internalArrows.map((arrow, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>
                  {arrow.startSquare} → {arrow.endSquare} ({arrow.color})
                </div>
              ))
            )}
          </div>

          <h4>Arrow Change History:</h4>
          <div
            style={{
              fontSize: '0.8rem',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {arrowHistory.length === 0 ? (
              <span style={{ color: '#666' }}>No changes yet</span>
            ) : (
              arrowHistory.map((arrows, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <strong>Change {index + 1}:</strong> {arrows.length} arrow(s)
                  {arrows.length > 0 && (
                    <div style={{ marginTop: '0.25rem' }}>
                      {arrows.map((arrow, arrowIndex) => (
                        <div
                          key={arrowIndex}
                          style={{ fontSize: '0.75rem', color: '#666' }}
                        >
                          {arrow.startSquare} → {arrow.endSquare}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <button
            onClick={clearHistory}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
            }}
          >
            Clear History
          </button>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Right-click and drag to draw arrows. The onArrowsChange callback will
          be triggered whenever internal arrows are added or removed.
        </p>
      </div>
    );
  },
};
