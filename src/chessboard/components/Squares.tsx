import { useState, useMemo } from "react";
import { useChessboard } from "../context/chessboard-context";
import { Coords, Piece as Pc, Square as Sq } from "../types";
import { Notation } from "./Notation";
import { Piece } from "./Piece";
import { Square, SquareType } from "./Square";
import { BoardState, NON_EXISTENT_SQUARE, Idx, Square as SqState } from "../boardState";

const A_FILE = "a";
const H_FILE = "h";
const FIRST_RANK = "1";
const EIGHTH_RANK = "8";

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
    id,
    premoves,
    showBoardNotation,
    boardState,
  } = useChessboard();

  const numRows = boardState.getNumRows();
  const numCols = boardState.getNumCols();

  let rowArray = Array.from({ length: numRows }, (_, i) => i);
  let colArray = Array.from({ length: numCols }, (_, i) => i);

  if (boardOrientation === "black") {
    rowArray.reverse();
    colArray.reverse();
  }

  const { top, left } = getBoardRelativeOffsets(boardState.getBoard(), boardWidth);

  const [highlightedIdxs, setHighlightedIdxs] = useState<Idx[]>([]);
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

  const onMouseOverSquare = (location: Sq) => {
    const unitSqIdxs = boardState.getUnitSqIdxs(location);
    setHighlightedIdxs(unitSqIdxs);
  }

  const onMouseOutSquare = () => {
    setHighlightedIdxs([]);
  }

  const getSqType = (sq: SqState, idx: Idx): SquareType => {
    if (sq.piece !== NON_EXISTENT_SQUARE) {
      return SquareType.Normal;
    }
    if (highlightedIdxs.some(id => id.row === idx.row && id.col === idx.col)) {
      return SquareType.NonExistentHighlighted;
    }
    return SquareType.NonExistent;
  }

  return (
    <div
      data-boardid={id}
      style={{
        position: "relative",
        top: top,
        left: left
      }}
    >
      {rowArray.map((r) => {

        return (
          <div
            key={r.toString()}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              width: boardWidth,
            }}
          >
            {colArray.map((c) => {
              const sq = boardState.getSquare(r, c);
              const location = `${sq.file}${sq.rank}`

              const squareHasPremove = premoves.find(
                (p) => p.sourceSq === location || p.targetSq === location
              );

              const squareHasPremoveTarget = premovesHistory
                .filter(
                  ({ premovesRoute }) =>
                    premovesRoute.at(-1)?.targetSq === location
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
                  location={location}
                  squareColor={getSqColor(sq.file, sq.rank)}
                  setSquares={setSquares}
                  squareHasPremove={!!squareHasPremove}
                  clickCallback={boardState.materializeUnit}
                  squareType={getSqType(sq, { row: r, col: c })}
                  mouseOverCb={onMouseOverSquare}
                  mouseOutCb={onMouseOutSquare}
                >
                  {!squareHasPremove && boardState.getPiece(location) !== "" && (
                    <Piece
                      piece={boardState.getPiece(location) as Pc}
                      square={location}
                      squares={squares}
                    />
                  )}
                  {squareHasPremoveTarget && (
                    <Piece
                      isPremovedPiece={true}
                      piece={squareHasPremoveTarget.piece}
                      square={location}
                      squares={squares}
                    />
                  )}
                  {showBoardNotation && <Notation
                    showNumbers={showNumbers(sq.file, boardOrientation)}
                    showLetters={showLetters(sq.rank, boardOrientation)}
                    file={sq.file}
                    rank={sq.rank}
                    squareColor={getSqColor(sq.file, sq.rank)}
                  />}
                </Square>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function getSqColor(file: string, rank: string): "white" | "black" {
  const rankInt = parseInt(rank, 10);
  let fileInt = file.charCodeAt(0);

  if (fileInt < 97) { // capital letters
    // A -> 65 which is odd, I am converting it to an even nummber
    // because I want the A1 square to be white
    fileInt += 1
  }
  if (isEven(rankInt) === isEven(fileInt)) {
    return "black"
  }
  return "white"
}

function isEven(num: number): boolean {
  return num % 2 === 0;
}

function showNumbers(file: string, boardOrientation: "white" | "black"): boolean {
  if (boardOrientation === "white") {
    return file === A_FILE;
  }
  return file === H_FILE;
}

function showLetters(rank: string, boardOrientation: "white" | "black"): boolean {
  if (boardOrientation === "white") {
    return rank === FIRST_RANK;
  }
  return rank === EIGHTH_RANK;
}

function getBoardRelativeOffsets(board: BoardState, boardWidth: number): { top: number, left: number } {
  const a8Location = "a8";
  const a8LocationIdx = board.locationToIdx[a8Location];
  if (!a8LocationIdx) {
    return {
      top: 0,
      left: 0
    }
  }
  return {
    top: -a8LocationIdx.row * boardWidth / 8,
    left: -a8LocationIdx.col * boardWidth / 8
  }
}
