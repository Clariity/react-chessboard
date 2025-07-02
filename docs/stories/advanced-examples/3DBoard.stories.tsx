import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/3DBoard',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThreeDBoard: Story = {
  render: () => {
    const threeDPieces = useMemo(() => {
      // define the pieces and their heights
      const pieces = [
        { piece: 'wP', pieceHeight: 1 },
        { piece: 'wN', pieceHeight: 1.2 },
        { piece: 'wB', pieceHeight: 1.2 },
        { piece: 'wR', pieceHeight: 1.2 },
        { piece: 'wQ', pieceHeight: 1.5 },
        { piece: 'wK', pieceHeight: 1.6 },
        { piece: 'bP', pieceHeight: 1 },
        { piece: 'bN', pieceHeight: 1.2 },
        { piece: 'bB', pieceHeight: 1.2 },
        { piece: 'bR', pieceHeight: 1.2 },
        { piece: 'bQ', pieceHeight: 1.5 },
        { piece: 'bK', pieceHeight: 1.6 },
      ];

      // get the width of a square to use for the piece sizes
      const squareWidth =
        document
          .querySelector(`[data-column="a"][data-row="1"]`)
          ?.getBoundingClientRect()?.width ?? 0;

      // create the piece components
      const pieceComponents: Record<string, () => React.JSX.Element> = {};
      pieces.forEach(({ piece, pieceHeight }) => {
        pieceComponents[piece] = () => (
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              position: 'relative',
              pointerEvents: 'none',
            }}
          >
            <img
              src={`/3d-pieces/${piece}.webp`}
              width={squareWidth}
              height={pieceHeight * squareWidth}
              style={{
                position: 'absolute',
                bottom: `${0.2 * squareWidth}px`,
                objectFit: piece[1] === 'K' ? 'contain' : 'cover',
              }}
            />
          </div>
        );
      });
      return pieceComponents;
    }, []);

    // set the chessboard options
    const chessboardOptions = {
      id: '3d-board',
      boardStyle: {
        transform: 'rotateX(27.5deg)',
        transformOrigin: 'center',
        border: '16px solid #b8836f',
        borderStyle: 'outset',
        borderRightColor: ' #b27c67',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 2px 24px 24px 8px',
        borderRightWidth: '2px',
        borderLeftWidth: '2px',
        borderTopWidth: '0px',
        borderBottomWidth: '18px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '8px 8px 12px',
        background: '#e0c094',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover',
        overflow: 'visible',
      },
      pieces: threeDPieces,
      lightSquareStyle: {
        backgroundColor: '#e0c094',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover',
      },
      darkSquareStyle: {
        backgroundColor: '#865745',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover',
      },
    };

    // render the chessboard
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          margin: '3rem 0',
        }}
      >
        <Chessboard options={chessboardOptions} />
      </div>
    );
  },
};
