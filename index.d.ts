import { CSSProperties, ReactElement } from 'react';

interface CustomPieceFnArgs {
  isDragging: boolean;
  squareWidth: number;
  droppedPiece: string;
  targetSquare: string;
  sourceSquare: string;
}
type CustomPieceFn = (args: CustomPieceFnArgs) => ReactElement;

interface CustomPieces {
  wP?: CustomPieceFn;
  wB?: CustomPieceFn;
  wN?: CustomPieceFn;
  wR?: CustomPieceFn;
  wQ?: CustomPieceFn;
  wK?: CustomPieceFn;
  bP?: CustomPieceFn;
  bB?: CustomPieceFn;
  bN?: CustomPieceFn;
  bR?: CustomPieceFn;
  bQ?: CustomPieceFn;
  bK?: CustomPieceFn;
}

type Pieces = 'wP' | 'wB' | 'wN' | 'wR' | 'wQ' | 'wK' | 'bP' | 'bB' | 'bN' | 'bR' | 'bQ' | 'bK';

interface ChessBoardProps {
  /**
   * Time in milliseconds for piece to slide to target square. Only used when the position is programmatically changed. If a new position is set before the animation is complete, the board will cancel the current animation and snap to the new position.
   */
  animationDuration?: number;
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
   * Custom board style object e.g. { borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 '}.
   */
  customBoardStyle?: CSSProperties;
  /**
   * Custom dark square style object.
   */
  customDarkSquareStyle?: CSSProperties;
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
  customSquareStyles?: CSSProperties;
  /**
   * Whether the board should expect alternate coloured moves or allow for any piece to be moved at any time.
   */
  expectingAlternateMoves?: boolean;
  /**
   * Board identifier, necessary if more than one board is mounted for drag and drop.
   */
  id?: number;
  /**
   * Function called when a piece drag is attempted. Returns if piece is draggable.
   */
  isDraggablePiece?: (args: { piece: Pieces; sourceSquare: string }) => boolean;
  /**
   * User function that receives current position object when position changes.
   */
  getPositionObject?: (currentPosition: { [name: string]: Pieces }) => any;
  /**
   * User function that is run when piece is dragged over a square.
   */
  onDragOverSquare?: (square: string) => any;
  /**
   * User function that is run when mouse leaves a square.
   */
  onMouseOutSquare?: (square: string) => any;
  /**
   * User function that is run when mouse is over a square.
   */
  onMouseOverSquare?: (square: string) => any;
  /**
   * User function that is run when piece is clicked.
   */
  onPieceClick?: (piece: Pieces) => any;
  /**
   * User function that is run when piece is dropped on a square. Must return whether the move was successful or not.
   */
  onPieceDrop?: (sourceSquare: string, targetSquare: string, piece: Pieces) => boolean;
  /**
   * User function that is run when a square is clicked.
   */
  onSquareClick?: (square: string) => any;
  /**
   * User function that is run when a square is right clicked.
   */
  onSquareRightClick?: (square: string) => any;
  /**
   * FEN string or position object notating where the chess pieces are on the board. Start position can also be notated with the string: 'start'.
   */
  position?: string;
  /**
   * Whether or not to show the file and rank co-ordinates (a..h, 1..8).
   */
  showBoardNotation?: boolean;
}
export function Chessboard(props: ChessBoardProps): ReactElement;
