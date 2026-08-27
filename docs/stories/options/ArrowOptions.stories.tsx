import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories.js';
import { Chessboard } from '../../../src/index.js';

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
      colors: {
        default: '#ffaa00',
        shift: '#4caf50',
        ctrl: '#f44336',
        alt: '#9c27b0',
        meta: '#fbbf24',
      },
      color: '#ffaa00',
      secondaryColor: '#4caf50',
      tertiaryColor: '#f44336',
      arrowLengthReducerDenominator: 8,
      sameTargetArrowLengthReducerDenominator: 4,
      arrowWidthDenominator: 5,
      activeArrowWidthMultiplier: 0.9,
      opacity: 0.65,
      activeOpacity: 0.5,
      arrowStartOffset: 0,
      liveDrawArrow: true,
      knightArrow: true,
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
            <label>Default Color:</label>
            <input
              type="color"
              value={arrowOptions.colors?.default}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  colors: { ...arrowOptions.colors, default: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Shift Color:</label>
            <input
              type="color"
              value={arrowOptions.colors?.shift}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  colors: { ...arrowOptions.colors, shift: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Ctrl Color:</label>
            <input
              type="color"
              value={arrowOptions.colors?.ctrl}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  colors: { ...arrowOptions.colors, ctrl: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Alt Color:</label>
            <input
              type="color"
              value={arrowOptions.colors?.alt}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  colors: { ...arrowOptions.colors, alt: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Meta Color:</label>
            <input
              type="color"
              value={arrowOptions.colors?.meta}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  colors: { ...arrowOptions.colors, meta: e.target.value },
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

          {/* Start Offset */}
          <div>
            <label>Start Offset ({arrowOptions.arrowStartOffset}):</label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.02"
              value={arrowOptions.arrowStartOffset}
              onChange={(e) =>
                setarrowOptions({
                  ...arrowOptions,
                  arrowStartOffset: Number(e.target.value),
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

          {/* Toggles */}
          <div>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                type="checkbox"
                checked={arrowOptions.liveDrawArrow}
                onChange={(e) =>
                  setarrowOptions({
                    ...arrowOptions,
                    liveDrawArrow: e.target.checked,
                  })
                }
              />
              Live Draw Arrow
            </label>
          </div>
          <div>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                type="checkbox"
                checked={arrowOptions.knightArrow}
                onChange={(e) =>
                  setarrowOptions({
                    ...arrowOptions,
                    knightArrow: e.target.checked,
                  })
                }
              />
              Knight Arrow
            </label>
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
