import { useState, useEffect } from 'react';
import Chess from 'chess.js';

import Chessboard from 'react-chessboard';

export default function RandomVsRandomGame() {
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  useEffect(() => {
    setTimeout(makeRandomMove, 1000);
  }, []);

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });

    setTimeout(makeRandomMove, 500);
  }

  return (
    <div>
      <Chessboard
        position={game.fen()}
        animationDuration={300}
        customBoardStyle={{
          borderRadius: '5px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
      />
    </div>
  );
}
