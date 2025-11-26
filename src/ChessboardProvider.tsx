import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  fenStringToPositionObject,
  generateBoard,
  getPromotionUpdates,
  getPositionUpdates,
} from './utils';
import {
  Arrow,
  SquareDataType,
  DraggingPieceDataType,
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  PieceRenderObject,
  PositionDataType,
  SquareHandlerArgs,
} from './types';
import { defaultPieces } from './pieces';
import {
  defaultAlphaNotationStyle,
  defaultArrowOptions,
  defaultBoardStyle,
  defaultDarkSquareNotationStyle,
  defaultDarkSquareStyle,
  defaultDraggingPieceGhostStyle,
  defaultDraggingPieceStyle,
  defaultDropSquareStyle,
  defaultLightSquareNotationStyle,
  defaultLightSquareStyle,
  defaultNumericNotationStyle,
  defaultSquareStyle,
} from './defaults';
import { RightClickCancelSensor } from './RightClickCancelSensor';

type Defined<T> = T extends undefined ? never : T;

type ContextType = {
  // id
  id: Defined<ChessboardOptions['id']>;

  // chessboard options
  pieces: Defined<ChessboardOptions['pieces']>;

  boardOrientation: Defined<ChessboardOptions['boardOrientation']>;
  chessboardRows: Defined<ChessboardOptions['chessboardRows']>;
  chessboardColumns: Defined<ChessboardOptions['chessboardColumns']>;

  boardStyle: Defined<ChessboardOptions['boardStyle']>;
  squareStyle: Defined<ChessboardOptions['squareStyle']>;
  squareStyles: Defined<ChessboardOptions['squareStyles']>;
  darkSquareStyle: Defined<ChessboardOptions['darkSquareStyle']>;
  lightSquareStyle: Defined<ChessboardOptions['lightSquareStyle']>;
  dropSquareStyle: Defined<ChessboardOptions['dropSquareStyle']>;
  draggingPieceStyle: Defined<ChessboardOptions['draggingPieceStyle']>;
  draggingPieceGhostStyle: Defined<
    ChessboardOptions['draggingPieceGhostStyle']
  >;

  darkSquareNotationStyle: Defined<
    ChessboardOptions['darkSquareNotationStyle']
  >;
  lightSquareNotationStyle: Defined<
    ChessboardOptions['lightSquareNotationStyle']
  >;
  alphaNotationStyle: Defined<ChessboardOptions['alphaNotationStyle']>;
  numericNotationStyle: Defined<ChessboardOptions['numericNotationStyle']>;
  showNotation: Defined<ChessboardOptions['showNotation']>;

  animationDurationInMs: Defined<ChessboardOptions['animationDurationInMs']>;
  showAnimations: Defined<ChessboardOptions['showAnimations']>;

  allowDragging: Defined<ChessboardOptions['allowDragging']>;
  allowDragOffBoard: Defined<ChessboardOptions['allowDragOffBoard']>;

  allowDrawingArrows: Defined<ChessboardOptions['allowDrawingArrows']>;
  arrows: Defined<ChessboardOptions['arrows']>;
  arrowOptions: Defined<ChessboardOptions['arrowOptions']>;

  canDragPiece: ChessboardOptions['canDragPiece'];
  onMouseOutSquare: ChessboardOptions['onMouseOutSquare'];
  onMouseOverSquare: ChessboardOptions['onMouseOverSquare'];
  onPieceClick: ChessboardOptions['onPieceClick'];
  onSquareClick: ChessboardOptions['onSquareClick'];
  onSquareMouseDown: ChessboardOptions['onSquareMouseDown'];
  onSquareMouseUp: ChessboardOptions['onSquareMouseUp'];
  onSquareRightClick: ChessboardOptions['onSquareRightClick'];
  squareRenderer: ChessboardOptions['squareRenderer'];

  // internal state
  board: SquareDataType[][];
  isWrapped: boolean;
  draggingPiece: DraggingPieceDataType | null;
  currentPosition: PositionDataType;
  positionDifferences: ReturnType<typeof getPositionUpdates>;
  newArrowStartSquare: string | null;
  newArrowOverSquare: { square: string; color: string } | null;
  setNewArrowStartSquare: (square: string | null) => void;
  setNewArrowOverSquare: (
    square: string | null,
    modifiers?: { shiftKey: boolean; ctrlKey: boolean },
  ) => void;
  internalArrows: Arrow[];
  drawArrow: (
    newArrowEndSquare: string,
    modifiers?: { shiftKey: boolean; ctrlKey: boolean },
  ) => void;
  clearArrows: () => void;
};

