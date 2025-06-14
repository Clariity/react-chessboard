import type { SquareDataType, FenPieceString, PositionDataType } from './types';

export function generateBoard(
  noOfRows: number,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
) {
  const board: SquareDataType[][] = Array.from(
    Array(noOfRows),
    () => new Array(noOfColumns),
  );

  for (let row = 0; row < noOfRows; row++) {
    for (let column = 0; column < noOfColumns; column++) {
      board[row][column] = {
        squareId: `${columnIndexToChessColumn(column, noOfColumns, boardOrientation)}${rowIndexToChessRow(row, noOfRows, boardOrientation)}`, // e.g. "a8" for row 0, column 0 in white orientation
        isLightSquare: (row + column) % 2 === 0,
      };
    }
  }

  return board;
}

export function rowIndexToChessRow(
  row: number,
  noOfRows: number,
  boardOrientation: 'white' | 'black',
) {
  return boardOrientation === 'white'
    ? (noOfRows - row).toString()
    : (row + 1).toString();
}

export function columnIndexToChessColumn(
  column: number,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
) {
  return boardOrientation === 'white'
    ? String.fromCharCode(97 + column)
    : String.fromCharCode(97 + noOfColumns - column - 1);
}

export function chessColumnToColumnIndex(
  column: string,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
) {
  return boardOrientation === 'white'
    ? column.charCodeAt(0) - 97
    : noOfColumns - (column.charCodeAt(0) - 97) - 1;
}

export function chessRowToRowIndex(
  row: string,
  noOfRows: number,
  boardOrientation: 'white' | 'black',
) {
  return boardOrientation === 'white'
    ? noOfRows - Number(row)
    : Number(row) - 1;
}

