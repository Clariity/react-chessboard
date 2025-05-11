import type { CellDataType, fenPieceString, PieceType, PositionDataType } from "./types";

export function generateBoard(noOfRows: number, noOfColumns: number) {
  const board: CellDataType[][] = Array.from(
    Array(noOfRows),
    () => new Array(noOfColumns)
  );

  for (let row = 0; row < noOfRows; row++) {
    for (let column = 0; column < noOfColumns; column++) {
      board[row][column] = {
        cellId: `${columnIndexToChessColumn(column)}${rowIndexToChessRow(row, noOfRows)}`, // e.g. "a8" for row 0, column 0
        isLightSquare: (row + column) % 2 === 0,
      };
    }
  }

  return board;
}

export function rowIndexToChessRow(row: number, noOfRows: number) {
  return (noOfRows - row).toString();
}

export function columnIndexToChessColumn(column: number) {
  return String.fromCharCode(97 + column);
}

export function fenStringToPositionObject(fen: string, noOfRows: number) {
  const positionObject: PositionDataType = {};

  const rows = fen.split(" ")[0].split("/");

  // rows start from top of the board (black rank)
  for (let row = 0; row < rows.length; row++) {
    let column = 0;

    for (const char of rows[row]) {
      // if char is a letter, it is a piece
      if (isNaN(Number(char))) {
        const position = `${columnIndexToChessColumn(column)}${rowIndexToChessRow(row, noOfRows)}`;

        // set piece at position (e.g. 0-0 for a8 on a normal board)
        positionObject[position] = {
          position: position,
          pieceType: fenToPieceCode(char as fenPieceString),
        };

        // increment column for next piece
        column++;
      } else {
        // if char is a number, it is empty squares, skip that many columns
        column += Number(char);
      }
    }
  }

  return positionObject;
}

/**
 * Convert fen piece code (e.g. p, N) to camel case notation (e.g. bP, wK).
 */
function fenToPieceCode(piece: fenPieceString) {
  // lower case is black piece
  if (piece.toLowerCase() === piece) {
    return ("b" + piece.toUpperCase()) as PieceType;
  }

  // upper case is white piece
  return ("w" + piece.toUpperCase()) as PieceType;
}
