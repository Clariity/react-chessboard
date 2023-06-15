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

  const dialogStyles = {
    default: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      transform: `translate(${-boardWidth / 8}px, ${-boardWidth / 8}px)`,
    },
    vertical: {
      transform: `translate(${-boardWidth / 16}px, ${-boardWidth / 16}px)`,
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
    promoteToSquare || "a8"
  );

  return (
    <div
      style={{
        position: "absolute",
        top: `${dialogCoords?.y}px`,
        left: `${dialogCoords?.x}px`,
        zIndex: 1000,
        ...dialogStyles[promotionDialogVariant],
      }}
      title="Choose promotion piece"
    >
      {promotionOptions.map((option) => (
        <PromotionOption key={option} option={option} />
      ))}
    </div>
  );
}
