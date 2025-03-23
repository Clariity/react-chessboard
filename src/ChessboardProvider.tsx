import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import { createContext, use, useCallback, useState } from "react";

import { generateBoard } from "./utils";
import { CellDataType, PieceDataType, PieceType } from "./types";

type ContextType = {
  board: CellDataType[][];
  chessboardSize: number;
  darkSquareColor: string;
  lightSquareColor: string;
  isWrapped: boolean;
  movingPiece: PieceDataType | null;
  setMovingPiece: (piece: PieceDataType | null) => void;
  pieces: PieceDataType[][];
  setPieces: (pieces: PieceDataType[][]) => void;
};

const ChessboardContext = createContext<ContextType>({
  board: generateBoard(8),
  chessboardSize: 8,
  darkSquareColor: "#B58863",
  lightSquareColor: "#F0D9B5",
  isWrapped: false,
  movingPiece: null,
  setMovingPiece: () => {},
  pieces: [[]],
  setPieces: () => {},
});

export const useChessboardContext = () => use(ChessboardContext);

export type ChessboardOptions = {
  chessboardSize: number;
  darkSquareColor?: string;
  lightSquareColor?: string;
};

export function ChessboardProvider({
  children,
  options,
}: React.PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    chessboardSize = 8,
    darkSquareColor = "#B58863",
    lightSquareColor = "#F0D9B5",
  } = options || {};

  const [movingPiece, setMovingPiece] = useState<PieceDataType | null>(null);
  const [pieces, setPieces] = useState(() => {
    const pieces: PieceDataType[][] = Array.from(
      Array(chessboardSize),
      () => new Array(chessboardSize)
    );
    pieces[0][0] = {
      id: "0-0",
      position: { x: 0, y: 0 },
      disabled: false,
      type: PieceType.wR,
    };
    return pieces;
  });

  const board = generateBoard(chessboardSize);

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
        board,
        chessboardSize,
        darkSquareColor,
        lightSquareColor,
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
