import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

import { generateBoard } from "./utils";
import { CellDataType, PieceDataType, PieceType } from "./types";

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
  pieces: PieceDataType[][];
  setPieces: (pieces: PieceDataType[][]) => void;
};

const ChessboardContext = createContext<ContextType | null>(null);

export const useChessboardContext = () => use(ChessboardContext) as ContextType;

export type ChessboardOptions = {
  // board dimensions
  chessboardRows: number;
  chessboardColumns: number;

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
  const [pieces, setPieces] = useState(() => {
    const pieces: PieceDataType[][] = Array.from(
      Array(chessboardRows),
      () => new Array(chessboardColumns)
    );
    pieces[0][0] = {
      id: "0-0",
      position: { x: 0, y: 0 },
      disabled: false,
      type: PieceType.wR,
    };
    return pieces;
  });

  // if the dimensions change, we need to recreate the pieces array
  useEffect(() => {
    const pieces: PieceDataType[][] = Array.from(
      Array(chessboardRows),
      () => new Array(chessboardColumns)
    );
    pieces[0][0] = {
      id: "0-0",
      position: { x: 0, y: 0 },
      disabled: false,
      type: PieceType.wR,
    };
    setPieces(pieces);
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

      const { x: movingPieceX, y: movingPieceY } = movingPiece.position;
      const [cellY, cellX] = event.over.id.toString().split("-").map(Number);

      const potentialExistingPiece = pieces[cellY][cellX];

      setMovingPiece(null);

      if (event.over && !potentialExistingPiece) {
        const newPiece: PieceDataType = {
          ...movingPiece,
          id: `${cellY}-${cellX}`,
          position: { x: cellX, y: cellY },
        };

        // Clone pieces
        const newPieces = pieces.map((row) => row.slice());

        // Place new
        if (movingPieceY !== -1 && movingPieceX !== -1) {
          delete newPieces[movingPieceY][movingPieceX];
        }
        newPieces[cellY][cellX] = newPiece;

        setPieces(newPieces);
      }
    },
    [movingPiece, pieces]
  );

  const handleDragStart = useCallback(
    function handleDragStart({ active }: DragStartEvent) {
      // handle spare pieces
      if (Object.values(PieceType).includes(active.id as PieceType)) {
        setMovingPiece({
          id: active.id as string,
          position: { x: -1, y: -1 },
          type: active.id as PieceType,
        });
        return;
      }

      for (let row of pieces) {
        for (let cell of row) {
          if (cell?.id === active.id) {
            setMovingPiece(cell);
            return;
          }
        }
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
