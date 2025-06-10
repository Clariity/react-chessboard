import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ArrowOptions',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArrowOptions: Story = {
  render: () => {
    // default arrow settings
    const defaultArrowOptions = {
      color: '#ffaa00',
      secondaryColor: '#ffaa00',
      tertiaryColor: '#000000',
      arrowLengthReducerDenominator: 8,
      sameTargetArrowLengthReducerDenominator: 4,
      arrowWidthDenominator: 5,
      activeArrowWidthMultiplier: 0.9,
      opacity: 0.65,
      activeOpacity: 0.5,
    };

    // arrows
    const arrows = [
      { startSquare: 'e2', endSquare: 'e4', color: '#ffaa00' },
      { startSquare: 'g1', endSquare: 'f3', color: '#ffaa00' },
      { startSquare: 'd2', endSquare: 'd4', color: '#ffaa00' },
      { startSquare: 'b1', endSquare: 'c3', color: '#ffaa00' },
      { startSquare: 'f1', endSquare: 'b5', color: '#ffaa00' },
    ];

    // arrow settings
    const [arrowOptions, setarrowOptions] = useState(defaultArrowOptions);

    // chessboard options
    const chessboardOptions = {
      arrows,
      arrowOptions,
      id: 'arrow-options',
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          {/* Colors */}
          <div>
            <label>Primary Color:</label>
            <input
              type="color"
              value={arrowOptions.color}
              onChange={(e) =>
                setarrowOptions({ ...arrowOptions, color: e.target.value })
              }
            />
          </div>
          <div>
            <label>Secondary Color:</label>
            <input
              type="color"
              value={arrowOptions.secondaryColor}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  secondaryColor: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Tertiary Color:</label>
            <input
              type="color"
              value={arrowOptions.tertiaryColor}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  tertiaryColor: e.target.value,
                })
              }
            />
          </div>

          {/* Lengths */}
          <div>
            <label>
              Arrow Length (1/{arrowOptions.arrowLengthReducerDenominator}):
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={arrowOptions.arrowLengthReducerDenominator}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  arrowLengthReducerDenominator: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>
              Same Target Arrow Length (1/
              {arrowOptions.sameTargetArrowLengthReducerDenominator}):
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={arrowOptions.sameTargetArrowLengthReducerDenominator}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  sameTargetArrowLengthReducerDenominator: Number(
                    e.target.value,
                  ),
                })
              }
            />
          </div>
          <div>
            <label>Arrow Width (1/{arrowOptions.arrowWidthDenominator}):</label>
            <input
              type="range"
              min="2"
              max="20"
              value={arrowOptions.arrowWidthDenominator}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  arrowWidthDenominator: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Opacity and Active Settings */}
          <div>
            <label>Opacity ({arrowOptions.opacity}):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={arrowOptions.opacity}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  opacity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Active Opacity ({arrowOptions.activeOpacity}):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={arrowOptions.activeOpacity}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  activeOpacity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>
              Active Width Multiplier ({arrowOptions.activeArrowWidthMultiplier}
              x):
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={arrowOptions.activeArrowWidthMultiplier}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  activeArrowWidthMultiplier: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <button onClick={() => setarrowOptions(defaultArrowOptions)}>
          Reset to Default Settings
        </button>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Adjust the controls above to customize arrow appearance. Click the
          button to reset to default settings.
        </p>
      </div>
    );
  },
};
