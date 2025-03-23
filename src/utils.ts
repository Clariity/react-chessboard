import type { CellDataType } from "./types";

export function generateBoard(BOARD_SIZE: number) {
  const board: CellDataType[][] = Array.from(
    Array(BOARD_SIZE),
    () => new Array(BOARD_SIZE)
  );

  let isLightSquare = false;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
      if (column % BOARD_SIZE !== 0) {
        isLightSquare = !isLightSquare;
      }

      board[row][column] = {
        id: `${row}-${column}`,
        isLightSquare,
        column: columnIndexToChessColumn(column),
        row: rowIndexToChessRow(row, BOARD_SIZE),
      };
    }
  }

  return board;
}

export function rowIndexToChessRow(row: number, BOARD_SIZE: number) {
  return (BOARD_SIZE - row).toString();
}

export function columnIndexToChessColumn(column: number) {
  return String.fromCharCode(97 + column);
}
