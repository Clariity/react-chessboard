import { useState } from "react";
import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";
import { Coords, Piece as Pc, Square as Sq } from "../types";
import { Notation } from "./Notation";
import { Piece } from "./Piece";
import { Square } from "./Square";

export function Squares() {
  const [squares, setSquares] = useState<{ [square in Sq]?: Coords }>({});

  const {
    boardOrientation,
    boardWidth,
    currentPosition,
    customBoardStyle,
    id,
    premoves,
    showBoardNotation,
  } = useChessboard();

  return (
    <div
      data-boardid={id}
      style={{ ...boardStyles(boardWidth), ...customBoardStyle }}
    >
      {[...Array(8)].map((_, r) => {
        return (
          <div
            key={r.toString()}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              width: boardWidth,
            }}
          >
            {[...Array(8)].map((_, c) => {
              const square =
                boardOrientation === "black"
                  ? ((COLUMNS[7 - c] + (r + 1)) as Sq)
                  : ((COLUMNS[c] + (8 - r)) as Sq);
              const squareColor = c % 2 === r % 2 ? "white" : "black";
              const squareHasPremove = premoves.find(
                (p) => p.sourceSq === square || p.targetSq === square
              );
              const squareHasPremoveTarget = premoves.find(
                (p) => p.targetSq === square
              );

              return (
                <Square
                  key={`${c}${r}`}
                  square={square}
                  squareColor={squareColor}
                  setSquares={setSquares}
                  squareHasPremove={!!squareHasPremove}
                >
                  {currentPosition[square] && (
                    <Piece
                      piece={currentPosition[square] as Pc}
                      square={square}
                      squares={squares}
                    />
                  )}
                  {squareHasPremoveTarget && (
                    <Piece
                      isPremovedPiece={true}
                      piece={squareHasPremoveTarget.piece}
                      square={square}
                      squares={squares}
                    />
                  )}
                  {showBoardNotation && <Notation row={r} col={c} />}
                </Square>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const boardStyles = (width: number) => ({
  cursor: "default",
  height: width,
  width,
});
