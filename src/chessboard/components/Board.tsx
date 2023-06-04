import { Fragment, useRef, useEffect } from "react";

import { getRelativeCoords } from "../functions";
import { Squares } from "./Squares";
import { useChessboard } from "../context/chessboard-context";
import { WhiteKing } from "./ErrorBoundary";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    arrows,
    newArrow,
    boardOrientation,
    boardWidth,
    clearCurrentRightClickDown,
    customArrowColor,
  } = useChessboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        boardRef.current &&
        !boardRef.current.contains(event.target as Node)
      ) {
        clearCurrentRightClickDown();
      }
    }

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return boardWidth ? (
    <div ref={boardRef} style={{ position: "relative" }}>
      <Squares />
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
        {[...arrows, newArrow].map((arrow, i) => {
          if (!arrow) return;
          const from = getRelativeCoords(
            boardOrientation,
            boardWidth,
            arrow[0]
          );
          const to = getRelativeCoords(boardOrientation, boardWidth, arrow[1]);

          const dx = to.x - from.x;
          const dy = to.y - from.y;

          const r = Math.hypot(dy, dx);

          const end = {
            x: from.x + (dx * (r - boardWidth / 16)) / r,
            y: from.y + (dy * (r - boardWidth / 16)) / r,
          };

          return (
            <Fragment
              key={`${arrow[0]}-${arrow[1]}${i === arrows.length ? "new" : ""}`}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="2"
                  markerHeight="2.5"
                  refX="0"
                  refY="1.25"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 2 1.25, 0 2.5"
                    style={{ fill: customArrowColor }}
                  />
                </marker>
              </defs>
              <line
                x1={from.x}
                y1={from.y}
                x2={end.x}
                y2={end.y}
                style={{
                  stroke: customArrowColor,
                  strokeWidth: boardWidth / 36,
                }}
                markerEnd="url(#arrowhead)"
              />
            </Fragment>
          );
        })}
      </svg>
    </div>
  ) : (
    <WhiteKing />
  );
}
