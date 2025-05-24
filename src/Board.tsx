import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import { Square } from "./Square";
import { Piece } from "./Piece";
import { useChessboardContext } from "./ChessboardProvider";

export function Board() {
  const { board, boardStyle, currentPosition, draggingPiece } = useChessboardContext();

  return (
    <>
      <div style={boardStyle}>
        {board.map((row) =>
          row.map((square) => {
            const piece = currentPosition[square.squareId];

            return (
              <Square key={square.squareId} {...square}>
                {piece ? <Piece {...piece} position={square.squareId} /> : null}
              </Square>
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
