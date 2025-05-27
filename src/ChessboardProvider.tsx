import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { fenStringToPositionObject, generateBoard, getPositionUpdates } from "./utils";
import {
  SquareDataType,
  DraggingPieceDataType,
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  PieceRenderObject,
  PieceType,
  PositionDataType,
  SquareHandlerArgs,
} from "./types";
import { defaultPieces } from "./pieces";
import {
  defaultAlphaNotationStyle,
  defaultBoardStyle,
  defaultDarkSquareNotationStyle,
  defaultDarkSquareStyle,
  defaultDropSquareStyle,
  defaultLightSquareNotationStyle,
  defaultLightSquareStyle,
  defaultNumericNotationStyle,
  defaultSquareStyle,
} from "./styles";

type Defined<T> = T extends undefined ? never : T;

type ContextType = {
  // chessboard options
  pieces: Defined<ChessboardOptions["pieces"]>;

  boardOrientation: Defined<ChessboardOptions["boardOrientation"]>;
  chessboardRows: Defined<ChessboardOptions["chessboardRows"]>;
  chessboardColumns: Defined<ChessboardOptions["chessboardColumns"]>;

  boardStyle: Defined<ChessboardOptions["boardStyle"]>;
  squareStyle: Defined<ChessboardOptions["squareStyle"]>;
  darkSquareStyle: Defined<ChessboardOptions["darkSquareStyle"]>;
  lightSquareStyle: Defined<ChessboardOptions["lightSquareStyle"]>;
  dropSquareStyle: Defined<ChessboardOptions["dropSquareStyle"]>;

  darkSquareNotationStyle: Defined<ChessboardOptions["darkSquareNotationStyle"]>;
  lightSquareNotationStyle: Defined<ChessboardOptions["lightSquareNotationStyle"]>;
  alphaNotationStyle: Defined<ChessboardOptions["alphaNotationStyle"]>;
  numericNotationStyle: Defined<ChessboardOptions["numericNotationStyle"]>;
  showNotation: Defined<ChessboardOptions["showNotation"]>;

  animationDurationInMs: Defined<ChessboardOptions["animationDurationInMs"]>;
  showAnimations: Defined<ChessboardOptions["showAnimations"]>;

  allowDragging: Defined<ChessboardOptions["allowDragging"]>;
  allowDragOffBoard: Defined<ChessboardOptions["allowDragOffBoard"]>;

  onMouseOutSquare: ChessboardOptions["onMouseOutSquare"];
  onMouseOverSquare: ChessboardOptions["onMouseOverSquare"];
  onPieceClick: ChessboardOptions["onPieceClick"];
  onSquareClick: ChessboardOptions["onSquareClick"];
  onSquareRightClick: ChessboardOptions["onSquareRightClick"];

  // internal state
  board: SquareDataType[][];
  isWrapped: boolean;
  draggingPiece: DraggingPieceDataType | null;
  currentPosition: PositionDataType;
  positionDifferences: ReturnType<typeof getPositionUpdates>;
};

const ChessboardContext = createContext<ContextType | null>(null);

export const useChessboardContext = () => use(ChessboardContext) as ContextType;

export type ChessboardOptions = {
  // pieces and position
  pieces?: PieceRenderObject;
  position?: string | PositionDataType; // FEN string (or object position) to set up the board

  // board dimensions and orientation
  boardOrientation?: "white" | "black";
  chessboardRows?: number;
  chessboardColumns?: number;

  // board and squares styles
  boardStyle?: React.CSSProperties;
  squareStyle?: React.CSSProperties;
  darkSquareStyle?: React.CSSProperties;
  lightSquareStyle?: React.CSSProperties;
  dropSquareStyle?: React.CSSProperties;
  // squareRenderer?: (square: string, piece: PieceDataType) => React.JSX.Element;

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

  // handlers
  onMouseOutSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onMouseOverSquare?: ({ piece, square }: SquareHandlerArgs) => void;
  onPieceClick?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDragStart?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDrop?: ({ piece, sourceSquare, targetSquare }: PieceDropHandlerArgs) => boolean;
  onSquareClick?: ({ piece, square }: SquareHandlerArgs) => void;
  onSquareRightClick?: ({ piece, square }: SquareHandlerArgs) => void;
};

// scrolling whilst dragging is buggy, look to disable scroll on drag

// allowDragOffBoard - https://docs.dndkit.com/api-documentation/modifiers#building-custom-modifiers - CustomDragLayer implementation
// draggingPieceStyle (so users can style the dragging piece e.g. grow in size)
// prevent notation highlighting on double click
// accessibility (may need to revisit sensors)
// promotion ???
// premoves ???
// arrows ??? (maybe add ability to draw them, but logic for them can be done externally, though would be nice to have it here)
// squareRenderer
// activationConstraint distance as option, call it dragActivationDistance

// issue and PR templates
// tests
// linting rules
// formatting
// packaging
// ci/cd - beta semantic release

