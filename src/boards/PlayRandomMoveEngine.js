import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import Chess from 'chess.js';

import Chessboard from '../Chessboard';

export default function PlayRandomMoveEngine({ boardSize }) {
  const [game, setGame] = useState(new Chess());

  // useEffect(() => {
  //   console.log(game.ascii());
  // }, [game]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
    // setFen(game.fen());
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });

    // illegal move
    if (move === null) return;

    // setFen(game.fen());
    setTimeout(makeRandomMove, 200);
  }

  return (
    <div>
      <button
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          // setFen(game.fen());
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
          // game.undo();
          // setFen(game.fen());
        }}
      >
        undo
      </button>
      <Chessboard
        animationDuration={200}
        boardWidth={boardSize}
        id="humanVsRandom"
        position={game.fen()}
        onPieceDrop={onDrop}
        boardStyle={{
          borderRadius: '5px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
      />
    </div>
  );
}
