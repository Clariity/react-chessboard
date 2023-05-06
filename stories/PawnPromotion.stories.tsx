import React, { useRef, useState, useEffect } from "react";
import { ComponentMeta } from "@storybook/react";
import Chess from "chess.js";

import { Chessboard, ClearPremoves } from "../src";
import { usePromotion, Move, MOVE_STATUSES } from "../src/chessboard/hooks/usePromotion";
import { Piece } from "../src/chessboard/types";
import { PromotionStyle } from "../src/chessboard/types/index";
import { PROMOTION_STYLES_ENUM } from "../src/chessboard/consts";

const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};

const pieceObjectToPieceNotation = (pieceObject: {
  type: string;
  color: "w" | "b";
}): Piece => {
  if (!pieceObject) return;
  return (pieceObject.color + pieceObject.type.toUpperCase()) as Piece;
};

type PawnPromotionExampleProps = {
  autoPromoteToQueen: boolean;
  promotionVariant: PromotionStyle;
};
const PawnPromotionExample = (args: PawnPromotionExampleProps) => {
  // @ts-ignore whats wrong with this line?
  const [game, setGame] = useState(new Chess("8/PPP5/1K4kq/8/8/8/8/8 w - - 0 1"));
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  const chessboardRef = useRef<ClearPremoves>(null);

  function onMakeMove({ from, to, promotion }: Move): boolean {
    const gameCopy = { ...game };
    const move = gameCopy.move({ from, to, promotion });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // legal move
    return true;
  }

  const { handleMoveWithPossiblePromotion, promotionState } = usePromotion({
    onMakeMove,
    autoPromoteToQueen: args.autoPromoteToQueen,
    getValidPawnMoves: (square) =>
      game.moves({ square, verbose: true }).map((move) => move.to),
  });
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

  function onDrop(sourceSquare, targetSquare, piece, promotion) {
    const pieceObject = game.get(sourceSquare);
    const { status } = handleMoveWithPossiblePromotion({
      from: sourceSquare,
      to: targetSquare,
      piece: piece ?? pieceObjectToPieceNotation(pieceObject),
      promotion,
    });

    return status === MOVE_STATUSES.SUCCESS_MOVE;
  }

  useEffect(() => {
    if (game.turn() === "b") {
      // store timeout so it can be cleared on undo/reset so computer doesn't execute move
      const newTimeout = setTimeout(makeRandomMove, 3000);
      setCurrentTimeout(newTimeout);
    }
  }, [game.turn()]);

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="PawnPromotion"
        arePremovesAllowed={true}
        position={game.fen()}
        isDraggablePiece={({ piece }) => piece[0] === "w"}
        onPieceDrop={onDrop}
        ref={chessboardRef}
        promotion={{ ...promotionState, promotionDialogStyle: args.promotionVariant }}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          // clear premove queue
          chessboardRef.current?.clearPremoves();
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          // undo twice to undo computer move too
          safeGameMutate((game) => {
            game.undo();
            game.undo();
          });
          // clear premove queue
          chessboardRef.current?.clearPremoves();
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        undo
      </button>
    </div>
  );
};

export const PromotionStory = {
  render: PawnPromotionExample,
  argTypes: {
    promotionVariant: {
      options: PROMOTION_STYLES_ENUM,
      control: { type: "select" },
    },
    autoPromoteToQueen: {
      options: [true, false],
      control: { type: "radio" },
    },
  },
};

export default {
  title: "Example/Chessboard Pawn promotion",
  component: PawnPromotionExample,
} as ComponentMeta<typeof Chessboard>;
