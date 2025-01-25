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
    modifiedFen,
  } = useChessboard();

  const modifiedFenRows = modifiedFen.split("/");
  const numRows = modifiedFenRows.length;

  let eighthRowIdx = modifiedFenRows.findIndex(row => row.includes("#"));
  if (eighthRowIdx === -1) {
    eighthRowIdx = 0
  }

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
      {[...Array(numRows)].map((_, r) => {
        const rowIdx = boardOrientation === "white" ? r : numRows - r - 1
        const row = modifiedFenRows[rowIdx].replace("#", "")
        const numCols = getNumCols(row);
        let aFileIdx = row.indexOf("$");
        if (aFileIdx === -1) {
          aFileIdx = 0
        }
        return (
          <div
            key={r.toString()}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              width: boardWidth,
            }}
          >
            {[...Array(numCols)].map((_, c) => {
              const square = getSquare(
                boardOrientation,
                r, c,
                eighthRowIdx,
                aFileIdx,
                numRows,
                numCols,
              );

              const sqSplit = square.match(/\d+|[a-zA-Z]/g)
              if (!sqSplit) return
              const file = sqSplit[0]
              const rank = sqSplit[1]

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
                  {showBoardNotation && <Notation row={r} col={c} file={file} rank={rank} numRows={numRows} />}
                </Square>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function getNumCols(row: string): number {
  const rowSplit = row.match(/\d+|[a-zA-Z]/g);
  if (!rowSplit) return 0;
  let numCols = 0
  for (let i = 0; i < rowSplit.length; i++) {
    if (rowSplit[i].search(/\d/) === -1) {
      numCols += 1;
      continue;
    }
    numCols += parseInt(rowSplit[i], 10)
  }
  return numCols
}

function getSquare(
  boardOrientation: string,
  row: number,
  col: number,
  eighthRowIdx: number,
  aFileIdx: number,
  numRows: number,
  numCols: number,
): string {
  // don't ask how this makes sense, I spent 1 hour thinking about it and it does
  if (boardOrientation === "white") {
    const rank = eighthRowIdx + 8 - row;
    let file: string;
    const distToAFile = col - aFileIdx;
    if (distToAFile >= 0) {
      file = String.fromCharCode(96 + col);
    } else {
      file = String.fromCharCode(64 + Math.abs(distToAFile));
    }
    return `${file}${rank}`;
  } else {
    const rank = 9 - numRows + row + eighthRowIdx
    let file: string
    if (aFileIdx + col <= numCols - 1) {
      file = String.fromCharCode(97 + numCols - 1 - aFileIdx - col)
    } else {
      file = String.fromCharCode(65 + Math.abs(aFileIdx + col - numCols))
    }
    return `${file}${rank}`
  }
}
