import type { FC, ReactElement, ReactNode, Ref, RefObject } from "react";
import { BackendFactory } from "dnd-core";

export type Square =
  | "a8"
  | "b8"
  | "c8"
  | "d8"
  | "e8"
  | "f8"
  | "g8"
  | "h8"
  | "a7"
  | "b7"
  | "c7"
  | "d7"
  | "e7"
  | "f7"
  | "g7"
  | "h7"
  | "a6"
  | "b6"
  | "c6"
  | "d6"
  | "e6"
  | "f6"
  | "g6"
  | "h6"
  | "a5"
  | "b5"
  | "c5"
  | "d5"
  | "e5"
  | "f5"
  | "g5"
  | "h5"
  | "a4"
  | "b4"
  | "c4"
  | "d4"
  | "e4"
  | "f4"
  | "g4"
  | "h4"
  | "a3"
  | "b3"
  | "c3"
  | "d3"
  | "e3"
  | "f3"
  | "g3"
  | "h3"
  | "a2"
  | "b2"
  | "c2"
  | "d2"
  | "e2"
  | "f2"
  | "g2"
  | "h2"
  | "a1"
  | "b1"
  | "c1"
  | "d1"
  | "e1"
  | "f1"
  | "g1"
  | "h1";

export type Piece =
  | "wP"
  | "wB"
  | "wN"
  | "wR"
  | "wQ"
  | "wK"
  | "bP"
  | "bB"
  | "bN"
  | "bR"
  | "bQ"
  | "bK";

export type BoardPosition = { [square in Square]?: Piece };

export type PromotionPieceOption =
  | "wQ"
  | "wR"
  | "wN"
  | "wB"
  | "bQ"
  | "bR"
  | "bN"
  | "bB";
export type PromotionStyle = "default" | "vertical" | "modal";

export type CustomSquareProps = {
  children: ReactNode;
  // Allow user to specify their outer element
  // Opting not to use generics for simplicity
  ref: Ref<any>;
  square: Square;
  squareColor: "white" | "black";
  style: Record<string, string | number>;
};

export type CustomSquareRenderer =
  | FC<CustomSquareProps>
  | keyof JSX.IntrinsicElements;

export type CustomPieceFnArgs = {
  isDragging: boolean;
  squareWidth: number;
  square?: Square;
};

export type CustomPieceFn = (args: CustomPieceFnArgs) => ReactElement;

export type CustomPieces = {
  [key in Piece]?: CustomPieceFn;
};

export type CustomSquareStyles = {
  [key in Square]?: Record<string, string | number>;
};

export type BoardOrientation = "white" | "black";

export type DropOffBoardAction = "snapback" | "trash";

export type Coords = { x: number; y: number };

export type Arrow = [Square, Square, string?];

