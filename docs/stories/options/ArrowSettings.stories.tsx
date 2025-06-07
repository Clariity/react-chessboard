import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/ArrowSettings',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArrowSettings: Story = {
  render: () => {
    // default arrow settings
    const defaultArrowSettings = {
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
    const [arrowSettings, setArrowSettings] = useState(defaultArrowSettings);

    // chessboard options
    const chessboardOptions = {
      arrows,
      arrowSettings,
      id: 'arrow-settings',
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
              value={arrowSettings.color}
              onChange={(e) =>
                setArrowSettings({ ...arrowSettings, color: e.target.value })
              }
            />
          </div>
          <div>
            <label>Secondary Color:</label>
            <input
              type="color"
              value={arrowSettings.secondaryColor}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  secondaryColor: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Tertiary Color:</label>
            <input
              type="color"
              value={arrowSettings.tertiaryColor}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  tertiaryColor: e.target.value,
                })
              }
            />
          </div>

          {/* Lengths */}
          <div>
            <label>
              Arrow Length (1/{arrowSettings.arrowLengthReducerDenominator}):
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={arrowSettings.arrowLengthReducerDenominator}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  arrowLengthReducerDenominator: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>
              Same Target Arrow Length (1/
              {arrowSettings.sameTargetArrowLengthReducerDenominator}):
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={arrowSettings.sameTargetArrowLengthReducerDenominator}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  sameTargetArrowLengthReducerDenominator: Number(
                    e.target.value,
                  ),
                })
              }
            />
          </div>
          <div>
            <label>
              Arrow Width (1/{arrowSettings.arrowWidthDenominator}):
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={arrowSettings.arrowWidthDenominator}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  arrowWidthDenominator: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Opacity and Active Settings */}
          <div>
            <label>Opacity ({arrowSettings.opacity}):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={arrowSettings.opacity}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  opacity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Active Opacity ({arrowSettings.activeOpacity}):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={arrowSettings.activeOpacity}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  activeOpacity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>
              Active Width Multiplier (
              {arrowSettings.activeArrowWidthMultiplier}x):
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={arrowSettings.activeArrowWidthMultiplier}
              onChange={(e) =>
                setArrowSettings({
                  ...arrowSettings,
                  activeArrowWidthMultiplier: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <button onClick={() => setArrowSettings(defaultArrowSettings)}>
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