export function ChessboardProvider({
  children,
  options,
}: React.PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    // pieces and position
    pieces = defaultPieces,
    position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",

    // board dimensions and orientation
    boardOrientation = "white",
    chessboardRows = 8,
    chessboardColumns = 8,

    // board and squares styles
    boardStyle = defaultBoardStyle(chessboardColumns),
    squareStyle = defaultSquareStyle,
    darkSquareStyle = defaultDarkSquareStyle,
    lightSquareStyle = defaultLightSquareStyle,
    dropSquareStyle = defaultDropSquareStyle,

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

    // handlers
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceClick,
    onPieceDragStart,
    onPieceDrop,
    onSquareClick,
    onSquareRightClick,
  } = options || {};

  // the piece currently being dragged
  const [draggingPiece, setDraggingPiece] = useState<DraggingPieceDataType | null>(null);

  // the current position of pieces on the chessboard
  const [currentPosition, setCurrentPosition] = useState(
    typeof position === "string"
      ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
      : position
  );

  // calculated differences between current and incoming positions
  const [positionDifferences, setPositionDifferences] = useState<
    ReturnType<typeof getPositionUpdates>
  >({});

  // if the latest move was a manual drop
  const [manuallyDroppedPieceAndSquare, setManuallyDroppedPieceAndSquare] = useState<{
    piece: PieceType;
    sourceSquare: string;
    targetSquare: string;
  } | null>(null);

  // the animation timeout whilst waiting for animation to complete
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // if the position changes, we need to recreate the pieces array
  useEffect(() => {
    const newPosition =
      typeof position === "string"
        ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
        : position;

    // if no animation, just set the position
    if (!showAnimations) {
      setCurrentPosition(newPosition);
      return;
    }

    // get list of position updates as pieces to potentially animate
    const positionUpdates = getPositionUpdates(
      currentPosition,
      newPosition,
      chessboardColumns,
      boardOrientation
    );

    const multiplePiecesMoved = Object.keys(positionUpdates).length > 1;

    // manually dropped piece caused multiple pieces to move (e.g. castling)
    if (manuallyDroppedPieceAndSquare && multiplePiecesMoved) {
      // create a new position with just the dropped piece moved
      const intermediatePosition = { ...currentPosition };
      delete intermediatePosition[manuallyDroppedPieceAndSquare.sourceSquare];
      intermediatePosition[manuallyDroppedPieceAndSquare.targetSquare] = {
        pieceType: manuallyDroppedPieceAndSquare.piece,
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

    // new position was a result of an external move

    setPositionDifferences(positionUpdates);

    // start animation timeout
    const newTimeout = setTimeout(() => {
      setCurrentPosition(newPosition);
      setPositionDifferences({});
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
      typeof position === "string"
        ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
        : position
    );
  }, [chessboardRows, chessboardColumns, boardOrientation]);

  // only redraw the board when the dimensions or board orientation change
  const board = useMemo(
    () => generateBoard(chessboardRows, chessboardColumns, boardOrientation),
    [chessboardRows, chessboardColumns, boardOrientation]
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
          targetSquare: "",
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
    [draggingPiece, pieces]
  );

  const handleDragStart = useCallback(
    // active.id is the id of the piece being dragged
    function handleDragStart({ active }: DragStartEvent) {
      // the id is either the position of the piece on the board if it's on the board (e.g. "a1", "b2", etc.), or the type of the piece if it's a spare piece (e.g. "wP", "bN", etc.)
      const isSparePiece = active.data.current?.isSparePiece;

      onPieceDragStart?.({
        isSparePiece,
        piece: isSparePiece
          ? {
              pieceType: active.id as PieceType,
            }
          : currentPosition[active.id],
        square: isSparePiece ? null : (active.id as string),
      });

      setDraggingPiece({
        isSparePiece,
        position: active.id as string,
        pieceType: isSparePiece
          ? (active.id as PieceType)
          : currentPosition[active.id].pieceType,
      });
      return;
    },
    [currentPosition]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );

  return (
    <ChessboardContext.Provider
      value={{
        // chessboard options
        pieces,

        boardOrientation,
        chessboardRows,
        chessboardColumns,

        boardStyle,
        squareStyle,
        darkSquareStyle,
        lightSquareStyle,
        dropSquareStyle,

        darkSquareNotationStyle,
        lightSquareNotationStyle,
        alphaNotationStyle,
        numericNotationStyle,
        showNotation,

        animationDurationInMs,
        showAnimations,

        allowDragging,
        allowDragOffBoard,

        onMouseOutSquare,
        onMouseOverSquare,
        onPieceClick,
        onSquareClick,
        onSquareRightClick,

        // internal state
        board,
        isWrapped: true,
        draggingPiece,
        currentPosition,
        positionDifferences,
      }}
    >
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
      >
        {children}
      </DndContext>
    </ChessboardContext.Provider>
  );
}
