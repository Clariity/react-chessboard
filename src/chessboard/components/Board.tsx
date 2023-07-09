import { useRef, useEffect } from "react";
import { Squares } from "./Squares";
import { Arrows } from "./Arrows";
import { useChessboard } from "../context/chessboard-context";
import { PromotionDialog } from "./PromotionDialog";
import { WhiteKing } from "./ErrorBoundary";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    boardWidth,
    clearCurrentRightClickDown,
    onPromotionPieceSelect,
    setShowPromoteDialog,
    showPromoteDialog,
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
      <Arrows />

      {showPromoteDialog && (
        <>
          <div
            onClick={() => {
              setShowPromoteDialog(false);
              onPromotionPieceSelect?.();
            }}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: "100",
              backgroundColor: "rgba(22,21,18,.7)",
              width: boardWidth,
              height: boardWidth,
            }}
          />
          <PromotionDialog />
        </>
      )}
    </div>
  ) : (
    <WhiteKing />
  );
}
