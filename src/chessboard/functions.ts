import { BoardOrientation, BoardPosition, Piece, Square } from "./types";
import {
  BLACK_COLUMN_VALUES,
  BLACK_ROWS,
  COLUMNS,
  START_POSITION_OBJECT,
  WHITE_COLUMN_VALUES,
  WHITE_ROWS,
} from "./consts";

/**
 * Retrieves the coordinates at the centre of the requested square, relative to the top left of the board (0, 0).
 */
export function getRelativeCoords(
  boardOrientation: BoardOrientation,
  boardWidth: number,
  square: Square
): {
  x: number;
  y: number;
} {
  const squareWidth = boardWidth / 8;
  const columns =
    boardOrientation === "white" ? WHITE_COLUMN_VALUES : BLACK_COLUMN_VALUES;
  const rows = boardOrientation === "white" ? WHITE_ROWS : BLACK_ROWS;

  const x = columns[square[0]] * squareWidth + squareWidth / 2;
  const y = rows[parseInt(square[1], 10) - 1] * squareWidth + squareWidth / 2;
  return { x, y };
}

/**
 * Returns whether the passed position is different from the start position.
 */
export function isDifferentFromStart(newPosition: BoardPosition): boolean {
  let isDifferent = false;

  (
    Object.keys(START_POSITION_OBJECT) as Array<
      keyof typeof START_POSITION_OBJECT
    >
  ).forEach((square) => {
    if (newPosition[square] !== START_POSITION_OBJECT[square])
      isDifferent = true;
  });

  (Object.keys(newPosition) as Array<keyof typeof newPosition>).forEach(
    (square) => {
      if (START_POSITION_OBJECT[square] !== newPosition[square])
        isDifferent = true;
    }
  );

  return isDifferent;
}

/**
 * Returns what pieces have been added and what pieces have been removed between board positions.
 */
export function getPositionDifferences(
  currentPosition: BoardPosition,
  newPosition: BoardPosition
): {
  added: BoardPosition;
  removed: BoardPosition;
} {
  const difference: { added: BoardPosition; removed: BoardPosition } = {
    removed: {},
    added: {},
  };

  // removed from current
  (Object.keys(currentPosition) as Array<keyof typeof currentPosition>).forEach(
    (square) => {
      if (newPosition[square] !== currentPosition[square])
        difference.removed[square] = currentPosition[square];
    }
  );

  // added from new
  (Object.keys(newPosition) as Array<keyof typeof newPosition>).forEach(
    (square) => {
      if (currentPosition[square] !== newPosition[square])
        difference.added[square] = newPosition[square];
    }
  );

  return difference;
}

/**
 * Converts a fen string or existing position object to a position object.
 */
export function convertPositionToObject(
  position: string | BoardPosition
): BoardPosition {
  if (position === "start") {
    return START_POSITION_OBJECT;
  }

  if (typeof position === "string") {
    // attempt to convert fen to position object
    return fenToObj(position);
  }

  return position;
}

function fenToObj(fen: string): BoardPosition {
  // cut off any move, castling, etc info from the end. we're only interested in position information
  fen = fen.replace(/ .+$/, "");
  const rows = fen.split("/");
  const position: BoardPosition = {};
  let currentRow = 8;

  for (let i = 0; i < 8; i++) {
    const row = rows[i].split("");
    let colIdx = 0;

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        const numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        const square = COLUMNS[colIdx] + currentRow;
        position[square as Square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }
    currentRow = currentRow - 1;
  }
  return position;
}

/**
 * Converts a fen string to a position object.
 * # - Marker for 8th row (if required)
 * $ - Market for a file (if required)
 */
export function modifiedFenToObj(fen: string): BoardPosition {
  // cut off any move, castling, etc info from the end. we're only interested in position information
  fen = fen.replace(/ .+$/, "");
  const rows = fen.split("/");

  let currentRowIdx = getStartRowIdx(rows);
  
  const position: BoardPosition = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].match(/\d+|[a-zA-Z]/g); // ab12c -> ['a', 'b', '12', 'c']
    if (!row) continue;
    let colIdx = getStartColIdx(rows[i]);

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/\d/) !== -1) {
        const numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        const square = getColumnNotation(colIdx) + currentRowIdx;
        position[square as Square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }
    currentRowIdx = currentRowIdx - 1;
  }
  return position;
}

function getStartRowIdx(rows:string[]):number {
  const eighthRowIdx = rows.findIndex(row => row.startsWith('#'))
  if (eighthRowIdx === -1) return 8;
  return eighthRowIdx + 8;
}

function getStartColIdx(row:string):number {
  const aFileIdx = row.indexOf('$')
  if (aFileIdx === -1 || aFileIdx === 0) return 0;

  const beforeMarker = row.substring(0, aFileIdx)
  const beforeMarkerSplit = beforeMarker.match(/\d+|[a-zA-Z]/g)
  if (!beforeMarkerSplit) return 0;
  
  let squaresBeforeMarker = 0;
  for (let i = 0; i < beforeMarkerSplit.length; i++) {
    if (beforeMarkerSplit[i].search(/\d/) === -1) {
      squaresBeforeMarker += 1;
      continue;
    }
    squaresBeforeMarker += parseInt(beforeMarkerSplit[i], 10)
  }
  return -squaresBeforeMarker;
}

function getColumnNotation(colIdx:number):string {
  if (colIdx < 0) {
    return String.fromCharCode(64 + Math.abs(colIdx))
  }
  return String.fromCharCode(97 + colIdx)
}

/**
 * Convert fen piece code to camel case notation. e.g. bP, wK.
 */
function fenToPieceCode(piece: string): Piece {
  // black piece
  if (piece.toLowerCase() === piece) {
    return ("b" + piece.toUpperCase()) as Piece;
  }
  // white piece
  return ("w" + piece.toUpperCase()) as Piece;
}
