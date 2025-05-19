import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from "@dnd-kit/core";
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
  CellDataType,
  DraggingPieceDataType,
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  PieceRenderObject,
  PieceType,
  PositionDataType,
  SquareHandlerArgs,
} from "./types";
import { defaultPieces } from "./pieces";

type Defined<T> = T extends undefined ? never : T;

type ContextType = {
  // chessboard options
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
  board: CellDataType[][];
  isWaitingForAnimation: boolean;
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
  onPieceDragEnd?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDragStart?: ({ isSparePiece, piece, square }: PieceHandlerArgs) => void;
  onPieceDrop?: ({ piece, sourceSquare, targetSquare }: PieceDropHandlerArgs) => void;
  onSquareClick?: ({ piece, square }: SquareHandlerArgs) => void;
  onSquareRightClick?: ({ piece, square }: SquareHandlerArgs) => void;
};

// finish handlers
// if pieceIsDragged and fails, animation cuts, could be why old implementation had a return for onPieceDrop? could determine if a new position comes in?
// isWaitingForAnimation and whether we want to block anything whilst happening, or delete it as we don't need it?
// dropOffBoard (can be done externally, onPieceDrop returns no targetSquare, so can do chess.remove())
// promotion ???
// premoves ???
// arrows ??? (maybe add ability to draw them, but logic for them can be done externally, though would be nice to have it here)
// animation needed on manual drop for castling
// tests
// docs and stories
// linting
// formatting
// packaging
// ci/cd
// squareRenderer

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
    boardStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(${chessboardColumns}, 1fr`,
    },
    squareStyle = {
      aspectRatio: "1/1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    darkSquareStyle = {
      backgroundColor: "#B58863",
    },
    lightSquareStyle = {
      backgroundColor: "#F0D9B5",
    },
    dropSquareStyle = {
      border: "1px solid black",
    },

    // notation
    darkSquareNotationStyle = {
      color: "#F0D9B5",
    },
    lightSquareNotationStyle = {
      color: "#B58863",
    },
    alphaNotationStyle = {
      fontSize: "13px",
      position: "absolute",
      top: 2,
      left: 2,
    },
    numericNotationStyle = {
      fontSize: "13px",
      position: "absolute",
      bottom: 1,
      right: 4,
    },
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
    onPieceDragEnd,
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

  // if we are waiting for an animation to complete
  const [isWaitingForAnimation, setIsWaitingForAnimation] = useState(false);

  // if the latest move was a manual drop
  const [wasManualDrop, setWasManualDrop] = useState(false);

  // the animation timeout whilst waiting for animation to complete
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // if the position changes, we need to recreate the pieces array
  useEffect(() => {
    const newPosition =
      typeof position === "string"
        ? fenStringToPositionObject(position, chessboardRows, chessboardColumns)
        : position;

    // new position was a result of a manual drop
    if (wasManualDrop) {
      // no animation needed, just set the position and reset the flag
      setCurrentPosition(newPosition);
      setWasManualDrop(false);
      return;
    }

    // new position was a result of an external move
    // if no animation, just set the position
    if (!showAnimations) {
      setCurrentPosition(newPosition);
      return;
    } else {
      // animate external move
      setIsWaitingForAnimation(true);

      // get list of position updates as pieces to animate
      const positionUpdates = getPositionUpdates(
        currentPosition,
        newPosition,
        chessboardColumns,
        boardOrientation
      );
      setPositionDifferences(positionUpdates);

      // start animation timeout
      const newTimeout = setTimeout(() => {
        setCurrentPosition(newPosition);
        setPositionDifferences({});
        setIsWaitingForAnimation(false);
      }, animationDurationInMs);

      // update the ref to the new timeout
      animationTimeoutRef.current = newTimeout;
    }

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
    setIsWaitingForAnimation(false); // reset the animation flag
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

      onPieceDragEnd?.({
        isSparePiece: draggingPiece.isSparePiece,
        piece: {
          pieceType: draggingPiece.pieceType,
        },
        square: dropSquare ? dropSquare : null,
      });

      if (!dropSquare) {
        return;
      }

      if (event.over) {
        setDraggingPiece(null);
        setWasManualDrop(true);
        onPieceDrop?.({
          piece: draggingPiece,
          sourceSquare: draggingPiece.position,
          targetSquare: dropSquare,
        });
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
        square: isSparePiece ? (active.id as string) : null,
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

  return (
    <ChessboardContext.Provider
      value={{
        // chessboard options
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
        isWaitingForAnimation,
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
      >
        {children}
      </DndContext>
    </ChessboardContext.Provider>
  );
}
