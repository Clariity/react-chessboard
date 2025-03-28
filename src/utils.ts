import type { CellDataType } from "./types";

export function generateBoard(noOfRows: number, noOfColumns: number) {
  const board: CellDataType[][] = Array.from(
    Array(noOfRows),
    () => new Array(noOfColumns)
  );

  for (let row = 0; row < noOfRows; row++) {
    for (let column = 0; column < noOfColumns; column++) {
      board[row][column] = {
        id: `${row}-${column}`, // e.g. "0-0"
        isLightSquare: (row + column) % 2 === 0,
        column: columnIndexToChessColumn(column), // e.g. a to h
        row: rowIndexToChessRow(row, noOfRows), // e.g. 1 to 8
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
