import type { Meta, StoryObj } from '@storybook/react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { useRef, useState } from 'react';

import defaultMeta from '../basic-examples/Default.stories';
import {
  Chessboard,
  chessColumnToColumnIndex,
  defaultPieces,
  PieceDropHandlerArgs,
  PieceRenderObject,
} from '../../../src';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/PiecePromotion',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PiecePromotion: Story = {
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess('8/P7/7K/8/8/8/8/k7 w - - 0 1'));
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // track the promotion move
    const [promotionMove, setPromotionMove] = useState<Omit<
      PieceDropHandlerArgs,
      'piece'
    > | null>(null);

    // handle piece drop
    function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // target square is a promotion square, check if valid and show promotion dialog
      if (targetSquare.match(/\d+$/)?.[0] === '8') {
        // get all possible moves for the source square
        const possibleMoves = chessGame.moves({
          square: sourceSquare as Square,
        });

        // check if target square is in possible moves (accounting for promotion notation)
        if (possibleMoves.some((move) => move.startsWith(`${targetSquare}=`))) {
          setPromotionMove({
            sourceSquare,
            targetSquare,
          });
        }

        // return true so that the promotion move is not animated
        // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
        return true;
      }

      // not a promotion square, try to make the move now
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
        });

        // update the game state
        setChessPosition(chessGame.fen());

        // return true if the move was successful
        return true;
      } catch {
        // return false if the move was not successful
        return false;
      }
    }

    // handle promotion piece select
    function onPromotionPieceSelect(piece: PieceSymbol) {
      try {
        chessGame.move({
          from: promotionMove!.sourceSquare,
          to: promotionMove!.targetSquare as Square,
          promotion: piece,
        });

        // update the game state
        setChessPosition(chessGame.fen());
      } catch {
        // do nothing
      }

      // reset the promotion move to clear the promotion dialog
      setPromotionMove(null);
    }

    // calculate the left position of the promotion square
    const squareWidth =
      document
        .querySelector(`[data-column="a"][data-row="1"]`)
        ?.getBoundingClientRect()?.width ?? 0;
    const promotionSquareLeft = promotionMove?.targetSquare
      ? squareWidth *
        chessColumnToColumnIndex(
          promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '',
          8, // number of columns
          'white', // board orientation
        )
      : 0;

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'piece-promotion',
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
        <button
          onClick={() => {
            chessGameRef.current = new Chess('8/P7/7K/8/8/8/8/k7 w - - 0 1');
            setChessPosition(chessGameRef.current.fen());
            setPromotionMove(null);
          }}
        >
          Reset Position
        </button>

        <div style={{ position: 'relative' }}>
          {promotionMove ? (
            <div
              onClick={() => setPromotionMove(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setPromotionMove(null);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            />
          ) : null}

          {promotionMove ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: promotionSquareLeft,
                backgroundColor: 'white',
                width: squareWidth,
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
              }}
            >
              {(['q', 'r', 'n', 'b'] as PieceSymbol[]).map((piece) => (
                <button
                  key={piece}
                  onClick={() => {
                    onPromotionPieceSelect(piece);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {defaultPieces[
                    `w${piece.toUpperCase()}` as keyof PieceRenderObject
                  ]()}
                </button>
              ))}
            </div>
          ) : null}

          <Chessboard options={chessboardOptions} />
        </div>

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Move the white pawn to the 8th rank to trigger the promotion dialog.
          Click the reset button to return to the initial position.
        </p>
      </div>
    );
  },
};
