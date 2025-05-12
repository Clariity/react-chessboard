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
import { CellDataType, PieceDataType, PieceType, PositionDataType } from "./types";

type Defined<T> = T extends undefined ? never : T;

type ContextType = {
  // chessboard options
  boardOrientation: Defined<ChessboardOptions["boardOrientation"]>;
  chessboardRows: Defined<ChessboardOptions["chessboardRows"]>;
  chessboardColumns: Defined<ChessboardOptions["chessboardColumns"]>;
  darkSquareColor: Defined<ChessboardOptions["darkSquareColor"]>;
  lightSquareColor: Defined<ChessboardOptions["lightSquareColor"]>;
  darkSquareNotationColor: Defined<ChessboardOptions["darkSquareNotationColor"]>;
  lightSquareNotationColor: Defined<ChessboardOptions["lightSquareNotationColor"]>;
  alphaNotationStyle: Defined<ChessboardOptions["alphaNotationStyle"]>;
  numericNotationStyle: Defined<ChessboardOptions["numericNotationStyle"]>;
  animationDurationInMs: Defined<ChessboardOptions["animationDurationInMs"]>;
  showAnimations: Defined<ChessboardOptions["showAnimations"]>;
  showNotation: Defined<ChessboardOptions["showNotation"]>;

  // internal state
  board: CellDataType[][];
  isWaitingForAnimation: boolean;
  isWrapped: boolean;
  draggingPiece: PieceDataType | null;
  pieces: PositionDataType;
  positionDifferences: ReturnType<typeof getPositionUpdates>;
};

const ChessboardContext = createContext<ContextType | null>(null);

export const useChessboardContext = () => use(ChessboardContext) as ContextType;

export type ChessboardOptions = {
  // position
  position?: string; // FEN string to set up the board

  // board dimensions and orientation
  boardOrientation?: "white" | "black";
  chessboardRows?: number;
  chessboardColumns?: number;

  // light and dark squares
  darkSquareColor?: string;
  lightSquareColor?: string;

  // notation
  darkSquareNotationColor?: string;
  lightSquareNotationColor?: string;
  alphaNotationStyle?: React.CSSProperties;
  numericNotationStyle?: React.CSSProperties;
  showNotation?: boolean;

  // animation
  animationDurationInMs?: number;
  showAnimations?: boolean;

  // handlers
  onPieceDrop?: (
    sourceSquare: string,
    targetSquare: string,
    piece: PieceDataType
  ) => void;
};

// isWaitingForAnimation and whether we want to block anything whilst happening, or delete it as we don't need it?
// handlers (onPieceClick, onPieceDragStart, onPieceDragEnd, onPieceDragCancel etc.)
// dropOffBoard
// styling
// promotion
// animation needed on manual drop for castling
// tests
// docs and stories
// linting
// formatting
// packaging
// ci/cd

export function ChessboardProvider({
  children,
  options,
}: React.PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    boardOrientation = "white",
    chessboardRows = 8,
    chessboardColumns = 8,
    darkSquareColor = "#B58863",
    lightSquareColor = "#F0D9B5",
    darkSquareNotationColor = "#F0D9B5",
    lightSquareNotationColor = "#B58863",
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
    animationDurationInMs = 300,
    showAnimations = true,
    showNotation = true,
    onPieceDrop,
  } = options || {};

  // the piece currently being dragged
  const [draggingPiece, setDraggingPiece] = useState<PieceDataType | null>(null);

  // the current position of pieces on the chessboard
  const [pieces, setPieces] = useState(
    fenStringToPositionObject(position, chessboardRows, chessboardColumns)
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
    const newPosition = fenStringToPositionObject(
      position,
      chessboardRows,
      chessboardColumns
    );

    // new position was a result of a manual drop
    if (wasManualDrop) {
      // no animation needed, just set the position and reset the flag
      setPieces(newPosition);
      setWasManualDrop(false);
      return;
    }

    // new position was a result of an external move
    // if no animation, just set the position
    if (!showAnimations) {
      setPieces(newPosition);
      return;
    } else {
      // animate external move
      setIsWaitingForAnimation(true);

      // get list of position updates as pieces to animate
      const positionUpdates = getPositionUpdates(
        pieces,
        newPosition,
        chessboardColumns,
        boardOrientation
      );
      setPositionDifferences(positionUpdates);

      // start animation timeout
      const newTimeout = setTimeout(() => {
        setPieces(newPosition);
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
    setPieces(fenStringToPositionObject(position, chessboardRows, chessboardColumns));
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
      if (!draggingPiece?.position || !event.over?.id) {
        return;
      }

      const dropSquare = event.over.id.toString();

      if (event.over) {
        setDraggingPiece(null);
        setWasManualDrop(true);
        onPieceDrop?.(draggingPiece.position, dropSquare, draggingPiece);
      }
    },
    [draggingPiece, pieces]
  );

  const handleDragStart = useCallback(
    // active.id is the id of the piece being dragged
    function handleDragStart({ active }: DragStartEvent) {
      // the id is either the position of the piece on the board if it's on the board (e.g. "a1", "b2", etc.), or the type of the piece if it's a spare piece (e.g. "wP", "bN", etc.)
      const isSparePiece = active.data.current?.isSparePiece;

      // if id is a piece type, it's a spare piece
      if (isSparePiece) {
        setDraggingPiece({
          isSparePiece,
          position: active.id as string,
          pieceType: active.id as PieceType,
        });
        return;
      }

      // if id is a position, it's a piece on the board
      if (pieces[active.id]) {
        setDraggingPiece(pieces[active.id]);
        return;
      }
    },
    [pieces]
  );

  return (
    <ChessboardContext.Provider
      value={{
        // chessboard options
        boardOrientation,
        chessboardRows,
        chessboardColumns,
        darkSquareColor,
        lightSquareColor,
        darkSquareNotationColor,
        lightSquareNotationColor,
        alphaNotationStyle,
        numericNotationStyle,
        animationDurationInMs,
        showAnimations,
        showNotation,

        // internal state
        board,
        isWaitingForAnimation,
        isWrapped: true,
        draggingPiece,
        pieces,
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
