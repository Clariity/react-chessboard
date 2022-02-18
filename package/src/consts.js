import PropTypes from 'prop-types';

export const COLUMNS = 'abcdefgh'.split('');

export const chessboardPropTypes = {
  // time in milliseconds for piece to slide to target square. Only used when the position is programmatically changed
  animationDuration: PropTypes.number,

  // whether or not arrows can be drawn with right click and dragging
  areArrowsAllowed: PropTypes.bool,

  // if pieces are draggable
  arePiecesDraggable: PropTypes.bool,

  // if premoves are allowed
  arePremovesAllowed: PropTypes.bool,

  // Orientation of the board
  boardOrientation: PropTypes.oneOf(['white', 'black']),

  // width of board in pixels. for responsive width show useChessBoardSize/useScreenSize example
  boardWidth: PropTypes.number,

  // if premoves should be cleared on right click
  clearPremovesOnRightClick: PropTypes.bool,

  // array of custom arrows to draw on the board. Each arrow within the array must be an array of length 2 with strings denoting the from and to square to draw the arrow e.g. [ ['a3', 'a5'], ['g1', 'f3'] ].
  customArrows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),

  // string with rgb or hex value to colour drawn arrows
  customArrowColor: PropTypes.string,

  // board style object e.g. { borderRadius: '5px', boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`}
  customBoardStyle: PropTypes.object,

  // dark square style object e.g. { backgroundColor: '#B58863' }
  customDarkSquareStyle: PropTypes.object,

  // current drop square style object e.g. { backgroundColor: 'sienna' }
  customDropSquareStyle: PropTypes.object,

  // light square style object e.g. { backgroundColor: '#F0D9B5' }
  customLightSquareStyle: PropTypes.object,

  // pieces object where each piece returns JSX to render. { wK: ({ isDragging: boolean, squareWidth: pixels, droppedPiece: piece string, targetSquare: square string, sourceSquare: square string }) => jsx }
  customPieces: PropTypes.object,

  // premove highlight dark square style object e.g. { backgroundColor: '#F0D9B5' }
  customPremoveDarkSquareStyle: PropTypes.object,

  // premove highlight light square style object e.g. { backgroundColor: '#F0D9B5' }
  customPremoveLightSquareStyle: PropTypes.object,

  // custom squares style object. e.g. {'e4': {backgroundColor: 'orange'}, ...}
  customSquareStyles: PropTypes.object,

  // behavior of pieces when dropped off the board. 'snapback' brings the piece back to it's original square, 'trash' deletes the piece from the board
  dropOffBoardAction: PropTypes.oneOf(['snapback', 'trash']),

  // board identifier, necessary if more than one board is mounted for drag and drop.
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // function called when a piece drag is initiated. Returns if piece is draggable ({ piece: string, sourceSquare: string }) => bool
  isDraggablePiece: PropTypes.func,

  // user function that receives current position object when position changes. (currentPosition: object) => void
  getPositionObject: PropTypes.func,

  // user function that is run when piece is dragged over a square (square: string) => void
  onDragOverSquare: PropTypes.func,

  // user function that is run when mouse leaves a square (square: string) => void
  onMouseOutSquare: PropTypes.func,

  // user function that is run when mouse is over a square (square: string) => void
  onMouseOverSquare: PropTypes.func,

  // user function that is run when piece is clicked (piece: string) => void
  onPieceClick: PropTypes.func,

  // user function that is run when piece is grabbed to start dragging (piece: string, sourceSquare: string) => void
  onPieceDragBegin: PropTypes.func,

  // user function that is run when piece is let go after dragging (piece: string, sourceSquare: string) => void
  onPieceDragEnd: PropTypes.func,

  // user function that is run when piece is dropped on a square (sourceSquare: string, targetSquare: string, piece: string) => boolean
  onPieceDrop: PropTypes.func,

  // user function that is run when a square is clicked (square: string) => void
  onSquareClick: PropTypes.func,

  // user function that is run when a square is right clicked (square: string) => void
  onSquareRightClick: PropTypes.func,

  // FEN string or a position object ({ e5: 'wK', e4: 'wP', e7: 'bK' })
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  // show file character and rank numbers (a..h, 1..8)
  showBoardNotation: PropTypes.bool

  // show spare pieces above and below board.
  // showSparePieces: PropTypes.bool
};

export const chessboardDefaultProps = {
  animationDuration: 300,
  areArrowsAllowed: true,
  arePiecesDraggable: true,
  arePremovesAllowed: false,
  boardOrientation: 'white',
  boardWidth: 560,
  clearPremovesOnRightClick: true,
  customArrows: [],
  customArrowColor: 'rgb(255,170,0)',
  customBoardStyle: {},
  customDarkSquareStyle: { backgroundColor: '#B58863' },
  customDropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)' },
  customLightSquareStyle: { backgroundColor: '#F0D9B5' },
  customPieces: {},
  customPremoveDarkSquareStyle: { backgroundColor: '#A42323' },
  customPremoveLightSquareStyle: { backgroundColor: '#BD2828' },
  customSquareStyles: {},
  dropOffBoardAction: 'snapback',
  id: 0,
  isDraggablePiece: () => true,
  getPositionObject: () => {},
  onDragOverSquare: () => {},
  onMouseOutSquare: () => {},
  onMouseOverSquare: () => {},
  onPieceClick: () => {},
  onPieceDragBegin: () => {},
  onPieceDragEnd: () => {},
  onPieceDrop: () => true,
  onSquareClick: () => {},
  onSquareRightClick: () => {},
  position: 'start',
  showBoardNotation: true
  // showSparePieces: false
};
