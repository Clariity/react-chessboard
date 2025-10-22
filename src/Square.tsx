import { memo, useEffect, useRef, useState } from 'react';

import { useChessboardContext } from './ChessboardProvider';
import {
  defaultAlphaNotationStyle,
  defaultDarkSquareNotationStyle,
  defaultDarkSquareStyle,
  defaultDropSquareStyle,
  defaultLightSquareNotationStyle,
  defaultLightSquareStyle,
  defaultNumericNotationStyle,
  defaultSquareStyle,
} from './defaults';
import { SquareDataType } from './types';
import { columnIndexToChessColumn } from './utils';

type SquareProps = {
  children?: React.ReactNode;
  squareId: SquareDataType['squareId'];
  isLightSquare: SquareDataType['isLightSquare'];
  isOver: boolean;
};

export const Square = memo(function Square({
  children,
  squareId,
  isLightSquare,
  isOver,
}: SquareProps) {
  // track if we are drawing an arrow so that onSquareRightClick is not fired when we finish drawing an arrow
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const {
    id,
    allowDrawingArrows,
    boardOrientation,
    chessboardColumns,
    chessboardRows,
    currentPosition,
    draggingPiece,
    squareStyle,
    squareStyles,
    darkSquareStyle,
    lightSquareStyle,
    dropSquareStyle,
    darkSquareNotationStyle,
    lightSquareNotationStyle,
    alphaNotationStyle,
    numericNotationStyle,
    showNotation,
    onMouseOutSquare,
    onMouseOverSquare,
    onSquareClick,
    onSquareMouseDown,
    onSquareMouseUp,
    onSquareRightClick,
    squareRenderer,
    newArrowStartSquare,
    setNewArrowStartSquare,
    setNewArrowOverSquare,
    drawArrow,
    clearArrows,
  } = useChessboardContext();

  // track previous isOver to only fire onMouseOutSquare on transition
  const prevIsOverRef = useRef(isOver);

  // handle firing onMouseOverSquare and onMouseOutSquare during drag operations
  // as onMouseOver and onMouseLeave do not fire during dragging
  useEffect(() => {
    if (isOver && draggingPiece) {
      onMouseOverSquare?.({
        piece: currentPosition[squareId] ?? null,
        square: squareId,
      });
    } else if (!isOver && draggingPiece && prevIsOverRef.current) {
      onMouseOutSquare?.({
        piece: currentPosition[squareId] ?? null,
        square: squareId,
      });
    }
    prevIsOverRef.current = isOver;
  }, [currentPosition, draggingPiece, isOver, squareId]);

  const column = squareId.match(/^[a-z]+/)?.[0];
  const row = squareId.match(/\d+$/)?.[0];

  return (
    <div
      id={`${id}-square-${squareId}`}
      style={{
        ...defaultSquareStyle,
        ...squareStyle,
        ...(isLightSquare
          ? { ...defaultLightSquareStyle, ...lightSquareStyle }
          : { ...defaultDarkSquareStyle, ...darkSquareStyle }),
        ...(isOver ? { ...defaultDropSquareStyle, ...dropSquareStyle } : {}),
      }}
      data-column={column}
      data-row={row}
      data-square={squareId}
      onClick={(e) => {
        if (e.button === 0) {
          onSquareClick?.({
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          });
        }
      }}
      onTouchEnd={(e) => {
        // Prevent default to avoid double-firing with onClick on some devices
        e.preventDefault();
        onSquareClick?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        });
      }}
      onContextMenu={(e) => {
        e.preventDefault();

        if (!isDrawingArrow) {
          onSquareRightClick?.({
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          });
        }
        setIsDrawingArrow(false);
      }}
      onMouseDown={(e) => {
        if (e.button === 0) {
          clearArrows();
        }
        if (e.button === 2 && allowDrawingArrows) {
          setNewArrowStartSquare(squareId);
        }
        onSquareMouseDown?.(
          {
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          },
          e,
        );
      }}
      onMouseUp={(e) => {
        if (e.button === 2) {
          if (
            allowDrawingArrows &&
            newArrowStartSquare &&
            newArrowStartSquare !== squareId
          ) {
            setIsDrawingArrow(true);
            drawArrow(squareId, {
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
            });
          } else if (newArrowStartSquare === squareId) {
            // right clicked the same square - clear the arrow start square
            setNewArrowStartSquare(null);
            setNewArrowOverSquare(null);
          }
        }
        onSquareMouseUp?.(
          {
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          },
          e,
        );
      }}
      onMouseOver={(e) => {
        // right mouse button is held down and we are drawing an arrow
        if (
          e.buttons === 2 &&
          allowDrawingArrows &&
          newArrowStartSquare &&
          newArrowStartSquare !== squareId
        ) {
          setNewArrowOverSquare(squareId, {
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
          });
        } else if (newArrowStartSquare === squareId) {
          // hovering back over the starting square - clear the over square
          setNewArrowOverSquare(null);
        }

        // don't fire when dragging as that is handled by the useEffect
        if (!draggingPiece) {
          onMouseOverSquare?.({
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          });
        }
      }}
      onMouseLeave={() => {
        // don't fire when dragging as that is handled by the useEffect
        if (!draggingPiece) {
          onMouseOutSquare?.({
            piece: currentPosition[squareId] ?? null,
            square: squareId,
          });
        }
      }}
    >
      {showNotation ? (
        <span
          style={
            isLightSquare
              ? {
                  ...defaultLightSquareNotationStyle,
                  ...lightSquareNotationStyle,
                }
              : {
                  ...defaultDarkSquareNotationStyle,
                  ...darkSquareNotationStyle,
                }
          }
        >
          {row ===
            (boardOrientation === 'white'
              ? '1'
              : chessboardRows.toString()) && (
            <span
              style={{ ...defaultAlphaNotationStyle, ...alphaNotationStyle }}
            >
              {column}
            </span>
          )}
          {column ===
            (boardOrientation === 'white'
              ? 'a'
              : columnIndexToChessColumn(
                  0,
                  chessboardColumns,
                  boardOrientation,
                )) && (
            <span
              style={{
                ...defaultNumericNotationStyle,
                ...numericNotationStyle,
              }}
            >
              {row}
            </span>
          )}
        </span>
      ) : null}

      {squareRenderer?.({
        piece: currentPosition[squareId] ?? null,
        square: squareId,
        children,
      }) || (
        <div
          style={{
            width: '100%',
            height: '100%',
            ...squareStyles[squareId],
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
});