const ChessboardContext = createContext<ContextType | null>(null);

export const useChessboardContext = () => use(ChessboardContext) as ContextType;

export type ChessboardOptions = {
  // id
  id?: string;

  // pieces and position
  pieces?: PieceRenderObject;
  position?: string | PositionDataType; // FEN string (or object position) to set up the board

  // board dimensions and orientation
  boardOrientation?: 'white' | 'black';
  chessboardRows?: number;
  chessboardColumns?: number;

  // board and squares styles
  boardStyle?: React.CSSProperties;
  squareStyle?: React.CSSProperties;
  squareStyles?: Record<string, React.CSSProperties>;
  darkSquareStyle?: React.CSSProperties;
  lightSquareStyle?: React.CSSProperties;
  dropSquareStyle?: React.CSSProperties;
  draggingPieceStyle?: React.CSSProperties;
  draggingPieceGhostStyle?: React.CSSProperties;

  // notation
  darkSquareNotationStyle?: React.CSSProperties;
  lightSquareNotationStyle?: React.CSSProperties;
  alphaNotationStyle?: React.CSSProperties;
  numericNotationStyle?: React.CSSProperties;
  showNotation?: boolean;

  // animation
  animationDurationInMs?: number;
  showAnimations?: boolean;

  // drag and drop
  allowDragging?: boolean;
  allowDragOffBoard?: boolean;
  allowAutoScroll?: boolean;
  dragActivationDistance?: number;

  // arrows
  allowDrawingArrows?: boolean;
  arrows?: Arrow[];
  arrowOptions?: typeof defaultArrowOptions;
  clearArrowsOnClick?: boolean;
  clearArrowsOnPositionChange?: boolean;

  // handlers
  canDragPiece?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => boolean;
  onArrowsChange?: ({ arrows }: { arrows: Arrow[] }) => void;
  onMouseOutSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onMouseOverSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onPieceClick?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDrag?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDrop?: ({
    piece,
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => boolean;
  onSquareClick?: ({ piece, square }: SquareHandlerArgs) => void;
  onSquareMouseDown?: (
    { piece, square }: SquareHandlerArgs,
    e: React.MouseEvent,
  ) => void;
  onSquareMouseUp?: (
    { piece, square }: SquareHandlerArgs,
    e: React.MouseEvent,
  ) => void;
  onSquareRightClick?: ({ piece, square }: SquareHandlerArgs) => void;
  squareRenderer?: ({
    piece,
    square,
    children,
  }: SquareHandlerArgs & { children?: React.ReactNode }) => React.JSX.Element;
};

export function ChessboardProvider({
  children,
  options,
}: React.PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    // id
    id = 'chessboard',

    // pieces and position
    pieces = defaultPieces,
    position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',

    // board dimensions and orientation
    boardOrientation = 'white',
    chessboardRows = 8,
    chessboardColumns = 8,

    // board and squares styles
    boardStyle = defaultBoardStyle(chessboardColumns),
    squareStyle = defaultSquareStyle,
    squareStyles = {},
    darkSquareStyle = defaultDarkSquareStyle,
    lightSquareStyle = defaultLightSquareStyle,
    dropSquareStyle = defaultDropSquareStyle,
    draggingPieceStyle = defaultDraggingPieceStyle,
    draggingPieceGhostStyle = defaultDraggingPieceGhostStyle,

    // notation
    darkSquareNotationStyle = defaultDarkSquareNotationStyle,
    lightSquareNotationStyle = defaultLightSquareNotationStyle,
    alphaNotationStyle = defaultAlphaNotationStyle,
    numericNotationStyle = defaultNumericNotationStyle,
    showNotation = true,

    // animation
    animationDurationInMs = 300,
    showAnimations = true,

    // drag and drop
    allowDragging = true,
    allowDragOffBoard = true,
    allowAutoScroll = false,
    dragActivationDistance = 1,

    // arrows
    allowDrawingArrows = true,
    arrows = [],
    arrowOptions = defaultArrowOptions,
    clearArrowsOnClick = true,
    clearArrowsOnPositionChange = true,

    // handlers
    canDragPiece,
    onArrowsChange,
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceClick,
    onPieceDrag,
    onPieceDrop,
    onSquareClick,
    onSquareMouseDown,
    onSquareMouseUp,
    onSquareRightClick,
    squareRenderer,
  } = options || {};

  // the piece currently being dragged
  const [draggingPiece, setDraggingPiece] =
    useState<DraggingPieceDataType | null>(null);

  // the current position of pieces on the chessboard
  const [currentPosition, setCurrentPosition] = useState(
    typeof position === 'string'
      ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
      : position,
  );

  // calculated differences between current and incoming positions
  const [positionDifferences, setPositionDifferences] = useState<
    ReturnType<typeof getPositionUpdates>
  >({});

  // if the latest move was a manual drop
  const [manuallyDroppedPieceAndSquare, setManuallyDroppedPieceAndSquare] =
    useState<{
      piece: string;
      sourceSquare: string;
      targetSquare: string;
    } | null>(null);

  // arrows
  const [newArrowStartSquare, setNewArrowStartSquare] = useState<string | null>(
    null,
  );
  const [newArrowOverSquare, setNewArrowOverSquare] = useState<{
    square: string;
    color: string;
  } | null>(null);
  const [internalArrows, setInternalArrows] = useState<Arrow[]>([]);

  // position we are animating to, if a new position comes in before the animation completes, we will use this to set the new position
  const [waitingForAnimationPosition, setWaitingForAnimationPosition] =
    useState<PositionDataType | null>(null);

  // the animation timeout whilst waiting for animation to complete
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // unique id for dnd context, we need this to prevent hydration issues
  const dndId = `dnd-${id}`;

  // if the position changes, we need to recreate the pieces array
  useEffect(() => {
    const newPosition =
      typeof position === 'string'
        ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
        : position;

    // clear internal arrows on position change
    if (clearArrowsOnPositionChange) {
      clearArrows();
    }

    // if no animation, just set the position
    if (!showAnimations) {
      setCurrentPosition(newPosition);
      return;
    }

    // save copy of the waiting for animation position so we can use it later but clear it from state so we don't use it in the next animation
    const currentWaitingForAnimationPosition = waitingForAnimationPosition;

    // if we are waiting for an animation to complete from a previous move, set the saved position to immediately end the animation
    if (currentWaitingForAnimationPosition) {
      setCurrentPosition(currentWaitingForAnimationPosition);
      setWaitingForAnimationPosition(null);
    }

    // get list of position updates as pieces to potentially animate
    const positionUpdates = getPositionUpdates(
      currentWaitingForAnimationPosition ?? currentPosition, // use the saved position if it exists, otherwise use the current position
      newPosition,
      chessboardColumns,
      boardOrientation,
    );

    const multiplePiecesMoved = Object.keys(positionUpdates).length > 1;

    // manually dropped piece caused multiple pieces to move (e.g. castling)
    if (manuallyDroppedPieceAndSquare && multiplePiecesMoved) {
      // create a new position with just the dropped piece moved
      const intermediatePosition = { ...currentPosition };
      delete intermediatePosition[manuallyDroppedPieceAndSquare.sourceSquare];
      intermediatePosition[
        manuallyDroppedPieceAndSquare.targetSquare as string
      ] = {
        pieceType: manuallyDroppedPieceAndSquare.piece as string,
      };
      setCurrentPosition(intermediatePosition);

      // create position differences with only the other pieces' movements
      const otherPiecesUpdates = { ...positionUpdates };
      delete otherPiecesUpdates[manuallyDroppedPieceAndSquare.sourceSquare];
      setPositionDifferences(otherPiecesUpdates);

      // animate the other pieces' movements
      const newTimeout = setTimeout(() => {
        setCurrentPosition(newPosition);
        setPositionDifferences({});
        setManuallyDroppedPieceAndSquare(null);
      }, animationDurationInMs);

      animationTimeoutRef.current = newTimeout;
      return;
    }

    // new position was a result of a manual drop
    if (manuallyDroppedPieceAndSquare) {
      // no animation needed, just set the position and reset the flag
      setCurrentPosition(newPosition);
      setManuallyDroppedPieceAndSquare(null);
      return;
    }

    // this extra position check will only run if the position HAS changed, but we have been unable to identify the pieces that have moved, reducing the impact of the performance overhead
    if (Object.keys(positionUpdates).length === 0) {
      const promotionUpdates = getPromotionUpdates(
        currentWaitingForAnimationPosition ?? currentPosition,
        newPosition,
        chessboardRows,
        chessboardColumns,
      );
      // Play the animation only if one promoting move was found and no updates were found
      // This does not animate in cases like:
      // - position changes where non promoting pieces moved
      // - multiple pawn promotions or promotion reversals
      // - removing one pawn from the board and promoting one nearby. would result in both pawns animating to the same promotion square
      if (Object.keys(promotionUpdates).length === 1) {
        setPositionDifferences(promotionUpdates);
        setWaitingForAnimationPosition(newPosition);

        const newTimeout = setTimeout(() => {
          setCurrentPosition(newPosition);
          setPositionDifferences({});
          setWaitingForAnimationPosition(null);
        }, animationDurationInMs);

        animationTimeoutRef.current = newTimeout;
        return;
      }
    }

    // new position was a result of an external move

    setPositionDifferences(positionUpdates);
    setWaitingForAnimationPosition(newPosition);

    // start animation timeout
    const newTimeout = setTimeout(() => {
      setCurrentPosition(newPosition);
      setPositionDifferences({});
      setWaitingForAnimationPosition(null);
    }, animationDurationInMs);

    // update the ref to the new timeout
    animationTimeoutRef.current = newTimeout;

    // clear timeout on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [position]);

  // if the dimensions change, we need to recreate the pieces array
  useEffect(() => {
    setCurrentPosition(
      typeof position === 'string'
        ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
        : position,
    );
  }, [chessboardRows, chessboardColumns, boardOrientation]);

  // if the arrows change, call the onArrowsChange callback
  useEffect(() => {
    onArrowsChange?.({ arrows: internalArrows });
  }, [internalArrows]);

  // only redraw the board when the dimensions or board orientation change
  const board = useMemo(
    () => generateBoard(chessboardRows, chessboardColumns, boardOrientation),
    [chessboardRows, chessboardColumns, boardOrientation],
  );

  const drawArrow = useCallback(
    (
      newArrowEndSquare: string,
      modifiers?: { shiftKey: boolean; ctrlKey: boolean },
    ) => {
      if (!allowDrawingArrows) {
        return;
      }

      const arrowExistsIndex = internalArrows.findIndex(
        (arrow) =>
          arrow.startSquare === newArrowStartSquare &&
          arrow.endSquare === newArrowEndSquare,
      );
      const arrowExistsExternally = arrows.some(
        (arrow) =>
          arrow.startSquare === newArrowStartSquare &&
          arrow.endSquare === newArrowEndSquare,
      );

      // if the arrow already exists externally, don't add it to the internal arrows
      if (arrowExistsExternally) {
        setNewArrowStartSquare(null);
        setNewArrowOverSquare(null);
        return;
      }

      // new arrow with different start and end square, add to internal arrows or remove if it already exists
      if (newArrowStartSquare && newArrowStartSquare !== newArrowEndSquare) {
        const arrowColor = modifiers?.shiftKey
          ? arrowOptions.secondaryColor
          : modifiers?.ctrlKey
            ? arrowOptions.tertiaryColor
            : arrowOptions.color;

        setInternalArrows((prevArrows) =>
          arrowExistsIndex === -1
            ? [
                ...prevArrows,
                {
                  startSquare: newArrowStartSquare,
                  endSquare: newArrowEndSquare,
                  color: arrowColor,
                },
              ]
            : prevArrows.filter((_, index) => index !== arrowExistsIndex),
        );
        setNewArrowStartSquare(null);
        setNewArrowOverSquare(null);
      }
    },
    [
      allowDrawingArrows,
      arrows,
      arrowOptions.color,
      arrowOptions.secondaryColor,
      arrowOptions.tertiaryColor,
      internalArrows,
      newArrowStartSquare,
      newArrowOverSquare,
    ],
  );

  const clearArrows = useCallback(() => {
    if (clearArrowsOnClick) {
      setInternalArrows([]);
      setNewArrowStartSquare(null);
      setNewArrowOverSquare(null);
    }
  }, [clearArrowsOnClick]);

  const setNewArrowOverSquareWithModifiers = useCallback(
    (
      square: string | null,
      modifiers?: { shiftKey: boolean; ctrlKey: boolean },
    ) => {
      const color = modifiers?.shiftKey
        ? arrowOptions.secondaryColor
        : modifiers?.ctrlKey
          ? arrowOptions.tertiaryColor
          : arrowOptions.color;
      if (square) {
        setNewArrowOverSquare({ square, color });
      } else {
        setNewArrowOverSquare(null);
      }
    },
    [arrowOptions],
  );

  const handleDragCancel = useCallback(() => {
    setDraggingPiece(null);
  }, []);

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      if (!draggingPiece) {
        return;
      }

      const dropSquare = event.over?.id.toString();

      // dropped outside of droppable area (e.g. off board)
      if (!dropSquare) {
        onPieceDrop?.({
          piece: draggingPiece,
          sourceSquare: draggingPiece.position,
          targetSquare: null,
        });
        // set as manually dropped piece so that no animation is shown
        setManuallyDroppedPieceAndSquare({
          piece: draggingPiece.pieceType,
          sourceSquare: draggingPiece.position,
          targetSquare: '',
        });
        setDraggingPiece(null);
        return;
      }

      if (event.over) {
        const isDropValid = onPieceDrop?.({
          piece: draggingPiece,
          sourceSquare: draggingPiece.position,
          targetSquare: dropSquare,
        });

        // if the drop is valid, set the manually dropped piece and square
        if (isDropValid) {
          setManuallyDroppedPieceAndSquare({
            piece: draggingPiece.pieceType,
            sourceSquare: draggingPiece.position,
            targetSquare: dropSquare,
          });
        }
        setDraggingPiece(null);
      }
    },
    [draggingPiece],
  );

  const handleDragStart = useCallback(
    // active.id is the id of the piece being dragged
    function handleDragStart({ active }: DragStartEvent) {
      // the id is either the position of the piece on the board if it's on the board (e.g. "a1", "b2", etc.), or the type of the piece if it's a spare piece (e.g. "wP", "bN", etc.)
      const isSparePiece = active.data.current?.isSparePiece;

      onPieceDrag?.({
        isSparePiece,
        piece: isSparePiece
          ? {
              pieceType: active.id as string,
            }
          : currentPosition[active.id],
        square: isSparePiece ? null : (active.id as string),
      });

      setDraggingPiece({
        isSparePiece,
        position: active.id as string,
        pieceType: isSparePiece
          ? (active.id as string)
          : currentPosition[active.id].pieceType,
      });
      return;
    },
    [currentPosition],
  );

  const sensors = useSensors(
    useSensor(RightClickCancelSensor, {
      activationConstraint:
        dragActivationDistance > 0
          ? {
              distance: dragActivationDistance,
            }
          : undefined,
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor),
  );

  // collision detection that first tries pointer-based detection and then falls back to rectangle intersection for keyboards
  function collisionDetection(args: Parameters<typeof pointerWithin>[0]) {
    // if a pointer is found, return those
    if (args.pointerCoordinates) {
      return pointerWithin(args);
    }

    // otherwise fall back to rectangle intersection
    return rectIntersection(args);
  }

  return (
    <ChessboardContext.Provider
      value={{
        // chessboard options
        id,

        pieces,

        boardOrientation,
        chessboardRows,
        chessboardColumns,

        boardStyle,
        squareStyle,
        squareStyles,
        darkSquareStyle,
        lightSquareStyle,
        dropSquareStyle,
        draggingPieceStyle,
        draggingPieceGhostStyle,

        darkSquareNotationStyle,
        lightSquareNotationStyle,
        alphaNotationStyle,
        numericNotationStyle,
        showNotation,

        animationDurationInMs,
        showAnimations,

        allowDragging,
        allowDragOffBoard,

        allowDrawingArrows,
        arrows,
        arrowOptions,

        canDragPiece,
        onMouseOutSquare,
        onMouseOverSquare,
        onPieceClick,
        onSquareClick,
        onSquareMouseDown,
        onSquareMouseUp,
        onSquareRightClick,
        squareRenderer,

        // internal state
        board,
        isWrapped: true,
        draggingPiece,
        currentPosition,
        positionDifferences,
        newArrowStartSquare,
        newArrowOverSquare,
        setNewArrowStartSquare,
        setNewArrowOverSquare: setNewArrowOverSquareWithModifiers,
        internalArrows,
        drawArrow,
        clearArrows,
      }}
    >
      <DndContext
        autoScroll={allowAutoScroll}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        id={dndId}
      >
        {children}
      </DndContext>
    </ChessboardContext.Provider>
  );
}
