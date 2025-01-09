import { useChessboard } from "../context/chessboard-context";
import { getRelativeCoords } from "../functions";
import { PromotionPieceOption } from "../types";
import { PromotionOption } from "./PromotionOption";

export function PromotionDialog() {
  const {
    boardOrientation,
    boardWidth,
    promotionDialogVariant,
    promoteToSquare,
  } = useChessboard();

  const promotePieceColor = promoteToSquare?.[1] === "1" ? "b" : "w";
  const promotionOptions: PromotionPieceOption[] = [
    `${promotePieceColor ?? "w"}Q`,
    `${promotePieceColor ?? "w"}R`,
    `${promotePieceColor ?? "w"}N`,
    `${promotePieceColor ?? "w"}B`,
  ];

  // Determines if promotion is happening on the bottom rank
  const isBottomRank =
    (boardOrientation === "white" && promoteToSquare?.[1] === "1") ||
    (boardOrientation === "black" && promoteToSquare?.[1] === "8");

  const dialogStyles = {
    default: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      transform: isBottomRank
        ? `translate(${-boardWidth / 8}px, ${+boardWidth / 8}px)`
        : `translate(${-boardWidth / 8}px, ${-boardWidth / 8}px)`,
    },
    vertical: {
      transform: isBottomRank
        ? `translate(${-boardWidth / 16}px, ${+boardWidth / 16}px)`
        : `translate(${-boardWidth / 16}px, ${-boardWidth / 16}px)`,
    },
    modal: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transform: `translate(0px, ${(3 * boardWidth) / 8}px)`,
      width: "100%",
      height: `${boardWidth / 4}px`,
      top: 0,
      backgroundColor: "white",
      left: 0,
    },
  };

  const dialogCoords = getRelativeCoords(
    boardOrientation,
    boardWidth,
    promoteToSquare || "a8",
  );

  return (
    <div
      style={{
        position: "absolute",
        // Bottom rank promotion forces the dialog to start from the bottom edge
        top: isBottomRank ? undefined : `${dialogCoords?.y}px`,
        bottom: isBottomRank ? `${boardWidth - dialogCoords?.y}px` : undefined,
        left: `${dialogCoords?.x}px`,
        zIndex: 1000,
        ...dialogStyles[promotionDialogVariant],
      }}
      title="Choose promotion piece"
    >
      {
        // Reversing the order in which piece icons appear for vertical dialog if promotion occurs on the bottom rank
        isBottomRank && promotionDialogVariant === "vertical"
          ? promotionOptions
              .reverse()
              .map((option) => <PromotionOption key={option} option={option} />)
          : promotionOptions.map((option) => (
              <PromotionOption key={option} option={option} />
            ))
      }
    </div>
  );
}
