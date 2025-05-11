import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";
import { columnIndexToChessColumn, rowIndexToChessRow } from "./utils";

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
            const piece =
              pieces[
                `${columnIndexToChessColumn(x)}${rowIndexToChessRow(y, board.length)}`
              ];

            return (
              <Cell key={cell.cellId} {...cell}>
                {piece ? <Piece {...piece} /> : null}
              </Cell>
            );
          })
        )}
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {movingPiece ? (
          <Piece
            clone
            position={movingPiece.position}
            pieceType={movingPiece.pieceType}
          />
        ) : null}
      </DragOverlay>
    </>
  );
}
