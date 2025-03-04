import { useState, useEffect } from 'react';

export const NON_EXISTENT_SQUARE = 'E';
export const EMPTY_SQUARE = 'e';
export const DEFAULT_ADD_UNIT: AddUnit = {
    x: 1,
    y: 1
}

type Square = {
    piece: string; // could be a piece or empty/non-existent square
    rank: string; 
    file: string;
}

type Row = Square[]

export type BoardState = {
    rows: Row[]
    locationToIdx: {
        [key: string]: {
            row: number;
            col: number;
        }
    }
};

// This is the unit of squares player can add to the board.
//
// if x = 1, y = 1, then the unit is 1 square
// if x = 2, y = 2, then the unit is 4 squares (2x2)
// if x = 2, y = 1, then unit is a 2 squares as a 2x1 rectangle
type AddUnit = {
    x: number;
    y: number;
}

export interface BoardStateInterface {
    getNumRows(): number;
    getNumCols(): number;
    getSquare(row: number, col: number): Square;
    movePiece(from:string, to:string): void;
    getPiece(location: string): string;
    getBoard(): BoardState;
    // to be extended later to expand the board
}

export function useBoardState(modifiedFen: string): BoardStateInterface {
    const [board, setBoard] = useState<BoardState>({
        rows: [[] as Square[]],
        locationToIdx: {}
    } as BoardState);

    useEffect(() => {
        const rawBoard = modifiedFenToObj(modifiedFen);
        // TODO: expand the board to add fillable non existent squares
        // to make sure number of squares in all rows are equal
        setBoard(rawBoard);
    }, [modifiedFen]);
    
    const getNumRows = () => {
        return board.rows.length;
    }

    const getNumCols = () => {
        return board.rows[0].length;
    }

    const getSquare = (row: number, col: number) => {
        return board.rows[row][col];
    }

    const movePiece = (from:string, to:string) => {
        const fromIdx = board.locationToIdx[from];
        const toIdx = board.locationToIdx[to];
        if (!fromIdx || !toIdx) {
            return;
        }
        const piece = board.rows[fromIdx.row][fromIdx.col].piece;
        if (piece === EMPTY_SQUARE || piece === NON_EXISTENT_SQUARE) {
            return;
        }
        const newRows = [...board.rows];

        newRows[fromIdx.row][fromIdx.col].piece = EMPTY_SQUARE;
        newRows[toIdx.row][toIdx.col].piece = piece;

        setBoard({
            ...board,
            rows: newRows,
        });
    }

    const getPiece = (location: string): string => {
        const idx = board.locationToIdx[location];
        if (!idx) {
            return "";
        }
        const piece = board.rows[idx.row][idx.col].piece;
        if (piece == EMPTY_SQUARE || piece == NON_EXISTENT_SQUARE) {
            return "";
        }
        return piece;
    }

    const getBoard = (): BoardState => {
        return board;
    }

    return {
        getNumRows,
        getNumCols,
        getSquare,
        movePiece,
        getPiece,
        getBoard
    }

}

function modifiedFenToObj(fen: string): BoardState {
    // cut off any move, castling, etc info from the end. we're only interested in position information
    fen = fen.replace(/ .+$/, "");
    const fenRows = fen.split("/");
    
    let currentRowIdx = getStartRowIdx(fenRows);
    let rows:Row[] = [];

    fenRows.forEach((fenRow)=>{
        const parsedRow = fenRow.match(/\d+|[a-zA-Z]/g); // r10r -> ['r', '10', 'r']
        if (!parsedRow) return;

        let colIdx = getStartColIdx(fenRow);
        let row:Row = [];

        //TODO: clean this up later so we wont need so many layers of indentations
        parsedRow.forEach((unit)=>{
            if (unit.search(/\d/) !== -1) { // number signifies empty squares
                const numEmptySquares = parseInt(unit, 10);
                for (let i = 0; i < numEmptySquares; i++) {
                    row.push({
                        piece: EMPTY_SQUARE,
                        rank: currentRowIdx.toString(),
                        file: getColumnNotation(colIdx)
                    })
                    colIdx += 1;
                }
            } else if (unit == NON_EXISTENT_SQUARE) {
                row.push({
                    piece: NON_EXISTENT_SQUARE,
                    rank: currentRowIdx.toString(),
                    file: getColumnNotation(colIdx)
                })
                colIdx += 1;
            } else { // if its not empty square or non-existent square, it must be a piece
                row.push({
                    piece: fenToPieceCode(unit),
                    rank: currentRowIdx.toString(),
                    file: getColumnNotation(colIdx)
                })
                colIdx += 1;
            }
        })

        rows.push(row);
        currentRowIdx -= 1;
    })
    
    return {
        rows: rows,
        locationToIdx: createLocationToIdx(rows)
    };
}

function createLocationToIdx(rows:Row[]):{
    [key: string]: {
        row: number;
        col: number;
    }
} {
    const locationToIdx: {
        [key: string]: {
            row: number;
            col: number;
        }
    } = {};

    rows.forEach((row,rowIdx)=>{
        row.forEach((square,colIdx)=>{
            locationToIdx[`${square.file}${square.rank}`] = {
                row: rowIdx,
                col: colIdx
            }
        })
    })

    return locationToIdx;
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

  function fenToPieceCode(piece: string): string {
    // black piece
    if (piece.toLowerCase() === piece) {
      return ("b" + piece.toUpperCase());
    }
    // white piece
    return ("w" + piece.toUpperCase());
  }
