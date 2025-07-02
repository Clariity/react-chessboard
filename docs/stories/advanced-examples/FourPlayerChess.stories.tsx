import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard, defaultDraggingPieceStyle } from '../../../src';
import { defaultPieces } from '../../../src/pieces';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/FourPlayerChess',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FourPlayerChess: Story = {
  render: () => {
    // use position object to set up the board, using custom piece types for each player colour
    const topPieces = {
      d14: { pieceType: 'yR' },
      e14: { pieceType: 'yN' },
      f14: { pieceType: 'yB' },
      g14: { pieceType: 'yK' },
      h14: { pieceType: 'yQ' },
      i14: { pieceType: 'yB' },
      j14: { pieceType: 'yN' },
      k14: { pieceType: 'yR' },
      d13: { pieceType: 'yP' },
      e13: { pieceType: 'yP' },
      f13: { pieceType: 'yP' },
      g13: { pieceType: 'yP' },
      h13: { pieceType: 'yP' },
      i13: { pieceType: 'yP' },
      j13: { pieceType: 'yP' },
      k13: { pieceType: 'yP' },
    };
    const rightPieces = {
      n11: { pieceType: 'gR' },
      n10: { pieceType: 'gN' },
      n9: { pieceType: 'gB' },
      n8: { pieceType: 'gQ' },
      n7: { pieceType: 'gK' },
      n6: { pieceType: 'gB' },
      n5: { pieceType: 'gN' },
      n4: { pieceType: 'gR' },
      m11: { pieceType: 'gP' },
      m10: { pieceType: 'gP' },
      m9: { pieceType: 'gP' },
      m8: { pieceType: 'gP' },
      m7: { pieceType: 'gP' },
      m6: { pieceType: 'gP' },
      m5: { pieceType: 'gP' },
      m4: { pieceType: 'gP' },
    };
    const bottomPieces = {
      d1: { pieceType: 'rR' },
      e1: { pieceType: 'rN' },
      f1: { pieceType: 'rB' },
      g1: { pieceType: 'rQ' },
      h1: { pieceType: 'rK' },
      i1: { pieceType: 'rB' },
      j1: { pieceType: 'rN' },
      k1: { pieceType: 'rR' },
      d2: { pieceType: 'rP' },
      e2: { pieceType: 'rP' },
      f2: { pieceType: 'rP' },
      g2: { pieceType: 'rP' },
      h2: { pieceType: 'rP' },
      i2: { pieceType: 'rP' },
      j2: { pieceType: 'rP' },
      k2: { pieceType: 'rP' },
    };
    const leftPieces = {
      a11: { pieceType: 'bR' },
      a10: { pieceType: 'bN' },
      a9: { pieceType: 'bB' },
      a8: { pieceType: 'bK' },
      a7: { pieceType: 'bQ' },
      a6: { pieceType: 'bB' },
      a5: { pieceType: 'bN' },
      a4: { pieceType: 'bR' },
      b11: { pieceType: 'bP' },
      b10: { pieceType: 'bP' },
      b9: { pieceType: 'bP' },
      b8: { pieceType: 'bP' },
      b7: { pieceType: 'bP' },
      b6: { pieceType: 'bP' },
      b5: { pieceType: 'bP' },
      b4: { pieceType: 'bP' },
    };

    // combine the pieces into a single position object
    const [position] = useState({
      ...topPieces,
      ...rightPieces,
      ...bottomPieces,
      ...leftPieces,
    });

    // track the orientation of the board in terms of degrees of rotation
    const [orientation, setOrientation] = useState(0);

    // hide 9 squares in each corner
    useEffect(() => {
      const corners = [
        // Top-left
        { files: ['a', 'b', 'c'], ranks: ['12', '13', '14'] },
        // Top-right
        { files: ['l', 'm', 'n'], ranks: ['12', '13', '14'] },
        // Bottom-left
        { files: ['a', 'b', 'c'], ranks: ['1', '2', '3'] },
        // Bottom-right
        { files: ['l', 'm', 'n'], ranks: ['1', '2', '3'] },
      ];

      // loop through each corner and hide the squares
      corners.forEach((corner) => {
        corner.files.forEach((file) => {
          corner.ranks.forEach((rank) => {
            const el = document.getElementById(
              'four-player-chess-square-' + file + rank,
            );
            if (el) {
              el.style.display = 'none';
            }
          });
        });
      });
    }, []);

    // define the styles for each player colour and the rotation of the pieces
    const yellowStyle = {
      fill: '#FFD700',
      svgStyle: { transform: `rotate(${-orientation}deg)` },
    };
    const greenStyle = {
      fill: '#00A86B',
      svgStyle: { transform: `rotate(${-orientation}deg)` },
    };
    const redStyle = {
      fill: '#D7263D',
      svgStyle: { transform: `rotate(${-orientation}deg)` },
    };
    const blueStyle = {
      fill: '#1E90FF',
      svgStyle: { transform: `rotate(${-orientation}deg)` },
    };

    // define the pieces for each player colour
    const fourPlayerPieces = {
      // Yellow (top)
      yP: () => defaultPieces.wP(yellowStyle),
      yR: () => defaultPieces.wR(yellowStyle),
      yN: () => defaultPieces.wN(yellowStyle),
      yB: () => defaultPieces.wB(yellowStyle),
      yQ: () => defaultPieces.wQ(yellowStyle),
      yK: () => defaultPieces.wK(yellowStyle),
      // Green (right)
      gP: () => defaultPieces.wP(greenStyle),
      gR: () => defaultPieces.wR(greenStyle),
      gN: () => defaultPieces.wN(greenStyle),
      gB: () => defaultPieces.wB(greenStyle),
      gQ: () => defaultPieces.wQ(greenStyle),
      gK: () => defaultPieces.wK(greenStyle),
      // Red (bottom)
      rP: () => defaultPieces.wP(redStyle),
      rR: () => defaultPieces.wR(redStyle),
      rN: () => defaultPieces.wN(redStyle),
      rB: () => defaultPieces.wB(redStyle),
      rQ: () => defaultPieces.wQ(redStyle),
      rK: () => defaultPieces.wK(redStyle),
      // Blue (left)
      bP: () => defaultPieces.wP(blueStyle),
      bR: () => defaultPieces.wR(blueStyle),
      bN: () => defaultPieces.wN(blueStyle),
      bB: () => defaultPieces.wB(blueStyle),
      bQ: () => defaultPieces.wQ(blueStyle),
      bK: () => defaultPieces.wK(blueStyle),
    } as const;

    // set the chessboard options
    const chessboardOptions = {
      chessboardRows: 14,
      chessboardColumns: 14,
      position,
      id: 'four-player-chess',
      pieces: fourPlayerPieces,
      showNotation: false,
      boardStyle: {
        transform: `rotate(${orientation}deg)`,
      },
      draggingPieceStyle: {
        ...defaultDraggingPieceStyle,
        transform: `rotate(${orientation}deg)`, // rotate the dragging piece to match the orientation of the board
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
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          4-Player Chess (Board Only)
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setOrientation(0)}>Red</button>
          <button onClick={() => setOrientation(90)}>Green</button>
          <button onClick={() => setOrientation(180)}>Yellow</button>
          <button onClick={() => setOrientation(270)}>Blue</button>
        </div>
        <Chessboard options={chessboardOptions} />
      </div>
    );
  },
};
