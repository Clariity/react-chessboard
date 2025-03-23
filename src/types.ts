export type CellDataType = {
  id: string;
  isLightSquare: boolean;
  column: string;
  row: string;
};

export type PieceDataType = {
  id: string;
  position?: { x: number; y: number };
  disabled?: boolean;
  type: PieceType;
};

export enum PieceType {
  "wP" = "wP",
  "wN" = "wN",
  "wB" = "wB",
  "wR" = "wR",
  "wQ" = "wQ",
  "wK" = "wK",
  "bP" = "bP",
  "bN" = "bN",
  "bB" = "bB",
  "bR" = "bR",
  "bQ" = "bQ",
  "bK" = "bK",
}
