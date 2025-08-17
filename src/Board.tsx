import { DragOverlay } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

import { Arrows } from './Arrows';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { Piece } from './Piece';
import { Square } from './Square';
import { useChessboardContext } from './ChessboardProvider';
import { defaultBoardStyle } from './defaults';
import { preventDragOffBoard } from './modifiers';

export function Board() {
  const {
    allowDragOffBoard,
    board,
    boardStyle,
    chessboardColumns,
    currentPosition,
    draggingPiece,
    id,
  } = useChessboardContext();

  return (
    <>
      <div
        id={`${id}-board`}
        style={{ ...defaultBoardStyle(chessboardColumns), ...boardStyle }}
      >
        {board.map((row) =>
          row.map((square) => {
            const piece = currentPosition[square.squareId];

            return (
              <Droppable key={square.squareId} squareId={square.squareId}>
                {({ isOver }) => (
                  <Square isOver={isOver} {...square}>
                    {piece ? (
                      <Draggable
                        isSparePiece={false}
                        position={square.squareId}
                        pieceType={piece.pieceType}
                      >
                        <Piece {...piece} position={square.squareId} />
                      </Draggable>
                    ) : null}
                  </Square>
                )}
              </Droppable>
            );
          }),
        )}

        <Arrows />
      </div>

      <DragOverlay
        dropAnimation={null}
        modifiers={[
          snapCenterToCursor,
          ...(allowDragOffBoard
            ? []
            : [preventDragOffBoard(id, draggingPiece?.position || '')]),
        ]}
      >
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
