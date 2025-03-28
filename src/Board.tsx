import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";

export function Board() {
  const { board, chessboardColumns, movingPiece, pieces } = useChessboardContext();

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${chessboardColumns}, 1fr`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            // need to optionally chain in case board size increases and pieces array is not updated yet
            const piece = pieces[y]?.[x];

            return (
              <Cell key={cell.id} {...cell}>
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
