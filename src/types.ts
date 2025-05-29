export type SquareDataType = {
  squareId: string; // e.g. "a8"
  isLightSquare: boolean;
};

export type PieceDataType = {
  pieceType: PieceType; // e.g. "wP" for white pawn, "bK" for black king
};

export type DraggingPieceDataType = {
  isSparePiece: boolean;
  position: string | PieceType; // e.g. "a8" or "wP"
  pieceType: PieceType; // e.g. "wP" for white pawn, "bK" for black king
};

export type PositionDataType = {
  [square: string]: PieceDataType;
};

export type SquareHandlerArgs = {
  piece: PieceDataType | null;
  square: string;
};

export type PieceHandlerArgs = {
  isSparePiece: boolean;
  piece: PieceDataType;
  square: string | null;
};

export type PieceDropHandlerArgs = {
  piece: DraggingPieceDataType;
  sourceSquare: string;
  targetSquare: string | null;
};

export type PieceRenderObject = Record<PieceType, () => React.JSX.Element>;

export type FenPieceString =
  | 'p'
  | 'r'
  | 'n'
  | 'b'
  | 'q'
  | 'k'
  | 'P'
  | 'R'
  | 'N'
  | 'B'
  | 'Q'
  | 'K';

export enum PieceType {
  'wP' = 'wP',
  'wN' = 'wN',
  'wB' = 'wB',
  'wR' = 'wR',
  'wQ' = 'wQ',
  'wK' = 'wK',
  'bP' = 'bP',
  'bN' = 'bN',
  'bB' = 'bB',
  'bR' = 'bR',
  'bQ' = 'bQ',
  'bK' = 'bK',
}
