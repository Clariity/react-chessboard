// @ts-nocheck
import { useState, useEffect } from "react";
import { Square } from "../types";

type Piece = { type: string; color: "w" | "b" };

// checking wheter is pawn on the last lane
function isPawnInPromotionPosition({
  piece,
  targetSquare,
}: {
  piece: Piece;
  targetSquare: Square;
}): boolean {
  if (piece?.type !== "p") return false;

  const targetLine = targetSquare[1];

  if (
    (piece.color === "w" && targetLine === "8") ||
    (piece.color === "b" && targetLine === "1")
  ) {
    return true;
  }

  return false;
}

export const useChessGame = (newGame) => {
  const [game, setGame] = useState(newGame);
  const [promotion, setPromotion] = useState({
    isDialogOpen: false,
  });

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // function  checking if pawn promotion could be legal move
  const canPromotePawn = (fromSq: Square, targetSq: Square, piece: Piece): boolean => {
    let possibleMoves = game.moves({ square: fromSq, verbose: true });

    if (
      possibleMoves.find((move) => move.from === fromSq && move.to === targetSq) &&
      isPawnInPromotionPosition({
        piece,
        targetSquare: targetSq,
      })
    ) {
      return true;
    } else return false;
  };
  const closePromotionDialog = () => setPromotion({ isDialogOpen: false });

  //function for handling user's promotion choice
  const onPromotionSelect = (newPiece) => {
    setPromotion({ ...promotion, isDialogOpen: false, newPiece });
  };

  // this useEffect makes move automatically when user choose promotion piece
  useEffect(() => {
    safeGameMutate((game) => {
      game.move({
        from: promotion.fromSq,
        to: promotion.targetSq,
        promotion: promotion.newPiece,
      });
    });
  }, [promotion.newPiece]);

  // function for handling user's game moves
  const onMakeMove = (move) => {
    const { from, to, promotion } = move;

    const piece = game.get(from) ?? {};

    if (!piece) {
      return { status: "illegal move" };
    }

    // open promotion dialog if pawn can be promoted
    if (!promotion && canPromotePawn(from, to, piece)) {
      setPromotion({
        isDialogOpen: true,
        fromSq: from,
        targetSq: to,
        color: piece.color,
      });

      return { status: "select promotion" };
    } else {
      // check is move legal
      const tryMove = { ...game }.move({ from, to, promotion });
      if (tryMove === null) {
        return { status: "illegal move" };
      }
      // make move and change game state
      const res = safeGameMutate((game) => game.move({ from, to, promotion }));

      return { status: "success" };
    }
  };

  return {
    game,
    onMakeMove,
    safeGameMutate,
    promotion: {
      onPromotionSelect,
      closePromotionDialog,
      isDialogOpen: promotion.isDialogOpen,
      targetSquare: promotion.targetSq,
      color: promotion.color,
    },
  };
};
