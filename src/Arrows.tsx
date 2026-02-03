import { Fragment } from 'react';

import { useChessboardContext } from './ChessboardProvider';
import { getRelativeCoords } from './utils';

export function Arrows() {
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

  const viewBoxWidth = 2048;
  const viewBoxHeight = viewBoxWidth * (chessboardRows / chessboardColumns);

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
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      style={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: '20', // place above pieces
      }}
    >
      {arrowsToDraw.map((arrow, i) => {
        const from = getRelativeCoords(
          boardOrientation,
          viewBoxWidth,
          chessboardColumns,
          chessboardRows,
          arrow.startSquare,
        );
        const to = getRelativeCoords(
          boardOrientation,
          viewBoxWidth,
          chessboardColumns,
          chessboardRows,
          arrow.endSquare,
        );

        // we want to shorten the arrow length so the tip of the arrow is more central to the target square instead of running over the center
        const squareWidth = viewBoxWidth / chessboardColumns;
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

        // Distance to offset the arrow start from the square center
        const startOffset = squareWidth * arrowOptions.arrowStartOffset;

        let pathD: string;

        // Knight move - draw an L-shaped arrow
        if (r === Math.hypot(1, 2) * squareWidth) {
          // Determine which direction to draw the long leg first
          // We prioritize the longer axis for visual clarity
          const isVerticalFirst = Math.abs(dx) < Math.abs(dy);

          // Offset start point in the direction of the first leg
          const start = isVerticalFirst
            ? { x: from.x, y: from.y + Math.sign(dy) * startOffset }
            : { x: from.x + Math.sign(dx) * startOffset, y: from.y };

          // Corner where the L-shape turns
          const corner = isVerticalFirst
            ? { x: from.x, y: to.y }
            : { x: to.x, y: from.y };

          // Calculate the final leg from corner to target
          const dxFinalLeg = to.x - corner.x;
          const dyFinalLeg = to.y - corner.y;
          const finalLegLength = squareWidth; // Always one square for knight moves

          // Shorten the final leg so the arrow stops before the target center
          const end = {
            x:
              corner.x +
              (dxFinalLeg * (finalLegLength - ARROW_LENGTH_REDUCER)) /
                finalLegLength,
            y:
              corner.y +
              (dyFinalLeg * (finalLegLength - ARROW_LENGTH_REDUCER)) /
                finalLegLength,
          };

          pathD = `M${start.x},${start.y} L${corner.x},${corner.y} L${end.x},${end.y}`;
        } else {
          // Straight arrow - offset start point toward the target
          const start = {
            x: from.x + (dx * startOffset) / r,
            y: from.y + (dy * startOffset) / r,
          };

          // Shorten the arrow so it stops before the target center
          const end = {
            x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
            y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
          };

          pathD = `M${start.x},${start.y} L${end.x},${end.y}`;
        }

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
            <path
              d={pathD}
              fill="none"
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
