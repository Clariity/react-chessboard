import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Options/Arrows',
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to generate random square
const getRandomSquare = () => {
  const files = 'abcdefgh';
  const ranks = '12345678';
  return `${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`;
};

// Helper function to generate unique squares
const getUniqueSquares = (count: number) => {
  const squares = new Set<string>();
  while (squares.size < count) {
    squares.add(getRandomSquare());
  }
  return Array.from(squares);
};

export const Arrows: Story = {
  render: () => {
    const [arrows, setArrows] = useState([
      { startSquare: 'e2', endSquare: 'e4', color: 'red' },
      { startSquare: 'g1', endSquare: 'f3', color: 'blue' },
      { startSquare: 'c1', endSquare: 'g5', color: 'green' },
    ]);

    const generateRandomArrows = () => {
      // Get 6 unique squares (3 pairs of start/end squares)
      const uniqueSquares = getUniqueSquares(6);
      const colors = ['red', 'blue', 'green'];

      const newArrows = Array.from({ length: 3 }, (_, index) => ({
        startSquare: uniqueSquares[index * 2],
        endSquare: uniqueSquares[index * 2 + 1],
        color: colors[index],
      }));

      setArrows(newArrows);
    };

    // chessboard options
    const chessboardOptions = {
      arrows,
      id: 'arrows',
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
        <button onClick={generateRandomArrows}>Generate Random Arrows</button>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Click the button to generate 3 random arrows on the board.
        </p>
      </div>
    );
  },
};
