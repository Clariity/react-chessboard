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
type Col = Square[]

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
    
    materializeUnit(location: string):void
}

export function useBoardState(modifiedFen: string): BoardStateInterface {
    const [board, setBoard] = useState<BoardState>({
        rows: [[] as Square[]],
        locationToIdx: {}
    } as BoardState);

    useEffect(() => {
        const rows = modifiedFenToObj(modifiedFen);
        const board = createBoard(rows);
        setBoard(board);
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
        const targetPiece = board.rows[toIdx.row][toIdx.col].piece;
        if (targetPiece === NON_EXISTENT_SQUARE) {
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

    const materializeUnit = (location: string):void => {
        const idx = board.locationToIdx[location];
        if (!idx) {
            return;
        }
        const piece = board.rows[idx.row][idx.col].piece;
        if (piece !== NON_EXISTENT_SQUARE) {
            return;
        }
        const newRows = [...board.rows];
        newRows[idx.row][idx.col].piece = EMPTY_SQUARE;
        const newBoard = createBoard(newRows)
        setBoard(newBoard);
    }

    return {
        getNumRows,
        getNumCols,
        getSquare,
        movePiece,
        getPiece,
        getBoard,
        materializeUnit
    }

}

function modifiedFenToObj(fen: string): Row[] {
    // cut off any move, castling, etc info from the end. we're only interested in position information
    fen = fen.replace(/ .+$/, "");
    const fenRows = fen.split("/");
    
    let currentRowIdx = getFenStartRowIdx(fenRows);
    let rows:Row[] = [];

    fenRows.forEach((fenRow)=>{
        const parsedRow = fenRow.match(/\d+|[a-zA-Z]/g); // r10r -> ['r', '10', 'r']
        if (!parsedRow) return;

        let colIdx = getFenStartColIdx(fenRow);
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
    
    return rows;
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

function getFenStartRowIdx(rows:string[]):number {
    const eighthRowIdx = rows.findIndex(row => row.startsWith('#'))
    if (eighthRowIdx === -1) return 8;
    return eighthRowIdx + 8;
}

function getFenStartColIdx(row:string):number {
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

function getColumnNotation(fenColIdx:number):string {
    if (fenColIdx < 0) {
        return String.fromCharCode(64 + Math.abs(fenColIdx))
    }
    return String.fromCharCode(97 + fenColIdx)
}

function getFenColIdx(file:string):number {
    let charCode = file.charCodeAt(0)
    if (charCode >= 97) {
        return charCode - 97
    }
    return - (charCode - 64)
}

function fenToPieceCode(piece: string): string {
// black piece
if (piece.toLowerCase() === piece) {
    return ("b" + piece.toUpperCase());
}
// white piece
return ("w" + piece.toUpperCase());
}

function createBoard(rawRows:Row[]):BoardState {
    const toAdd:{
        top:number,
        bottom:number,
        left:number,
        right:number
    } = {
        top: DEFAULT_ADD_UNIT.y - numNonExistentRowsTopN(rawRows, DEFAULT_ADD_UNIT.y),
        bottom: DEFAULT_ADD_UNIT.y - numNonExistentRowsBottomN(rawRows, DEFAULT_ADD_UNIT.y),
        left:DEFAULT_ADD_UNIT.x - numNonExistentColsLeftN(rawRows, DEFAULT_ADD_UNIT.x),
        right:DEFAULT_ADD_UNIT.x - numNonExistentColsRightN(rawRows, DEFAULT_ADD_UNIT.x)
    }
    const newRows = addNesPaddingToRows(rawRows, toAdd)
    return {
        rows: newRows,
        locationToIdx: createLocationToIdx(newRows)
    }
}

function areAllSqNonExistent(row:Square[]):boolean {
return row.every((square)=>square.piece === NON_EXISTENT_SQUARE)
}

function numNonExistentRowsTopN(rows:Row[], n:number):number {
return rows.slice(0,n).filter(areAllSqNonExistent).length
}

function numNonExistentRowsBottomN(rows:Row[], n:number):number {
return rows.slice(-n).filter(areAllSqNonExistent).length
}

function numNonExistentColsLeftN(rows:Row[], n:number):number {
    let cols:Col[] = []
    for (let i = 0; i < n; i++) {
        cols.push(rows.map(row=>row[i]))
    }
    return cols.filter(areAllSqNonExistent).length
}

function numNonExistentColsRightN(rows:Row[], n:number):number {
    let cols:Col[] = []
    for (let i = 0; i < n; i++) {
        cols.push(rows.map(row=>row[row.length - 1 - i]))
    }
    return cols.filter(areAllSqNonExistent).length
}

function addNesPaddingToRows(rows:Row[], toAdd:{
    top:number,
    bottom:number,
    left:number,
    right:number
}):Row[] {
    const lrPaddedRows = rows.map(row=>addLRNesPaddingToRow(row, toAdd.left, toAdd.right))
    const paddedRows = addTBNesPaddingToRows(lrPaddedRows, toAdd.top, toAdd.bottom)
    return paddedRows
}

function nonExistentRow(rowLength: number, startingFenColIdx:number, rank:string):Row {
    const newRow:Row = []
    for (let i = 0; i < rowLength; i++) {
        let fenColIdx = startingFenColIdx + i
        newRow.push({
            piece: NON_EXISTENT_SQUARE, 
            rank: rank, 
            file: getColumnNotation(fenColIdx)
        })
    }
    return newRow
}

function addLRNesPaddingToRow(row:Row, left:number, right:number):Row {
    const newRow:Row = []
    for (let i = 0; i < left; i++) {
        const offset = left-i
        const fenColIdx = getFenColIdx(row[0].file) - offset
        newRow.push({
            piece: NON_EXISTENT_SQUARE, 
            rank: row[0].rank, 
            file: getColumnNotation(fenColIdx)
        })
    }
    row.forEach(square=>{
        newRow.push(square)
    })
    for (let i = 0; i < right; i++) {
        const offset = i+1
        const fenColIdx = getFenColIdx(row[row.length-1].file) + offset
        newRow.push({
            piece: NON_EXISTENT_SQUARE, 
            rank: row[0].rank, 
            file: getColumnNotation(fenColIdx)
        })
    }
    return newRow
}

function addTBNesPaddingToRows(rows:Row[], top:number, bottom:number):Row[] {
    const newRows:Row[] = []
    const rowLength = rows[0].length
    const startingFenColIdx = getFenColIdx(rows[0][0].file)
    const topRank = rows[0][0].rank
    const bottomRank = rows[rows.length-1][0].rank

    for (let i = 0; i < top; i++) {
        const rank = (parseInt(topRank, 10) + top - i).toString()
        newRows.push(nonExistentRow(rowLength, startingFenColIdx, rank))
    }

    rows.forEach(row=>{
        newRows.push(row)
    })

    for (let i = 0; i < bottom; i++) {
        const rank = (parseInt(bottomRank, 10) - i - 1).toString()
        newRows.push(nonExistentRow(rowLength, startingFenColIdx, rank))
    }
    return newRows
}
