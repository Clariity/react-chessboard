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
        let ARROW_LENGTH_REDUCER = boardWidth / 64;

        const isArrowActive = i === arrows.length;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const r = Math.hypot(dy, dx);

        const end = {
          x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
          y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
        };
        const mid = {
          x: from.x,
          y: end.y,
        };

        const isKnightMove =
          Math.abs(dx) === 2 * Math.abs(dy) ||
          Math.abs(dy) === 2 * Math.abs(dx);

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
              fill="transparent"
            />
          </Fragment>
        );
      })}
    </svg>
  );
};
