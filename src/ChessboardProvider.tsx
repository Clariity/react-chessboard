import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

import { fenStringToPositionObject, generateBoard } from "./utils";
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
  showNotation: ChessboardOptions["showNotation"];

  // internal state
  board: CellDataType[][];
  isWrapped: boolean;
  movingPiece: PieceDataType | null;
  setMovingPiece: (piece: PieceDataType | null) => void;
  pieces: PositionDataType;
  setPieces: (pieces: PositionDataType) => void;
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
};

// TODO: Take in fen and render it
// TODO: Write tests early, visual tests too (with chromatic?)

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
    showNotation = true,
  } = options || {};

  const [movingPiece, setMovingPiece] = useState<PieceDataType | null>(null);
  const [pieces, setPieces] = useState(
    fenStringToPositionObject(position, chessboardRows)
  );

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
      const potentialExistingPiece = pieces[dropSquare];

      setMovingPiece(null);

      if (event.over && !potentialExistingPiece) {
        const newPiece: PieceDataType = {
          ...movingPiece,
          position: dropSquare,
        };

        // clone pieces
        const newPieces = structuredClone(pieces);

        // remove old piece position
        delete newPieces[movingPiece.position];

        // place new piece position
        newPieces[dropSquare] = newPiece;

        // set new pieces
        setPieces(newPieces);
      }
    },
    [movingPiece, pieces]
  );

  const handleDragStart = useCallback(
    // active.id is the id of the piece being dragged
    function handleDragStart({ active }: DragStartEvent) {
      // the id is either the position of the piece on the board if it's on the board (e.g. "a1", "b2", etc.), or the type of the piece if it's a spare piece (e.g. "wP", "bN", etc.)
      const pieceId = active.id.toString();

      // if id is a piece type, it's a spare piece
      if (Object.values(PieceType).includes(pieceId as PieceType)) {
        setMovingPiece({
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
        showNotation,

        // internal state
        board,
        isWrapped: true,
        movingPiece,
        setMovingPiece,
        pieces,
        setPieces,
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
