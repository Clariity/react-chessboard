import { useState, useEffect } from "react";
import { Square, PromotionOption, Piece, Promotion } from "../types";

export type Move = {
  from: Square;
  to: Square;
  piece: Piece;
  promotion?: PromotionOption;
};

type HandleMoveWithPossiblePromotion = (move: Move) => {
  status: "success" | "illegal move" | "need promotion";
};

type PromotionState = {
  isDialogOpen: boolean;
  fromSquare: Square;
  targetSquare: Square;
  newPiece: PromotionOption;
  piece: Piece;
};

const possiblePromotionFilesFromFile = new Map<string, Array<string>>([
  ["a", ["a", "b"]],
  ["b", ["a", "b", "c"]],
  ["c", ["b", "c", "d"]],
  ["d", ["c", "d", "e"]],
  ["e", ["d", "e", "f"]],
  ["f", ["e", "f", "g"]],
  ["g", ["f", "g", "h"]],
  ["h", ["g", "h"]],
]);

export const usePromotion = ({
  onMakeMove,
}: {
  onMakeMove: (move: Move) => boolean;
}): {
  handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion;
  promotion: Promotion;
} => {
  const [promotion, setPromotion] = useState<Partial<PromotionState>>({
    isDialogOpen: false,
  });

  // function  checking if pawn promotion could be legal move
  const canPromotePawn = (move: Move): boolean => {
    const { to: targetSquare, from: fromSquare, piece } = move;
    if (!piece || !targetSquare || !fromSquare) return false;
    const [pieceColor, pieceType] = piece;
    if (pieceType !== "P") return false;

    const [targetFile, targetLine] = targetSquare;
    const [fromFile, fromLine] = fromSquare;

    if (!possiblePromotionFilesFromFile.get(fromFile)?.includes(targetFile)) {
      return false;
    }

    if (
      (pieceColor === "w" && targetLine === "8" && fromLine === "7") ||
      (pieceColor === "b" && targetLine === "1" && fromLine === "2")
    ) {
      return true;
    }

    return false;
  };

  const closePromotionDialog = () => setPromotion({ isDialogOpen: false });

  //function for handling user's promotion choice
  const onPromotionSelect = (newPiece: PromotionOption): void => {
    setPromotion({ ...promotion, isDialogOpen: false, newPiece });
  };

  // this useEffect makes move automatically when user choose promotion piece
  useEffect(() => {
    const { fromSquare, targetSquare, piece, newPiece } = promotion;
    if (
      fromSquare &&
      targetSquare &&
      (piece === "wP" || piece === "bP") &&
      canPromotePawn({
        from: fromSquare,
        to: targetSquare,
        piece,
      })
    ) {
      onMakeMove({
        from: fromSquare,
        to: targetSquare,
        promotion: newPiece,
        piece,
      });
    }
  }, [promotion.newPiece]);

  // function for handling user's game moves
  const handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion = (move) => {
    const { from, to, promotion, piece } = move;

    if (!piece) {
      return { status: "illegal move" };
    }

    // open promotion dialog if pawn can be promoted
    if (!promotion && canPromotePawn(move)) {
      setPromotion({
        isDialogOpen: true,
        fromSquare: from,
        targetSquare: to,
        piece,
      });

      return { status: "need promotion" };
    } else {
      const isMoveCompletedSuccessfully = onMakeMove(move);

      return { status: isMoveCompletedSuccessfully ? "success" : "illegal move" };
    }
  };

  return {
    handleMoveWithPossiblePromotion,
    promotion: {
      onPromotionSelect,
      closePromotionDialog,
      isDialogOpen: Boolean(promotion.isDialogOpen),
      targetSquare: promotion.targetSquare,
      piece: promotion.piece,
    },
  };
};
