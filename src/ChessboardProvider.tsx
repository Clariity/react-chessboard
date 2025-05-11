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

type ContextType = {
  // chessboard options
  chessboardRows: ChessboardOptions["chessboardRows"];
  chessboardColumns: ChessboardOptions["chessboardColumns"];
  darkSquareColor: ChessboardOptions["darkSquareColor"];
  lightSquareColor: ChessboardOptions["lightSquareColor"];
  darkSquareNotationColor: ChessboardOptions["darkSquareNotationColor"];
  lightSquareNotationColor: ChessboardOptions["lightSquareNotationColor"];
  alphaNotationStyle: ChessboardOptions["alphaNotationStyle"];
  numericNotationStyle: ChessboardOptions["numericNotationStyle"];
  animationDurationInMs: ChessboardOptions["animationDurationInMs"];
  showAnimations: ChessboardOptions["showAnimations"];
  showNotation: ChessboardOptions["showNotation"];

  // internal state
  board: CellDataType[][];
  isWaitingForAnimation: boolean;
  isWrapped: boolean;
  movingPiece: PieceDataType | null;
  pieces: PositionDataType;
  positionDifferences: ReturnType<typeof getPositionUpdates>;
};

const ChessboardContext = createContext<ContextType | null>(null);

export const useChessboardContext = () => use(ChessboardContext) as ContextType;

export type ChessboardOptions = {
  // position
  position?: string; // FEN string to set up the board

  // board dimensions
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

export function ChessboardProvider({
  children,
  options,
}: React.PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
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
  const [movingPiece, setMovingPiece] = useState<PieceDataType | null>(null);

  // the current position of pieces on the chessboard
  const [pieces, setPieces] = useState(
    fenStringToPositionObject(position, chessboardRows)
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
    const newPosition = fenStringToPositionObject(position, chessboardRows);

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
      const positionUpdates = getPositionUpdates(pieces, newPosition);
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
    setPieces(fenStringToPositionObject(position, chessboardRows));
  }, [chessboardRows, chessboardColumns]);

  // only redraw the board when the dimensions change
  const board = useMemo(
    () => generateBoard(chessboardRows, chessboardColumns),
    [chessboardRows, chessboardColumns]
  );

  const handleDragCancel = useCallback(() => {
    setMovingPiece(null);
  }, []);

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      if (!movingPiece?.position || !event.over?.id) {
        return;
      }

      const dropSquare = event.over.id.toString();

      if (event.over) {
        setMovingPiece(null);
        setWasManualDrop(true);
        onPieceDrop?.(movingPiece.position, dropSquare, movingPiece);
      }
    },
    [movingPiece, pieces]
  );

  const handleDragStart = useCallback(
    // active.id is the id of the piece being dragged
    function handleDragStart({ active }: DragStartEvent) {
      // the id is either the position of the piece on the board if it's on the board (e.g. "a1", "b2", etc.), or the type of the piece if it's a spare piece (e.g. "wP", "bN", etc.)
      const pieceId = active.id.toString();
      const isSparePiece = active.data.current?.isSparePiece;

      // if id is a piece type, it's a spare piece
      if (Object.values(PieceType).includes(pieceId as PieceType)) {
        setMovingPiece({
          isSparePiece,
          position: active.id as string,
          pieceType: active.id as PieceType,
        });
        return;
      }

      // if id is a position, it's a piece on the board
      if (pieces[active.id]) {
        setMovingPiece(pieces[active.id]);
        return;
      }
    },
    [pieces]
  );

  return (
    <ChessboardContext.Provider
      value={{
        // chessboard options
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
        movingPiece,
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
