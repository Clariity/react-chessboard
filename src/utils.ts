import type { CellDataType, FenPieceString, PieceType, PositionDataType } from "./types";

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

function chessColumnToColumnIndex(column: string) {
  return column.charCodeAt(0) - 97;
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
          isSparePiece: false,
          pieceType: fenToPieceCode(char as FenPieceString),
          position: position,
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
    return ("b" + piece.toUpperCase()) as PieceType;
  }

  // upper case is white piece
  return ("w" + piece.toUpperCase()) as PieceType;
}

// todo: if already in updates, find next candidate
/**
 * Return an object with the pieces that have moved from the old position to the new position.
 * The keys are the source square names (e.g. "e2") and the values are the new square positions (e.g. "e4"), indicating that the piece in square "e2" has moved to square "e4".
 */
export function getPositionUpdates(
  oldPosition: PositionDataType,
  newPosition: PositionDataType
) {
  const updates: { [square: string]: string } = {};

  for (const newSquare in newPosition) {
    const candidateSquares: string[] = [];

    // the piece hasn't moved, so we don't need to do anything
    if (oldPosition[newSquare]?.pieceType === newPosition[newSquare].pieceType) {
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
          chessColumnToColumnIndex(oldPosition[candidateSquare].position[0]) -
            chessColumnToColumnIndex(newSquare[0])
        );
        const rowDifference = Math.abs(
          Number(oldPosition[candidateSquare].position[1]) - Number(newSquare[1])
        );
        const isOldSquareLight =
          (chessColumnToColumnIndex(candidateSquare[0]) + Number(candidateSquare[1])) %
            2 ===
          0;
        const isNewSquareLight =
          (chessColumnToColumnIndex(newSquare[0]) + Number(newSquare[1])) % 2 === 0;

        // prioritise pawns on same file
        if (candidatePieceType === "P") {
          if (oldPosition[candidateSquare].position[0] === newSquare[0]) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise knights by euclidean distance
        if (candidatePieceType === "N") {
          if (
            (columnDifference === 2 && rowDifference === 1) ||
            (columnDifference === 1 && rowDifference === 2)
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise bishops that have moved diagonally and are on the same color square
        if (candidatePieceType === "B") {
          if (
            columnDifference === rowDifference &&
            isOldSquareLight === isNewSquareLight
          ) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise rooks that have moved horizontally or vertically
        if (candidatePieceType === "R") {
          if (columnDifference === 0 || rowDifference === 0) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }

        // prioritise queens that have moved diagonally, horizontally or vertically
        if (candidatePieceType === "Q") {
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
        if (candidatePieceType === "K") {
          if (columnDifference <= 1 && rowDifference <= 1) {
            updates[candidateSquare] = newSquare;
            break;
          }
        }
      }

      // if we still don't have a candidate, use the first candidate that has not been used yet
      if (!Object.values(updates).includes(newSquare) && candidateSquares.length > 0) {
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
