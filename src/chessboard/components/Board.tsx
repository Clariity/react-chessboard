import { Fragment, useRef, useEffect } from "react";

import { getRelativeCoords } from "../functions";
import { Squares } from "./Squares";
import { PromotionOption } from "../types";
import { useChessboard } from "../context/chessboard-context";
import { WhiteKing } from "./ErrorBoundary";
import { SelectPromotionDialog } from "./SelectPromotionDialog";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    arrows,
    boardOrientation,
    boardWidth,
    clearCurrentRightClickDown,
    customArrowColor,
    promotion,
  } = useChessboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
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
        {arrows.map((arrow) => {
          const from = getRelativeCoords(boardOrientation, boardWidth, arrow[0]);
          const to = getRelativeCoords(boardOrientation, boardWidth, arrow[1]);

          return (
            <Fragment key={`${arrow[0]}-${arrow[1]}`}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="2"
                  markerHeight="2.5"
                  refX="1.25"
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
                x2={to.x}
                y2={to.y}
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
      {promotion.isDialogOpen && (
        <SelectPromotionDialog
          handlePromotion={(option: PromotionOption) => {
            if (promotion) {
              promotion.onPromotionSelect(option);
            }
          }}
          popupCoords={
            promotion.targetSquare &&
            getRelativeCoords(boardOrientation, boardWidth, promotion.targetSquare)
          }
        />
      )}
    </div>
  ) : (
    <WhiteKing />
  );
}
