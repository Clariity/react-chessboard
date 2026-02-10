export type Arrow = {
  startSquare: string; // e.g. "a8"
  endSquare: string; // e.g. "a7"
  color: string; // e.g. "#000000"
};

export type SquareDataType = {
  squareId: string; // e.g. "a8"
  isLightSquare: boolean;
};

export type PieceDataType = {
  pieceType: string; // e.g. "wP" for white pawn, "bK" for black king
};

export type DraggingPieceDataType = {
  isSparePiece: boolean;
  position: string; // e.g. "a8" or "wP" (for spare pieces)
  pieceType: string; // e.g. "wP" for white pawn, "bK" for black king
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

export type SquareRenderer = ({
  piece,
  square,
  children,
}: SquareHandlerArgs & { children?: React.ReactNode }) => React.JSX.Element;

export type PieceRenderObject = Record<
  string,
  (props?: {
    fill?: string;
    square?: string;
    svgStyle?: React.CSSProperties;
  }) => React.JSX.Element
>;

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
