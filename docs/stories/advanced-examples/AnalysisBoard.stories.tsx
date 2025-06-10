import type { Meta, StoryObj } from '@storybook/react';
import { Chess, Square } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import { Chessboard, PieceDropHandlerArgs } from '../../../src';
import Engine from '../../stockfish/engine';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/AnalysisBoard',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AnalysisBoard: Story = {
  render: () => {
    const engine = useMemo(() => new Engine(), []);
    const [chessGame, setChessGame] = useState(new Chess());

    const [positionEvaluation, setPositionEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestLine] = useState('');
    const [possibleMate, setPossibleMate] = useState('');

    useEffect(() => {
      if (!chessGame.isGameOver() || chessGame.isDraw()) {
        findBestMove();
      }
    }, [chessGame.fen()]);

    function findBestMove() {
      engine.evaluatePosition(chessGame.fen(), 18);
      engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
        if (depth && depth < 10) {
          return;
        }

        if (positionEvaluation) {
          setPositionEvaluation(
            ((chessGame.turn() === 'w' ? 1 : -1) * Number(positionEvaluation)) /
              100,
          );
        }

        if (possibleMate) {
          setPossibleMate(possibleMate);
        }
        if (depth) {
          setDepth(depth);
        }
        if (pv) {
          setBestLine(pv);
        }
      });
    }

    // handle piece drop
    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to a queen for example simplicity
        });

        setPossibleMate('');

        // update the game state
        setChessGame(new Chess(chessGame.fen()));

        engine.stop();
        setBestLine('');
        if (chessGame.isGameOver() || chessGame.isDraw()) {
          return false;
        }

        // return true if the move was successful
        return true;
      } catch {
        // return false if the move was not successful
        return false;
      }
    }

    const bestMove = bestLine?.split(' ')?.[0];

    const chessboardOptions = {
      arrows: bestMove
        ? [
            {
              startSquare: bestMove.substring(0, 2) as Square,
              endSquare: bestMove.substring(2, 4) as Square,
              color: 'rgb(0, 128, 0)',
            },
          ]
        : undefined,
      position: chessGame.fen(),
      onPieceDrop,
      id: 'analysis-board',
    };

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
          Position Evaluation:{' '}
          {possibleMate ? `#${possibleMate}` : positionEvaluation}
          {'; '}
          Depth: {depth}
        </div>
        <div>
          Best line: <i>{bestLine.slice(0, 40)}</i> ...
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Make moves on the board to analyze positions. The green arrow shows
          Stockfish&apos;s suggested best move. The evaluation is shown in
          centipawns (positive numbers favor White, negative favor Black).
        </p>
      </div>
    );
  },
};
