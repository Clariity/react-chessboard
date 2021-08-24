import { useState } from 'react';
import Chess from 'chess.js';

// import Chessboard from '../react-chessboard/src';
import Chessboard from 'react-chessboard';

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());
  const [customDarkSquareStyle, setCustomDarkSquareStyle] = useState({ backgroundColor: '#B58863' });

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

    setTimeout(makeRandomMove, 200);
  }

  return (
    <div>
      <button
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
        }}
      >
        undo
      </button>
      <button
        onClick={() => {
          setCustomDarkSquareStyle({ backgroundColor: '#E58863' });
        }}
      >
        change colour
      </button>
      <Chessboard
        animationDuration={200}
        customDarkSquareStyle={customDarkSquareStyle}
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
      />
    </div>
  );
}
