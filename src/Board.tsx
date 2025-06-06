import { DragOverlay } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

import { Draggable } from './Draggable';
import { Piece } from './Piece';
import { Square } from './Square';
import { useChessboardContext } from './ChessboardProvider';
import { defaultBoardStyle } from './styles';

export function Board() {
  const {
    board,
    boardStyle,
    chessboardColumns,
    currentPosition,
    draggingPiece,
  } = useChessboardContext();

  return (
    <>
      <div style={{ ...defaultBoardStyle(chessboardColumns), ...boardStyle }}>
        {board.map((row) =>
          row.map((square) => {
            const piece = currentPosition[square.squareId];

            return (
              <Square key={square.squareId} {...square}>
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
            );
          }),
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
