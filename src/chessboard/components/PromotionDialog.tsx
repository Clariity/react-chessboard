import { CSSProperties } from "react";
import { useChessboard } from "../context/chessboard-context";
import { getRelativeCoords } from "../functions";
import {
  PromotionPieceOption,
  PromotionDialogVariantsEnum,
  PromotionDialogVariant,
  Square,
  BoardOrientation,
} from "../types";
import { PromotionOption } from "./PromotionOption";

type GetDialogStylesByVariantFn = (props: {
  promotionDialogVariant: PromotionDialogVariant;
  promoteToSquare: Square;
  boardWidth: number;
  boardOrientation: BoardOrientation;
  dialogCoords: {
    x: number;
    y: number;
  };
}) => CSSProperties;

const getDialogStylesByVariant: GetDialogStylesByVariantFn = ({
  promotionDialogVariant,
  promoteToSquare,
  boardWidth,
  boardOrientation,
  dialogCoords,
}: any) => {
  switch (promotionDialogVariant) {
    case PromotionDialogVariantsEnum.Default:
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        transform: `translate(${-boardWidth / 8}px, ${-boardWidth / 8}px)`,
      };
    case PromotionDialogVariantsEnum.Vertical:
      const isPromotionOnTheBottomRank =
        (boardOrientation === "black" && promoteToSquare[1] === "8") ||
        (boardOrientation === "white" && promoteToSquare[1] === "1");

      return {
        display: "flex",
        flexDirection: isPromotionOnTheBottomRank ? "column-reverse" : "column",
        transform: `translate(${-boardWidth / 16}px, ${-boardWidth / 16}px)`,
        top: isPromotionOnTheBottomRank
          ? `${dialogCoords.y - 0.375 * boardWidth}px`
          : `${dialogCoords.y}px`,
      };
    case PromotionDialogVariantsEnum.Modal:
      return {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translate(0px, ${(3 * boardWidth) / 8}px)`,
        width: "100%",
        height: `${boardWidth / 4}px`,
        top: 0,
        backgroundColor: "white",
        left: 0,
      };
    default:
      return {};
  }
};

export function PromotionDialog() {
  const {
    boardOrientation,
    boardWidth,
    promotionDialogVariant,
    promoteToSquare,
  } = useChessboard();

  if (!promoteToSquare) return null;

  const promotePieceColor = promoteToSquare?.[1] === "1" ? "b" : "w";
  const promotionOptions: PromotionPieceOption[] = [
    `${promotePieceColor ?? "w"}Q`,
    `${promotePieceColor ?? "w"}R`,
    `${promotePieceColor ?? "w"}N`,
    `${promotePieceColor ?? "w"}B`,
  ];

  const dialogCoords = getRelativeCoords(
    boardOrientation,
    boardWidth,
    promoteToSquare,
  );

  return (
    <div
      style={{
        position: "absolute",
        top: `${dialogCoords.y}px`,
        left: `${dialogCoords.x}px`,
        zIndex: 1000,
        ...getDialogStylesByVariant({
          promotionDialogVariant,
          boardWidth,
          promoteToSquare,
          dialogCoords,
          boardOrientation,
        }),
      }}
      title="Choose promotion piece"
    >
      {promotionOptions.map((option) => (
        <PromotionOption key={option} option={option} />
      ))}
    </div>
  );
}
