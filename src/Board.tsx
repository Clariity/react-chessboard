import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";

export function Board() {
  const {
    board,
    chessboardSize,
    darkSquareColor,
    lightSquareColor,
    movingPiece,
    pieces,
  } = useChessboardContext();

  return (
    <>
      <div
        style={{ display: "grid", gridTemplateColumns: `repeat(${chessboardSize}, 1fr)` }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            const piece = pieces[y][x];

            return (
              <Cell
                key={cell.id}
                darkSquareColor={darkSquareColor}
                lightSquareColor={lightSquareColor}
                {...cell}
              >
                {piece ? <Piece {...piece} /> : null}
              </Cell>
            );
          })
        )}
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {movingPiece ? <Piece clone id={movingPiece.id} type={movingPiece.type} /> : null}
      </DragOverlay>
    </>
  );
}
