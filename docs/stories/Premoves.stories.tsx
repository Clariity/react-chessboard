import type { Meta, StoryObj } from '@storybook/react';
import { Chess } from 'chess.js';
import { useState, useRef, useEffect } from 'react';

import defaultMeta from './Default.stories';
import { Chessboard, fenStringToPositionObject } from '../../src';
import { PieceDropHandlerArgs, PieceHandlerArgs } from '../../src/types';

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: 'stories/Premoves',
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Premoves: Story = {
  render: () => {
    const [chessGame, setChessGame] = useState(new Chess());
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([]);
    const [showAnimations, setShowAnimations] = useState(true);
    const chessGameRef = useRef(chessGame);
    const premovesRef = useRef<PieceDropHandlerArgs[]>([]);

    // update the ref when the game state changes
    useEffect(() => {
      chessGameRef.current = chessGame;
    }, [chessGame]);

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves
      const possibleMoves = chessGameRef.current.moves();

      // exit if the game is over
      if (chessGameRef.current.isGameOver()) {
        return;
      }

      // make a random move
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      chessGameRef.current.move(randomMove);
      setChessGame(new Chess(chessGameRef.current.fen()));

      // if there is a premove, remove it from the list and make it once animation is complete
      if (premovesRef.current.length > 0) {
        const nextPlayerPremove = premovesRef.current[0];
        premovesRef.current.splice(0, 1);

        // wait for CPU move animation to complete
        setTimeout(() => {
          // execute the premove
          const premoveSuccessful = onPieceDrop(nextPlayerPremove);

          // if the premove was not successful, clear all premoves
          if (!premoveSuccessful) {
            premovesRef.current = [];
          }

          // update the premoves state
          setPremoves([...premovesRef.current]);

          // disable animations while clearing premoves
          setShowAnimations(false);

          // re-enable animations after a short delay
          setTimeout(() => {
            setShowAnimations(true);
          }, 50);
        }, 300);
      }
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece,
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board) or user dropping piece onto same square
      if (!targetSquare || sourceSquare === targetSquare) {
        return false;
      }

      // check if a premove (piece isn't the color of the current player's turn)
      const pieceColor = piece.pieceType[0]; // 'w' or 'b'
      if (chessGameRef.current.turn() !== pieceColor) {
        premovesRef.current.push({ sourceSquare, targetSquare, piece });
        setPremoves([...premovesRef.current]);
        // return early to stop processing the move and return true to not animate the move
        return true;
      }

      // try to make the move
      try {
        chessGameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to a queen for example simplicity
        });

        // update the game state
        setChessGame(new Chess(chessGameRef.current.fen()));

        // make random cpu move after a slightly longer delay to allow user to premove
        setTimeout(makeRandomMove, 3000);

        // return true if the move was successful
        return true;
      } catch {
        // return false if the move was not successful
        return false;
      }
    }

    // clear all premoves on right click
    function onSquareRightClick() {
      premovesRef.current = [];
      setPremoves([...premovesRef.current]);

      // disable animations while clearing premoves
      setShowAnimations(false);

      // re-enable animations after a short delay
      setTimeout(() => {
        setShowAnimations(true);
      }, 50);
    }

    // only allow white pieces to be dragged
    function canDragPiece({ piece }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // create a position object from the fen string to split the premoves from the game state
    const position = fenStringToPositionObject(chessGame.fen(), 8, 8);
    const squareStyles: Record<string, React.CSSProperties> = {};

    // add premoves to the position object to show them on the board
    for (const premove of premoves) {
      delete position[premove.sourceSquare];
      position[premove.targetSquare!] = {
        pieceType: premove.piece.pieceType,
      };
      squareStyles[premove.sourceSquare] = {
        backgroundColor: 'rgba(255,0,0,0.2)',
      };
      squareStyles[premove.targetSquare!] = {
        backgroundColor: 'rgba(255,0,0,0.2)',
      };
    }

    // set the chessboard options
    const chessboardOptions = {
      canDragPiece,
      onPieceDrop,
      onSquareRightClick,
      position,
      showAnimations,
      squareStyles,
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  },
};
