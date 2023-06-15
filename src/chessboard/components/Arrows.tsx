import { Fragment } from "react";

import { getRelativeCoords } from "../functions";
import { useChessboard } from "../context/chessboard-context";
import { Square } from "../types";

export const Arrows = () => {
  const {
    arrows,
    newArrow,
    boardOrientation,
    boardWidth,

    customArrowColor,
  } = useChessboard();

  const arrowsList = [...arrows, newArrow].filter(Boolean) as Square[][];
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
        const from = getRelativeCoords(boardOrientation, boardWidth, arrow[0]);
        const to = getRelativeCoords(boardOrientation, boardWidth, arrow[1]);
        let ARROW_LENGTH_REDUCER = boardWidth / 32;

        const isArrowActive = i === arrows.length;
        // if there are differnet arrows targeting same square make thier length a bit shorter
        if (
          arrows.some(
            (restArrow) =>
              restArrow[0] !== arrow[0] && restArrow[1] === arrow[1]
          ) &&
          !isArrowActive
        ) {
          ARROW_LENGTH_REDUCER = boardWidth / 16;
        }
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        const r = Math.hypot(dy, dx);

        const end = {
          x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
          y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
        };

        return (
          <Fragment
            key={`${arrow[0]}-${arrow[1]}${isArrowActive ? "active" : ""}`}
          >
            <marker
              id="arrowhead"
              markerWidth="2"
              markerHeight="2.5"
              refX="1.25"
              refY="1.25"
              orient="auto"
            >
              <polygon
                points="0.3 0, 2 1.25, 0.3 2.5"
                fill={customArrowColor}
              />
            </marker>
            <line
              x1={from.x}
              y1={from.y}
              x2={end.x}
              y2={end.y}
              opacity={isArrowActive ? "0.5" : "0.65"}
              stroke={customArrowColor}
              strokeWidth={
                isArrowActive ? (0.9 * boardWidth) / 36 : boardWidth / 36
              }
              markerEnd="url(#arrowhead)"
            />
          </Fragment>
        );
      })}
    </svg>
  );
};
