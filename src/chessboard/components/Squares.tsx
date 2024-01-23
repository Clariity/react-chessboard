import { useState, useMemo } from "react";
import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";
import { Coords, Piece as Pc, Square as Sq } from "../types";
import { Notation } from "./Notation";
import { Piece } from "./Piece";
import { Square } from "./Square";

// this type shows the exact route of each premoved piece
type PremovesHistory = {
  piece: Pc;
  premovesRoute: { sourceSq: Sq; targetSq: Sq; index: number }[];
}[];

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

  const premovesHistory: PremovesHistory = useMemo(() => {
    const result: PremovesHistory = [];
    // if premoves aren't allowed, don't waste time on calculations
    if (!arePremovesAllowed) return [];

    premoves.forEach((premove, index) => {
      const { sourceSq, targetSq, piece } = premove;

      // determine if the premove is made by an already premoved piece
      const relatedPremovedPiece = result.find(
        (p) =>
          p.piece === piece && p.premovesRoute.at(-1)?.targetSq === sourceSq
      );

      // if premove has been made by already premoved piece then write the move to its `premovesRoute` field to be able find its final destination later
      if (relatedPremovedPiece) {
        relatedPremovedPiece.premovesRoute.push({ sourceSq, targetSq, index });
      }
      // if premove has been made by standard piece create new object in `premovesHistory` where we will keep its own premoves
      else {
        result.push({
          piece,
          // index is useful for scenarios where two or more pieces are targeting the same square
          premovesRoute: [{ sourceSq, targetSq, index }],
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
                    premovesRoute.at(-1)?.targetSq === square
                )
                //the premoved piece with the higher index will be shown, as it is the latest one
                .sort(
                  (a, b) =>
                    b.premovesRoute.at(-1)?.index! -
                    a.premovesRoute.at(-1)?.index!
                )
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