export function fenStringToPositionObject(
  fen: string,
  noOfRows: number,
  noOfColumns: number,
) {
  const positionObject: PositionDataType = {};

  const rows = fen.split(' ')[0].split('/');

  // rows start from top of the board (black rank) in white orientation, and bottom of the board (white rank) in black orientation
  for (let row = 0; row < rows.length; row++) {
    let column = 0;

    for (const char of rows[row]) {
      // if char is a letter, it is a piece
      if (isNaN(Number(char))) {
        // force orientation to flip fen string when black orientation used
        const position = `${columnIndexToChessColumn(column, noOfColumns, 'white')}${rowIndexToChessRow(row, noOfRows, 'white')}`;

        // set piece at position (e.g. 0-0 for a8 on a normal board)
        positionObject[position] = {
          pieceType: fenToPieceCode(char as FenPieceString),
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
function fenToPieceCode(piece: FenPieceString) {
  // lower case is black piece
  if (piece.toLowerCase() === piece) {
    return 'b' + piece.toUpperCase();
  }

  // upper case is white piece
  return 'w' + piece.toUpperCase();
}

// todo: if already in updates, find next candidate
/**
 * Return an object with the pieces that have moved from the old position to the new position.
 * The keys are the source square names (e.g. "e2") and the values are the new square positions (e.g. "e4"), indicating that the piece in square "e2" has moved to square "e4".
 */
export function getPositionUpdates(
  oldPosition: PositionDataType,
  newPosition: PositionDataType,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
) {
  const updates: { [square: string]: string } = {};

  for (const newSquare in newPosition) {
    const candidateSquares: string[] = [];

    // the piece hasn't moved, so we don't need to do anything
    if (
      oldPosition[newSquare]?.pieceType === newPosition[newSquare].pieceType
    ) {
      continue;
    }

    for (const oldSquare in oldPosition) {
      // if the piece type is the same, and the new square is not the old square, and the piece has moved, then we have found a candidate for the new position
      if (
        oldPosition[oldSquare].pieceType === newPosition[newSquare].pieceType &&
        oldSquare !== newSquare &&
        oldPosition[oldSquare].pieceType !== newPosition[oldSquare]?.pieceType
      ) {
        candidateSquares.push(oldSquare);
      }
    }

    if (candidateSquares.length === 1) {
      // if there is only one candidate, we can just return it
      updates[candidateSquares[0]] = newSquare;
    } else {
      // if there are multiple candidates, we need to find the one that is correct to the best of our ability by standard chess rules
      for (const candidateSquare of candidateSquares) {
        // get the piece type of the candidate e.g. 'P', 'N', 'B', 'R', 'Q', 'K'
        const candidatePieceType = oldPosition[candidateSquare].pieceType[1];

        const columnDifference = Math.abs(
          chessColumnToColumnIndex(
            candidateSquare.match(/^[a-z]+/)?.[0] ?? '',
            noOfColumns,
            boardOrientation,
          ) -
            chessColumnToColumnIndex(
              newSquare.match(/^[a-z]+/)?.[0] ?? '',
              noOfColumns,
              boardOrientation,
            ),
        );
        const rowDifference = Math.abs(
          Number(candidateSquare.match(/\d+$/)?.[0] ?? '') -
            Number(newSquare.match(/\d+$/)?.[0] ?? ''),
        );
        const isOldSquareLight =
          (chessColumnToColumnIndex(
            candidateSquare.match(/^[a-z]+/)?.[0] ?? '',
            noOfColumns,
            boardOrientation,
          ) +
            Number(candidateSquare.match(/\d+$/)?.[0] ?? '')) %
            2 ===
          0;
        const isNewSquareLight =
          (chessColumnToColumnIndex(
            newSquare.match(/^[a-z]+/)?.[0] ?? '',
            noOfColumns,
            boardOrientation,
          ) +
            Number(newSquare.match(/\d+$/)?.[0] ?? '')) %
            2 ===
          0;

        // prioritise pawns on same file
        if (candidatePieceType === 'P') {
          if (
            candidateSquare.match(/^[a-z]+/)?.[0] ===
            newSquare.match(/^[a-z]+/)?.[0]
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise knights by euclidean distance
        if (candidatePieceType === 'N') {
          if (
            (columnDifference === 2 && rowDifference === 1) ||
            (columnDifference === 1 && rowDifference === 2)
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise bishops that have moved diagonally and are on the same color square
        if (candidatePieceType === 'B') {
          if (
            columnDifference === rowDifference &&
            isOldSquareLight === isNewSquareLight
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise rooks that have moved horizontally or vertically
        if (candidatePieceType === 'R') {
          if (columnDifference === 0 || rowDifference === 0) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise queens that have moved diagonally, horizontally or vertically
        if (candidatePieceType === 'Q') {
          if (
            columnDifference === 0 ||
            rowDifference === 0 ||
            columnDifference === rowDifference
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise kings that have moved one square in any direction
        if (candidatePieceType === 'K') {
          if (columnDifference <= 1 && rowDifference <= 1) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }
      }

      // if we still don't have a candidate, use the first candidate that has not been used yet
      if (
        !Object.values(updates).includes(newSquare) &&
        candidateSquares.length > 0
      ) {
        for (const candidateSquare of candidateSquares) {
          if (!Object.keys(updates).includes(candidateSquare)) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }
      }
    }
  }

  return updates;
}

/**
 * Retrieves the coordinates at the centre of the requested square, relative to the top left of the board (0, 0).
 */
export function getRelativeCoords(
  boardOrientation: 'white' | 'black',
  boardWidth: number,
  chessboardColumns: number,
  chessboardRows: number,
  square: string,
) {
  const squareWidth = boardWidth / chessboardColumns;

  const x =
    chessColumnToColumnIndex(
      square.match(/^[a-z]+/)?.[0] ?? '',
      chessboardColumns,
      boardOrientation,
    ) *
      squareWidth +
    squareWidth / 2;
  const y =
    chessRowToRowIndex(
      square.match(/\d+$/)?.[0] ?? '',
      chessboardRows,
      boardOrientation,
    ) *
      squareWidth +
    squareWidth / 2;
  return { x, y };
}
