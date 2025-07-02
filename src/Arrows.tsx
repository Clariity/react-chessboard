import { Fragment } from 'react';

import { useChessboardContext } from './ChessboardProvider';
import { getRelativeCoords } from './utils';

type Props = {
  boardWidth: number | undefined;
  boardHeight: number | undefined;
};

export function Arrows({ boardWidth, boardHeight }: Props) {
  const {
    id,
    arrows,
    arrowOptions,
    boardOrientation,
    chessboardColumns,
    chessboardRows,
    internalArrows,
    newArrowStartSquare,
    newArrowOverSquare,
  } = useChessboardContext();

  if (!boardWidth) {
    return null;
  }

  const currentlyDrawingArrow =
    newArrowStartSquare &&
    newArrowOverSquare &&
    newArrowStartSquare !== newArrowOverSquare.square
      ? {
          startSquare: newArrowStartSquare,
          endSquare: newArrowOverSquare.square,
          color: newArrowOverSquare.color,
        }
      : null;

  const arrowsToDraw = currentlyDrawingArrow
    ? [...arrows, ...internalArrows, currentlyDrawingArrow]
    : [...arrows, ...internalArrows];

  return (
    <svg
      width={boardWidth}
      height={boardHeight}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: '20', // place above pieces
      }}
    >
      {arrowsToDraw.map((arrow, i) => {
        const from = getRelativeCoords(
          boardOrientation,
          boardWidth,
          chessboardColumns,
          chessboardRows,
          arrow.startSquare,
        );
        const to = getRelativeCoords(
          boardOrientation,
          boardWidth,
          chessboardColumns,
          chessboardRows,
          arrow.endSquare,
        );

        // we want to shorten the arrow length so the tip of the arrow is more central to the target square instead of running over the center
        const squareWidth = boardWidth / chessboardColumns;
        let ARROW_LENGTH_REDUCER =
          squareWidth / arrowOptions.arrowLengthReducerDenominator;

        const isArrowActive =
          currentlyDrawingArrow && i === arrowsToDraw.length - 1;

        // if there are different arrows targeting the same square make their length a bit shorter
        if (
          arrowsToDraw.some(
            (restArrow) =>
              restArrow.startSquare !== arrow.startSquare &&
              restArrow.endSquare === arrow.endSquare,
          ) &&
          !isArrowActive
        ) {
          ARROW_LENGTH_REDUCER =
            squareWidth / arrowOptions.sameTargetArrowLengthReducerDenominator;
        }

        // Calculate the difference in x and y coordinates between start and end points
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        // Calculate the total distance between points using Pythagorean theorem
        // This gives us the length of the arrow if it went from center to center
        const r = Math.hypot(dy, dx);

        // Calculate the new end point for the arrow
        // We subtract ARROW_LENGTH_REDUCER from the total distance to make the arrow
        // stop before reaching the center of the target square
        const end = {
          // Calculate new end x coordinate by:
          // 1. Taking the original x direction (dx)
          // 2. Scaling it by (r - ARROW_LENGTH_REDUCER) / r to shorten it
          // 3. Adding to the starting x coordinate
          x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
          // Same calculation for y coordinate
          y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
        };

        return (
          <Fragment
            key={`${id}-arrow-${arrow.startSquare}-${arrow.endSquare}${
              isArrowActive ? '-active' : ''
            }`}
          >
            <marker
              id={`${id}-arrowhead-${i}-${arrow.startSquare}-${arrow.endSquare}`}
              markerWidth="2"
              markerHeight="2.5"
              refX="1.25"
              refY="1.25"
              orient="auto"
            >
              <polygon points="0.3 0, 2 1.25, 0.3 2.5" fill={arrow.color} />
            </marker>
            <line
              x1={from.x}
              y1={from.y}
              x2={end.x}
              y2={end.y}
              opacity={
                isArrowActive
                  ? arrowOptions.activeOpacity
                  : arrowOptions.opacity
              }
              stroke={arrow.color}
              strokeWidth={
                isArrowActive
                  ? arrowOptions.activeArrowWidthMultiplier *
                    (squareWidth / arrowOptions.arrowWidthDenominator)
                  : squareWidth / arrowOptions.arrowWidthDenominator
              }
              markerEnd={`url(#${id}-arrowhead-${i}-${arrow.startSquare}-${arrow.endSquare})`}
            />
          </Fragment>
        );
      })}
    </svg>
  );
}
