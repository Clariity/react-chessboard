import { useState, useEffect, useCallback } from "react";
import { Square, PromotionOption, Piece, Promotion } from "../types";
import { getValidPawnMovesDefault } from "../functions";

const SUCCESS_MOVE = "success move";
const ILLEGAL_MOVE = "illegal move";
const MOVE_NEEDS_PROMOTION = "move needs promotion";

export const MOVE_STATUSES = {
  SUCCESS_MOVE,
  ILLEGAL_MOVE,
  MOVE_NEEDS_PROMOTION,
};
export type Move = {
  from: Square;
  to: Square;
  piece: Piece;
  promotion?: PromotionOption;
};

type HandleMoveWithPossiblePromotion = (move: Move) => {
  status: typeof SUCCESS_MOVE | typeof ILLEGAL_MOVE | typeof MOVE_NEEDS_PROMOTION;
};

interface UsePromotionHookProps {
  /**
   * User function which makes chess move and changes position of the game. Returns `false` if move is illegal, and `true` otherwise
   * */
  onMakeMove: (move: Move) => boolean;
  /**
   * User function which returns list of squares where the piece from given square can move to. We need this function to
   * properly determine when to open promotion dialog
   */
  getValidPawnMoves?: (square: Square) => Array<Square>;
  /** Wheter or not promote pawns to queen automatically */
  autoPromoteToQueen?: boolean;
}

interface UsePromotionHookState {
  /** Function determines possible pawn promotions and opens promotion dialog */
  handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion;
  /** Function closes promotion dialog and resets its state to initial */
  closePromotionDialog: () => void;
  /** Basic data for rendering promotion dialog */
  promotionState: Promotion;
}

export const usePromotion = ({
  onMakeMove,
  getValidPawnMoves = getValidPawnMovesDefault,
  autoPromoteToQueen = false,
}: UsePromotionHookProps): UsePromotionHookState => {
  const [promotion, setPromotion] = useState<Partial<Promotion>>({
    isDialogOpen: false,
    autoPromoteToQueen,
  });

  useEffect(() => {
    setPromotion((p) => ({ ...p, autoPromoteToQueen }));
  }, [autoPromoteToQueen]);

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

  //function for handling user's promotion choice
  const onPromotionSelect = useCallback(
    (newPiece: PromotionOption): void => {
      const { fromSquare, targetSquare, piece } = promotion;

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

        setPromotion((p) => ({ ...p, isDialogOpen: false, piece: undefined }));
      }
    },
    [onMakeMove, autoPromoteToQueen]
  );

  // function for handling user's game moves
  const handleMoveWithPossiblePromotion: HandleMoveWithPossiblePromotion = useCallback(
    (move) => {
      const { from, to, promotion, piece } = move;

      if (!piece) {
        return { status: ILLEGAL_MOVE };
      }

      // open promotion dialog if pawn can be promoted
      if (!autoPromoteToQueen && !promotion && canPromotePawn(move)) {
        setPromotion({
          isDialogOpen: true,
          fromSquare: from,
          targetSquare: to,
          piece,
        });

        return { status: MOVE_NEEDS_PROMOTION };
      } else {
        if (autoPromoteToQueen && !move.promotion) {
          move.promotion = "q";
        }
        const isMoveCompletedSuccessfully = onMakeMove(move);
        closePromotionDialog();

        return { status: isMoveCompletedSuccessfully ? SUCCESS_MOVE : ILLEGAL_MOVE };
      }
    },
    [onMakeMove, autoPromoteToQueen]
  );

  // function which closes promotion dialog and resets promotion state
  const closePromotionDialog = () => {
    if (promotion.isDialogOpen) {
      setPromotion({
        ...promotion,
        isDialogOpen: false,
        piece: undefined,
        targetSquare: undefined,
      });
    }
  };

  return {
    handleMoveWithPossiblePromotion,
    closePromotionDialog,
    promotionState: {
      ...promotion,
      isDialogOpen: Boolean(promotion.isDialogOpen),
      onPromotionSelect,
    },
  };
};
