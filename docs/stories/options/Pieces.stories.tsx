import type { Meta, StoryObj } from '@storybook/react';

import defaultMeta from '../basic-examples/Default.stories.js';
import { Chessboard, defaultPieces } from '../../../src/index.js';
import type { PieceRenderObject } from '../../../src/types.js';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/Pieces',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pieces: Story = {
  render: () => {
    const customPieces: PieceRenderObject = {
      ...defaultPieces, // exported from react-chessboard
      wP: (props) => {
        if (props?.square === 'e2') {
          return (
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          );
        }

        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 45 45"
            width="100%"
            height="100%"
            style={props?.svgStyle}
          >
            <path
              d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
              style={{
                opacity: '1',
                fill: props?.fill ?? '#ffffff',
                fillOpacity: '1',
                fillRule: 'nonzero',
                stroke: '#000000',
                strokeWidth: '1.5',
                strokeLinecap: 'round',
                strokeLinejoin: 'miter',
                strokeMiterlimit: '4',
                strokeDasharray: 'none',
                strokeOpacity: '1',
              }}
            />
          </svg>
        );
      },
      bK: () => (
        <svg viewBox="0 0 24 24" fill="black">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
    };

    // chessboard options
    const chessboardOptions = {
      pieces: customPieces,
      id: 'pieces',
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
