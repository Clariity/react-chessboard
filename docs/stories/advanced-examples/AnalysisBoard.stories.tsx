import type { Meta, StoryObj } from '@storybook/react';
import { Chess, Square } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    // initialise the engine
    const engine = useMemo(() => new Engine(), []);

    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // store engine variables
    const [positionEvaluation, setPositionEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestLine] = useState('');
    const [possibleMate, setPossibleMate] = useState('');

    // when the chess game position changes, find the best move
    useEffect(() => {
      if (!(chessGame.isGameOver() || chessGame.isDraw())) {
        findBestMove();
      }
    }, [chessGame.fen()]);

    // find the best move
    function findBestMove() {
      engine.evaluatePosition(chessGame.fen(), 18);
      engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
        // ignore messages with a depth less than 10
        if (depth && depth < 10) {
          return;
        }

        // update the position evaluation
        if (positionEvaluation) {
          setPositionEvaluation(
            ((chessGame.turn() === 'w' ? 1 : -1) * Number(positionEvaluation)) /
              100,
          );
        }

        // update the possible mate, depth and best line
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
        setChessPosition(chessGame.fen());

        // stop the engine (it will be restarted by the useEffect running findBestMove)
        engine.stop();

        // reset the best line
        setBestLine('');

        // if the game is over, return false
        if (chessGame.isGameOver() || chessGame.isDraw()) {
          return false;
        }

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // get the best move
    const bestMove = bestLine?.split(' ')?.[0];

    // set the chessboard options, using arrows to show the best move
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
      position: chessPosition,
      onPieceDrop,
      id: 'analysis-board',
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
