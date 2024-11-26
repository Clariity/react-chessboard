import { BoardDimensions, BoardOrientation, BoardPosition, Piece, Square } from "./types";
import {
  COLUMNS,
  START_POSITION_OBJECT,
} from "./consts";

/**
 * Retrieves the coordinates at the centre of the requested square, relative to the top left of the board (0, 0).
 */
export function getRelativeCoords(
  boardDimensions: BoardDimensions = { rows: 8, columns: 8 },
  boardOrientation: BoardOrientation,
  boardWidth: number,
  boardHeight: number,
  square: Square
): { x: number; y: number } {
  const squareWidth = boardWidth / boardDimensions.columns;
  const squareHeight = boardHeight / boardDimensions.rows;

  const columnIndex = boardOrientation === "white"
    ? square[0].charCodeAt(0) - "a".charCodeAt(0)
    : boardDimensions.columns - 1 - (square[0].charCodeAt(0) - "a".charCodeAt(0));

  const match = square.match(/\d+/);
  const rowIndex = boardOrientation === "white"
    ? boardDimensions.rows - (match ? parseInt(match[0], 10) : 8)
    : (match ? parseInt(match[0], 10) : 8) - 1;

  const x = columnIndex * squareWidth + squareWidth / 2;
  const y = rowIndex * squareHeight + squareHeight / 2;
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

/**
 * Converts a fen string to a position object.
 */
function fenToObj(fen: string, boardDimensions: BoardDimensions = { rows: 8, columns: 8}): BoardPosition {
  if (!isValidFen(fen)) return {};

  // cut off any move, castling, etc info from the end. we're only interested in position information
  fen = fen.replace(/ .+$/, "");
  const rows = fen.split("/");
  const position: BoardPosition = {};
  let currentRow = boardDimensions.rows;

  const numericRegex = /^\d+$/;

  for (let i = 0; i < boardDimensions.rows; i++) {
    const row = rows[i].split("");
    let colIdx = 0;

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (numericRegex.test(row[j])) {
        const numEmptySquares = parseInt(row[j], 10);

        // Validate the range explicitly
        if (numEmptySquares >= 1 && numEmptySquares <= boardDimensions.columns) {
          colIdx += numEmptySquares;
        } else {
          throw new Error(
            `Invalid FEN: empty square count (${numEmptySquares}) exceeds board dimensions (${boardDimensions.columns})`
          );
        }
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
 * Returns whether string is valid fen notation.
 */
function isValidFen(fen: string, boardDimensions: BoardDimensions = { rows: 8, columns: 8}): boolean {
  // cut off any move, castling, etc info from the end. we're only interested in position information
  fen = fen.replace(/ .+$/, "");

  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen);

  // fen should be 8 sections separated by slashes
  const chunks = fen.split("/");
  if (chunks.length !== boardDimensions.columns) return false;

  // check each section
  for (let i = 0; i < boardDimensions.columns; i++) {
    if (chunks[i].length !== boardDimensions.columns || chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
      return false;
    }
  }

  return true;
}

/**
 * Expand out fen notation to countable characters for validation
 */
function expandFenEmptySquares(fen: string, boardDimensions: BoardDimensions = { rows: 8, columns: 8 }): string {
  return fen.replace(/\d/g, (match) => {
    const numEmptySquares = parseInt(match, 10);

    if (numEmptySquares > boardDimensions.columns) {
      throw new Error(
        `Invalid FEN: empty square count (${numEmptySquares}) exceeds board dimensions (${boardDimensions.columns})`
      );
    }

    // Expand the number into a string of "1"s
    return "1".repeat(numEmptySquares);
  });
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
