import { useState, useMemo } from "react";
import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";
import { Coords, Piece as Pc, Square as Sq } from "../types";
import { Notation } from "./Notation";
import { Piece } from "./Piece";
import { Square } from "./Square";

export function Squares() {
  const [squares, setSquares] = useState<{ [square in Sq]?: Coords }>({});

  const {
    arePremovesAllowed,
    boardOrientation,
    boardWidth,
    currentPosition,
    id,
    premoves,
    showBoardNotation,
  } = useChessboard();

  const premovesHistory: any[] = useMemo(() => {
    const result: any[] = [];
    // if premoves aren't allowed, don't waste time on calculations
    if (!arePremovesAllowed) return [];

    premoves.forEach((premove, index) => {
      const { sourceSq, targetSq, piece } = premove;

      // find is the premove made by already premoved piece or not
      const relatedPremovedPiece = result.find(
        (p) => p.piece === piece && p.premovesRoute.at(-1).targetSq === sourceSq
      );

      // if premove has been made by already premoved piece then write the move to its `premovesRoute` field to be able find its final destination
      if (relatedPremovedPiece) {
        relatedPremovedPiece.premovesRoute.push({ sourceSq, targetSq });
        relatedPremovedPiece.index = index;
      }
      // if premove has been made by standard piece creeate new object in `premovesHistory` where we will keep its own premoves
      else {
        result.push({
          piece,
          premovesRoute: [{ sourceSq, targetSq }],
          // index is useful for scenarios when two or more pieces were targetted to the same square
          index,
        });
      }
    });

    return result;
  }, [premoves]);

  return (
    <div data-boardid={id}>
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

              const squareHasPremoveTarget = premovesHistory
                .filter(
                  ({ premovesRoute }) =>
                    premovesRoute.at(-1).targetSq === square
                )
                //the premoved piece with the higher index will be shown, as it is the latest one
                .sort((a, b) => b.index - a.index)
                .at(0);

              return (
                <Square
                  key={`${c}${r}`}
                  square={square}
                  squareColor={squareColor}
                  setSquares={setSquares}
                  squareHasPremove={!!squareHasPremove}
                >
                  {!squareHasPremove && currentPosition[square] && (
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
