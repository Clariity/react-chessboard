import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import {
  Chessboard,
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  PositionDataType,
} from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/MiniPuzzles',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MiniPuzzles: Story = {
  render: () => {
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [position, setPosition] = useState({
      a4: { pieceType: 'bR' },
      c4: { pieceType: 'bK' },
      e4: { pieceType: 'bN' },
      d3: { pieceType: 'bP' },
      f3: { pieceType: 'bQ' },
      c2: { pieceType: 'wN' },
      d2: { pieceType: 'wQ' },
      b1: { pieceType: 'wN' },
    } as PositionDataType);

    // as the squareStyles prop applies within a square instead of the whole square, we wouldn't be able to hide the squares with this prop
    // instead, we hide the squares by getting the square elements by their id and setting the display to none
    // "mini-puzzles" being the id we gave to the chessboard
    useEffect(() => {
      const e1 = document.getElementById('mini-puzzles-square-e1');
      const f1 = document.getElementById('mini-puzzles-square-f1');

      if (e1) {
        e1.style.display = 'none';
      }
      if (f1) {
        f1.style.display = 'none';
      }
    }, []);

    // moves for the puzzle
    const moves = [
      {
        sourceSquare: 'd2',
        targetSquare: 'c3',
      },
      {
        sourceSquare: 'e4',
        targetSquare: 'c3',
      },
      {
        sourceSquare: 'b1',
        targetSquare: 'd2',
      },
    ];

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece,
    }: PieceDropHandlerArgs) {
      const requiredMove = moves[currentMoveIndex];

      // check if the move is valid
      if (
        requiredMove.sourceSquare !== sourceSquare ||
        requiredMove.targetSquare !== targetSquare
      ) {
        // return false as the move is not valid
        return false;
      }

      // update the position
      const newPosition = { ...position };
      newPosition[targetSquare] = {
        pieceType: piece.pieceType,
      };
      delete newPosition[sourceSquare];
      setPosition(newPosition);

      // increment the current move index
      setCurrentMoveIndex((prev) => prev + 1);

      // define makeCpuMove inside onPieceDrop to capture current values
      const makeCpuMove = () => {
        const nextMoveIndex = currentMoveIndex + 1;

        // if there is another move, make it
        if (nextMoveIndex < moves.length) {
          const move = moves[nextMoveIndex];
          const updatedPosition = { ...newPosition };
          updatedPosition[move.targetSquare] = {
            pieceType: updatedPosition[move.sourceSquare].pieceType,
          };
          delete updatedPosition[move.sourceSquare];
          setPosition(updatedPosition);
          setCurrentMoveIndex(nextMoveIndex + 1);
        }
      };

      // make the cpu move
      setTimeout(makeCpuMove, 200);

      // return true as the move was successful
      return true;
    }

    // only allow white pieces to be dragged
    function canDragPiece({ piece }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // set the chessboard options
    const chessboardOptions = {
      canDragPiece,
      onPieceDrop,
      chessboardRows: 4,
      chessboardColumns: 6,
      position,
      id: 'mini-puzzles',
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
          White to move, checkmate in 2
        </div>

        <Chessboard options={chessboardOptions} />
      </div>
    );
  },
};
