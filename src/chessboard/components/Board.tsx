import { useRef, useEffect } from "react";

import { Squares } from "./Squares";
import { Arrows } from "./Arrows";
import { useChessboard } from "../context/chessboard-context";
import { WhiteKing } from "./ErrorBoundary";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const { boardWidth, clearCurrentRightClickDown } = useChessboard();

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
      <Arrows />
    </div>
  ) : (
    <WhiteKing />
  );
}
