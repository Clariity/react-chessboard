import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";

export function Board() {
  const { board, boardStyle, currentPosition, draggingPiece } = useChessboardContext();

  return (
    <>
      <div style={boardStyle}>
        {board.map((row) =>
          row.map((cell) => {
            const piece = currentPosition[cell.cellId];

            return (
              <Cell key={cell.cellId} {...cell}>
                {piece ? <Piece {...piece} position={cell.cellId} /> : null}
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
