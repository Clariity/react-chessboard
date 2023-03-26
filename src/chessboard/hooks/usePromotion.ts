import { useState, useEffect, useCallback } from "react";
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
  isPremove?: boolean;
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

const getValidPawnMovesDefault = (square: Square): Array<Square> => {
  const [squareFile, squareLine] = square;
  const possibleFiles = possiblePromotionFilesFromFile.get(squareFile);
  const possibleLine = Number(squareLine) === 7 ? 8 : 1;
  if (!possibleFiles) return [];

  return possibleFiles.map((file: string) => (file + possibleLine) as Square);
};

export const usePromotion = ({
  onMakeMove,
  getValidPawnMoves = getValidPawnMovesDefault,
  autoPromoteToQueen = false,
}: {
  onMakeMove: (move: Move) => boolean;
  getValidPawnMoves?: (square: Square) => Array<Square>;
  autoPromoteToQueen?: boolean;
}): {
  handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion;
  promotion: Promotion;
} => {
  const [promotion, setPromotion] = useState<Partial<PromotionState>>({
    isDialogOpen: false,
  });

  // function  checking if pawn promotion could be legal move
  const canPromotePawn = (
    move: Move,
    promotionValidator: (square: Square) => Array<Square> = getValidPawnMoves
  ): boolean => {
    const { to: targetSquare, from: fromSquare, piece } = move;
    if (!piece || !targetSquare || !fromSquare) return false;
    const [pieceColor, pieceType] = piece;
    if (pieceType !== "P") return false;

    const [, targetLine] = targetSquare;
    const [, fromLine] = fromSquare;
    const isPromotionValidMove = promotionValidator(fromSquare).includes(targetSquare);

    if (!isPromotionValidMove) {
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

  // function closes promotion dialog
  const closePromotionDialog = () => {
    if (promotion.isDialogOpen) {
      setPromotion({ ...promotion, isDialogOpen: false, newPiece: undefined });
    }
  };

  //function for handling user's promotion choice
  const onPromotionSelect = (newPiece: PromotionOption): void => {
    setPromotion({ ...promotion, isDialogOpen: false, newPiece });
  };

  // this useEffect makes move automatically when user choose promotion piece
  useEffect(() => {
    const { fromSquare, targetSquare, piece, newPiece, isPremove } = promotion;

    if (isPremove) {
      // setPremovePromotionPieces([...premovedPromotionPieces, promotion.newPiece]);
      return;
    }

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

      setPromotion({ isDialogOpen: false });
    }
  }, [promotion.newPiece]);

  // function for handling user's game moves
  const handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion = useCallback(
    (move) => {
      const { from, to, promotion, piece } = move;

      if (!piece) {
        return { status: "illegal move" };
      }

      // open promotion dialog if pawn can be promoted
      if (!autoPromoteToQueen && !promotion && canPromotePawn(move)) {
        setPromotion({
          isDialogOpen: true,
          fromSquare: from,
          targetSquare: to,
          piece,
        });

        return { status: "need promotion" };
      } else {
        if (autoPromoteToQueen && !move.promotion) {
          move.promotion = "q";
        }
        const isMoveCompletedSuccessfully = onMakeMove(move);

        return { status: isMoveCompletedSuccessfully ? "success" : "illegal move" };
      }
    },
    [autoPromoteToQueen, onMakeMove]
  );

  const handlePremoveWithPossiblePromotion = (premove: Move) => {
    const { from, to, piece } = premove;
    if (!autoPromoteToQueen && canPromotePawn(premove, getValidPawnMovesDefault)) {
      setPromotion({
        isDialogOpen: true,
        fromSquare: from,
        targetSquare: to,
        piece,
        isPremove: true,
      });

      return true;
    }

    return false;
  };

  return {
    handleMoveWithPossiblePromotion,
    promotion: {
      ...promotion,
      isDialogOpen: Boolean(promotion.isDialogOpen),
      onPromotionSelect,
      closePromotionDialog,
      handlePremoveWithPossiblePromotion,
    },
  };
};
