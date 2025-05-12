import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";

export function Board() {
  const { board, chessboardColumns, draggingPiece, pieces } = useChessboardContext();

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${chessboardColumns}, 1fr`,
        }}
      >
        {board.map((row) =>
          row.map((cell) => {
            const piece = pieces[cell.cellId];

            return (
              <Cell key={cell.cellId} {...cell}>
                {piece ? <Piece {...piece} /> : null}
              </Cell>
            );
          })
        )}
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {draggingPiece ? (
          <Piece
            clone
            position={draggingPiece.position}
            pieceType={draggingPiece.pieceType}
          />
        ) : null}
      </DragOverlay>
    </>
  );
}
