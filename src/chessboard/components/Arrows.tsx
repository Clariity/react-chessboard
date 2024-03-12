import { Fragment } from "react";

import { getRelativeCoords } from "../functions";
import { useChessboard } from "../context/chessboard-context";
import { Arrow } from "../types";

export const Arrows = () => {
  const {
    arrows,
    newArrow,
    boardOrientation,
    boardWidth,

    customArrowColor: primaryArrowCollor,
  } = useChessboard();
  const arrowsList = [...arrows, newArrow].filter(Boolean) as Arrow[];

  return (
    <svg
      width={boardWidth}
      height={boardWidth}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        pointerEvents: "none",
        zIndex: "10",
      }}
    >
      {arrowsList.map((arrow, i) => {
        const [arrowStartField, arrowEndField, arrowColor] = arrow;
        if (arrowStartField === arrowEndField) return null;
        const from = getRelativeCoords(
          boardOrientation,
          boardWidth,
          arrowStartField
        );
        const to = getRelativeCoords(
          boardOrientation,
          boardWidth,
          arrowEndField
        );

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const r = Math.hypot(dy, dx);

        const isArrowActive = i === arrows.length;

        // Knight move is where the move is a 2:1 ratio, but to limit it to legal knight moves
        // we check the difference between the start and end rank is 2 or less
        const isKnightMove =
          (Math.abs(dx) === 2 * Math.abs(dy) ||
            Math.abs(dy) === 2 * Math.abs(dx)) &&
          Math.abs(
            parseInt(arrowStartField.split("")[1]) -
              parseInt(arrowEndField.split("")[1])
          ) <= 2;

        let ARROW_LENGTH_REDUCER = boardWidth / 32;
        // if there are different arrows targeting the same square make their length a bit shorter
        if (
          arrows.some(
            (restArrow) =>
              restArrow[0] !== arrowStartField && restArrow[1] === arrowEndField
          ) &&
          !isArrowActive
        ) {
          // Knight move should be reduced by less than normal arrows
          // to allow for up to 8 arrows into one square nicely
          ARROW_LENGTH_REDUCER = isKnightMove
            ? boardWidth / 24
            : boardWidth / 16;
        }

        const end = {
          x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
          y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
        };
        // The mid point is only used in Knight move drawing
        // and here we prioritise drawing along the long edge
        // by defining the midpoint depending on which is bigger X or Y
        const mid =
          Math.abs(dx) < Math.abs(dy)
            ? {
                x: from.x,
                y: end.y,
              }
            : {
                x: end.x,
                y: from.y,
              };

        // Define the path, either with or without a mid point
        let pathD = isKnightMove
          ? `M${from.x},${from.y} L${mid.x},${mid.y} L${end.x},${end.y}`
          : `M${from.x},${from.y} L${end.x},${end.y}`;

        return (
          <Fragment
            key={`${arrowStartField}-${arrowEndField}${
              isArrowActive ? "-active" : ""
            }`}
          >
            <marker
              id={`arrowhead-${i}`}
              markerWidth="2"
              markerHeight="2.5"
              refX="1.25"
              refY="1.25"
              orient="auto"
            >
              <polygon
                points="0.3 0, 2 1.25, 0.3 2.5"
                fill={arrowColor ?? primaryArrowCollor}
              />
            </marker>
            <path
              d={pathD}
              opacity={isArrowActive ? "0.5" : "0.65"}
              stroke={arrowColor ?? primaryArrowCollor}
              strokeWidth={
                isArrowActive ? (0.9 * boardWidth) / 40 : boardWidth / 40
              }
              markerEnd={`url(#arrowhead-${i})`}
              fill="none"
            />
          </Fragment>
        );
      })}
    </svg>
  );
};
