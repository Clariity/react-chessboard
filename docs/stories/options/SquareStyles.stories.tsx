import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';
import { SquareHandlerArgs } from '../../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/SquareStyles',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareStyles: Story = {
  render: () => {
    const [squareStyles, setSquareStyles] = useState<
      Record<string, React.CSSProperties>
    >({
      e4: {
        backgroundColor: 'rgba(255,0,0,0.2)',
      },
    });

    function onSquareClick() {
      setSquareStyles({});
    }

    // add or remove a style when a square is right clicked
    function onSquareRightClick(args: SquareHandlerArgs) {
      setSquareStyles((prev) => {
        const newSquareStyles = { ...prev };
        if (newSquareStyles[args.square]) {
          delete newSquareStyles[args.square];
        } else {
          newSquareStyles[args.square] = {
            backgroundColor: 'rgba(255,0,0,0.2)',
          };
        }
        return newSquareStyles;
      });
    }

    // chessboard options
    const chessboardOptions = {
      onSquareClick,
      onSquareRightClick,
      squareStyles,
      id: 'square-styles',
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
        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Right click on a square to add or remove a red background. Left click
          to remove all red backgrounds.
        </p>
      </div>
    );
  },
};
