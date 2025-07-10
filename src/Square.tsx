import { memo } from 'react';

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
  const {
    id,
    allowDrawingArrows,
    boardOrientation,
    chessboardColumns,
    chessboardRows,
    currentPosition,
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
    onSquareRightClick,
    squareRenderer,
    newArrowStartSquare,
    setNewArrowStartSquare,
    setNewArrowOverSquare,
    drawArrow,
    clearArrows,
  } = useChessboardContext();

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
      onContextMenu={(e) => {
        e.preventDefault();
        onSquareRightClick?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        });
      }}
      onMouseDown={(e) => {
        if (e.button === 2 && allowDrawingArrows) {
          setNewArrowStartSquare(squareId);
        }
      }}
      onMouseUp={(e) => {
        if (e.button === 0) {
          clearArrows();
        }
        if (e.button === 2) {
          if (newArrowStartSquare) {
            drawArrow(squareId, {
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
            });
          }
        }
      }}
      onMouseOver={(e) => {
        // right mouse button is held down and we are drawing an arrow
        if (e.buttons === 2 && newArrowStartSquare) {
          setNewArrowOverSquare(squareId, {
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
          });
        }
        onMouseOverSquare?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        });
      }}
      onMouseLeave={() =>
        onMouseOutSquare?.({
          piece: currentPosition[squareId] ?? null,
          square: squareId,
        })
      }
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
