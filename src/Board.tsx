import { DragOverlay } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useEffect, useRef, useState } from 'react';

import { Arrows } from './Arrows';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { Piece } from './Piece';
import { Square } from './Square';
import { useChessboardContext } from './ChessboardProvider';
import { defaultBoardStyle } from './defaults';

export function Board() {
  const {
    board,
    boardStyle,
    chessboardColumns,
    currentPosition,
    draggingPiece,
    id,
  } = useChessboardContext();
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(boardRef.current?.clientWidth);
  const [boardHeight, setBoardHeight] = useState(
    boardRef.current?.clientHeight,
  );

  // if the board dimensions change, update the board width and height
  useEffect(() => {
    if (boardRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setBoardWidth(boardRef.current?.clientWidth as number);
        setBoardHeight(boardRef.current?.clientHeight as number);
      });
      resizeObserver.observe(boardRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [boardRef.current]);

  return (
    <>
      <div
        id={`${id}-board`}
        ref={boardRef}
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

        <Arrows boardWidth={boardWidth} boardHeight={boardHeight} />
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