export type ChessboardProps = {
  /**
   * Whether or not the piece can be dragged outside of the board
   * @default true
   * */
  allowDragOutsideBoard?: boolean;
  /**
   * Time in milliseconds for piece to slide to target square. Only used when the position is programmatically changed. If a new position is set before the animation is complete, the board will cancel the current animation and snap to the new position.
   * @default 300
   */
  animationDuration?: number;
  /**
   * Whether or not arrows can be drawn with right click and dragging.
   * @default true
   */
  areArrowsAllowed?: boolean;
  /**
   * Whether or not all pieces are draggable.
   * @default true
   */
  arePiecesDraggable?: boolean;
  /**
   * Whether or not premoves are allowed.
   * @default false
   */
  arePremovesAllowed?: boolean;
  /**
   * Whether or not to automatically promote pawn to queen
   * @default false
   */
  autoPromoteToQueen?: boolean;
  /**
   * The orientation of the board, the chosen colour will be at the bottom of the board.
   * @default white
   */
  boardOrientation?: BoardOrientation;
  /**
   * The width of the board in pixels.
   */
  boardWidth?: number;
  /**
   * If premoves are allowed, whether or not to clear the premove queue on right click.
   * @default true
   */
  clearPremovesOnRightClick?: boolean;
  /**
   * Array where each element is a tuple containing two Square values (representing the 'from' and 'to' squares) and an optional third string element for the arrow color
   * e.g. [ ['a3', 'a5', 'red'], ['b1, 'd5] ].
   * If third element in array is missing arrow will have `customArrowColor` or default color value
   * @default []
   */
  customArrows?: Arrow[];
  /**
   * String with rgb or hex value to colour drawn arrows.
   * @default rgb(255,170,0)
   */
  customArrowColor?: string;
  /**
   * Custom board style object e.g. { borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'}.
   * @default {}
   */
  customBoardStyle?: Record<string, string | number>;
  /**
   * Custom notation style object e.g. { fontSize: '12px' }
   * @default {}
   */
  customNotationStyle?: Record<string, string | number>;
  /**
   * Custom dark square style object.
   * @default { backgroundColor: "#B58863" }
   */
  customDarkSquareStyle?: Record<string, string>;
  /**
   * Custom react-dnd backend to use instead of the one provided by react-chessboard.
   */
  customDndBackend?: BackendFactory;
  /**
   * Options to use for the given custom react-dnd backend. See customDndBackend.
   */
  customDndBackendOptions?: unknown;
  /**
   * Custom drop square style object (Square being hovered over with dragged piece).
   * @default { boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)" }
   */
  customDropSquareStyle?: Record<string, string | number>;
  /**
   * Custom light square style object.
   * @default { backgroundColor: "#F0D9B5" }
   */
  customLightSquareStyle?: Record<string, string>;
  /**
   * Custom pieces object where each key must match a corresponding chess piece (wP, wB, wN, wR, wQ, wK, bP, bB, bN, bR, bQ, bK). The value of each piece is a function that takes in some optional arguments to use and must return JSX to render. e.g. { wK: ({ isDragging: boolean, squareWidth: number }) => jsx }.
   * @default {}
   */
  customPieces?: CustomPieces;
  /**
   * Custom premove dark square style object.
   * @default { backgroundColor: "#A42323" }
   */
  customPremoveDarkSquareStyle?: Record<string, string | number>;
  /**
   * Custom premove light square style object.
   * @default { backgroundColor: "#BD2828" }
   */
  customPremoveLightSquareStyle?: Record<string, string | number>;
  /**
   * Custom square renderer for all squares.
   * @default div
   */
  customSquare?: CustomSquareRenderer;
  /**
   * Custom styles for all squares.
   * @default {}
   */
  customSquareStyles?: CustomSquareStyles;
  /**
   * Action to take when piece is dropped off the board.
   * @default snapback
   */
  dropOffBoardAction?: DropOffBoardAction;
  /**
   * Board identifier, necessary if more than one board is mounted for drag and drop.
   * @default 0
   */
  id?: string | number;
  /**
   * Function called when a piece drag is attempted. Returns if piece is draggable.
   * @default () => true
   */
  isDraggablePiece?: (args: { piece: Piece; sourceSquare: Square }) => boolean;
  /**
   * User function that receives current position object when position changes.
   * @default () => {}
   */
  getPositionObject?: (currentPosition: BoardPosition) => any;
  /**
   * User function is run when arrows are set on the board.
   * @default () => {}
   */
  onArrowsChange?: (squares: Arrow[]) => void;
  /**
   * User function that is run when piece is dragged over a square.
   * @default () => {}
   */
  onDragOverSquare?: (square: Square) => any;
  /**
   * User function that is run when mouse leaves a square.
   * @default () => {}
   */
  onMouseOutSquare?: (square: Square) => any;
  /**
   * User function that is run when mouse is over a square.
   * @default () => {}
   */
  onMouseOverSquare?: (square: Square) => any;
  /**
   * User function that is run when piece is clicked.
   * @default () => {}
   */
  onPieceClick?: (piece: Piece, square: Square) => any;
  /**
   * User function that is run when piece is grabbed to start dragging.
   * @default () => {}
   */
  onPieceDragBegin?: (piece: Piece, sourceSquare: Square) => any;
  /**
   * User function that is run when piece is let go after dragging.
   * @default () => {}
   */
  onPieceDragEnd?: (piece: Piece, sourceSquare: Square) => any;
  /**
   * User function that is run when piece is dropped on a square. Must return whether the move was successful or not.
   * @default () => true
   */
  onPieceDrop?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  /**
   * User function that is run when piece is dropped. Must return whether the move results in a promotion or not.
   * @default (sourceSquare, targetSquare, piece) => (((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") ||
   *                                                  (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) &&
   *                                                  Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <= 1)
   */
  onPromotionCheck?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  /**
   * User function that is run when a promotion piece is selected. Must return whether the move was successful or not.
   * @default () => true
   */
  onPromotionPieceSelect?: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  /**
   * User function that is run when a square is clicked.
   * @default () => {}
   */
  onSquareClick?: (square: Square, piece: Piece | undefined) => any;
  /**
   * User function that is run when a square is right clicked.
   * @default () => {}
   */
  onSquareRightClick?: (square: Square) => any;
  /**
   * FEN string or position object notating where the chess pieces are on the board. Start position can also be notated with the string: 'start'.
   * @default start
   */
  position?: string | BoardPosition;
  /**
   * Style of promotion dialog.
   * @default default
   */
  promotionDialogVariant?: PromotionStyle;
  /**
   * The square to promote a piece to.
   * @default null
   */
  promotionToSquare?: Square | null;
  /**
   * RefObject that is sent as forwardRef to chessboard.
   */
  ref?: RefObject<HTMLDivElement>;
  /**
   * Whether or not to show the file and rank co-ordinates (a..h, 1..8).
   * @default true
   */
  showBoardNotation?: boolean;
  /**
   * Whether or not to show the promotion dialog.
   * @default false
   */
  showPromotionDialog?: boolean;
  /**
   * Whether or not to center dragged pieces on the mouse cursor.
   * @default true
   */
  snapToCursor?: boolean;
};
