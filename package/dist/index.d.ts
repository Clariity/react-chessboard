import { ReactElement, CSSProperties, RefObject } from 'react';
import { BackendFactory } from 'dnd-core';

type Square =
  | 'a8'
  | 'b8'
  | 'c8'
  | 'd8'
  | 'e8'
  | 'f8'
  | 'g8'
  | 'h8'
  | 'a7'
  | 'b7'
  | 'c7'
  | 'd7'
  | 'e7'
  | 'f7'
  | 'g7'
  | 'h7'
  | 'a6'
  | 'b6'
  | 'c6'
  | 'd6'
  | 'e6'
  | 'f6'
  | 'g6'
  | 'h6'
  | 'a5'
  | 'b5'
  | 'c5'
  | 'd5'
  | 'e5'
  | 'f5'
  | 'g5'
  | 'h5'
  | 'a4'
  | 'b4'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'h4'
  | 'a3'
  | 'b3'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'h3'
  | 'a2'
  | 'b2'
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'h2'
  | 'a1'
  | 'b1'
  | 'c1'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'g1'
  | 'h1';

type Pieces = 'wP' | 'wB' | 'wN' | 'wR' | 'wQ' | 'wK' | 'bP' | 'bB' | 'bN' | 'bR' | 'bQ' | 'bK';

interface CustomPieceFnArgs {
  isDragging: boolean;
  squareWidth: number;
  droppedPiece: Pieces;
  targetSquare: Square;
  sourceSquare: Square;
}

type CustomPieceFn = (args: CustomPieceFnArgs) => ReactElement;

type CustomPieces = {
  [key in Pieces]?: CustomPieceFn;
};

type CustomSquareStyles = {
  [key in Square]?: CSSProperties;
};

type CurrentPosition = {
  [key in Square]: Pieces;
};

interface ChessBoardProps {
  /**
   * Time in milliseconds for piece to slide to target square. Only used when the position is programmatically changed. If a new position is set before the animation is complete, the board will cancel the current animation and snap to the new position.
   */
  animationDuration?: number;
  /**
   * Whether or not arrows can be drawn with right click and dragging.
   */
  areArrowsAllowed?: boolean;
  /**
   * Whether or not all pieces are draggable.
   */
  arePiecesDraggable?: boolean;
  /**
   * Whether or not premoves are allowed.
   */
  arePremovesAllowed?: boolean;
  /**
   * The orientation of the board, the chosen colour will be at the bottom of the board.
   */
  boardOrientation?: 'white' | 'black';
  /**
   * The width of the board in pixels.
   */
  boardWidth?: number;
  /**
   * If premoves are allowed, whether or not to clear the premove queue on right click.
   */
  clearPremovesOnRightClick?: boolean;
  /**
   * Array of custom arrows to draw on the board. Each arrow within the array must be an array of length 2 with strings denoting the from and to square to draw the arrow e.g. [ ['a3', 'a5'], ['g1', 'f3'] ].
   */
  customArrows?: string[][];
  /**
   * String with rgb or hex value to colour drawn arrows.
   */
  customArrowColor?: string;
  /**
   * Custom board style object e.g. { borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 '}.
   */
  customBoardStyle?: CSSProperties;
  /**
   * Custom dark square style object.
   */
  customDarkSquareStyle?: CSSProperties;
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
   */
  customDropSquareStyle?: CSSProperties;
  /**
   * Custom light square style object.
   */
  customLightSquareStyle?: CSSProperties;
  /**
   * Custom pieces object where each key must match a corresponding chess piece (wP, wB, wN, wR, wQ, wK, bP, bB, bN, bR, bQ, bK). The value of each piece is a function that takes in some optional arguments to use and must return JSX to render. e.g. { wK: ({ isDragging: boolean, squareWidth: number, droppedPiece: string, targetSquare: string, sourceSquare: string }) => jsx }.
   */
  customPieces?: CustomPieces;
  /**
   * Custom premove dark square style object.
   */
  customPremoveDarkSquareStyle?: CSSProperties;
  /**
   * Custom premove light square style object.
   */
  customPremoveLightSquareStyle?: CSSProperties;
  /**
   * Custom styles for all squares.
   */
  customSquareStyles?: CustomSquareStyles;
  /**
   * Board identifier, necessary if more than one board is mounted for drag and drop.
   */
  id?: number;
  /**
   * Function called when a piece drag is attempted. Returns if piece is draggable.
   */
  isDraggablePiece?: (args: { piece: Pieces; sourceSquare: Square }) => boolean;
  /**
   * User function that receives current position object when position changes.
   */
  getPositionObject?: (currentPosition: CurrentPosition) => any;
  /**
   * User function that is run when piece is dragged over a square.
   */
  onDragOverSquare?: (square: Square) => any;
  /**
   * User function that is run when mouse leaves a square.
   */
  onMouseOutSquare?: (square: Square) => any;
  /**
   * User function that is run when mouse is over a square.
   */
  onMouseOverSquare?: (square: Square) => any;
  /**
   * User function that is run when piece is clicked.
   */
  onPieceClick?: (piece: Pieces) => any;
  /**
   * User function that is run when piece is grabbed to start dragging.
   */
  onPieceDragBegin?: (piece: Pieces, sourceSquare: Square) => any;
  /**
   * User function that is run when piece is let go after dragging.
   */
  onPieceDragEnd?: (piece: Pieces, sourceSquare: Square) => any;
  /**
   * User function that is run when piece is dropped on a square. Must return whether the move was successful or not.
   */
  onPieceDrop?: (sourceSquare: Square, targetSquare: Square, piece: Pieces) => boolean;
  /**
   * User function that is run when a square is clicked.
   */
  onSquareClick?: (square: Square) => any;
  /**
   * User function that is run when a square is right clicked.
   */
  onSquareRightClick?: (square: Square) => any;
  /**
   * FEN string or position object notating where the chess pieces are on the board. Start position can also be notated with the string: 'start'.
   */
  position?: string;
  /**
   * RefObject that is sent as forwardRef to chessboard
   */
  ref?: RefObject<HTMLDivElement>;
  /**
   * Whether or not to show the file and rank co-ordinates (a..h, 1..8).
   */
  showBoardNotation?: boolean;
  /**
   * Whether or not to center dragged pieces on the mouse cursor.
   */
  snapToCursor?: boolean;
}
declare function Chessboard(props: ChessBoardProps): ReactElement;

export { ChessBoardProps, Chessboard, CurrentPosition, CustomPieceFn, CustomPieceFnArgs, CustomPieces, CustomSquareStyles, Pieces, Square };
