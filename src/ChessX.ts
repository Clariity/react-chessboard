export class ChessX {
    private board: string[][];

    constructor(fenx: string) {
        this.board = this.parseFENX(fenx);
    }

    // Method to return the current FENX string
    fen(): string {
        return this.generateFENX();
    }

    // Method to place a piece on a target square
    put(
        { type, color }: { type: string; color: string },
        targetSquare: string
    ): void {
        const file = targetSquare.charCodeAt(0) - 'a'.charCodeAt(0); // converts a-h to 0-7
        const rank = 8 - parseInt(targetSquare[1], 10); // converts 1-8 to 7-0
        const piece = color === 'w' ? type.toUpperCase() : type.toLowerCase();
        this.board[rank][file] = piece;
    }

    // Method to remove a piece from the target square
    remove(square: string): void {
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // converts a-h to 0-7
        const rank = 8 - parseInt(square[1], 10); // converts 1-8 to 7-0
        this.board[rank][file] = ''; // Set the square to empty
    }

    // Method to load a new FENX and update the internal board state
    load(fenx: string): void {
        this.board = this.parseFENX(fenx); // Parse and load the new FENX
    }

    // Method to get the piece on a given square
    getPiece(square: string): { type: string; color: string } | null {
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // converts a-h to 0-7
        const rank = 8 - parseInt(square[1], 10); // converts 1-8 to 7-0
        const piece = this.board[rank][file];

        if (!piece) {
            return null; // No piece on the square
        }

        const type = piece.toUpperCase(); // Piece type is always uppercase
        const color = piece === piece.toUpperCase() ? 'w' : 'b'; // Uppercase means white, lowercase means black
        return { type, color };
    }

    // Helper method to parse FENX into a 2D array (board state)
    private parseFENX(fenx: string): string[][] {
        const rows = fenx.split(' ')[0].split('/'); // Only handle the piece placement part of FENX
        const board: string[][] = [];

        for (const row of rows) {
            const boardRow: string[] = [];
            for (const char of row) {
                if (!isNaN(parseInt(char))) {
                    // Empty squares
                    for (let i = 0; i < parseInt(char); i++) {
                        boardRow.push('');
                    }
                } else {
                    // Piece
                    boardRow.push(char);
                }
            }
            board.push(boardRow);
        }
        return board;
    }

    // Helper method to generate FENX from the current board state
    private generateFENX(): string {
        return this.board
            .map((row) => {
                let emptyCount = 0;
                let fenRow = '';

                for (const square of row) {
                    if (square === '') {
                        emptyCount++;
                    } else {
                        if (emptyCount > 0) {
                            fenRow += emptyCount;
                            emptyCount = 0;
                        }
                        fenRow += square;
                    }
                }

                if (emptyCount > 0) {
                    fenRow += emptyCount;
                }

                return fenRow;
            })
            .join('/');
    }
}

// // Initialize a new ChessX game with FENX notation
// const chessX = new ChessX(
//     'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
// );
// console.log(chessX.fen()); // Print the initial FENX

// // Place a white X on d4
// chessX.put({ type: 'x', color: 'w' }, 'd4');
// console.log(chessX.fen()); // FENX after placing X on d4

// // Remove the piece from d4
// chessX.remove('d4');
// console.log(chessX.fen()); // FENX after removing the piece from d4

// // Place a black knight on e5
// chessX.put({ type: 'n', color: 'b' }, 'e5');
// console.log(chessX.fen()); // FENX after placing a black knight on e5

// // Remove the black knight from e5
// chessX.remove('e5');
// console.log(chessX.fen()); // FENX after removing the black knight from e5
// Initialize a ChessX game with an initial FENX
// const chessX = new ChessX(
//     'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
// );
// console.log(chessX.fen()); // Print the initial FENX

// // Load a new FENX position
// chessX.load('rnbqkbnr/pppppppp/8/8/3x4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
// console.log(chessX.fen()); // Print the new FENX after loading

// // Load another FENX
// chessX.load('rnbqkbnr/pppppppp/8/8/4X3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
// console.log(chessX.fen()); // Print the new FENX after loading
// Initialize a ChessX game with an initial FENX
// const chessX = new ChessX(
//     'rnbqkbnr/pppppppp/8/8/3x4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
// );

// // Get the piece on d4 (should be black X)
// console.log(chessX.getPiece('d4')); // Output: { type: "X", color: "b" }

// // Get the piece on a2 (should be white pawn)
// console.log(chessX.getPiece('a2')); // Output: { type: "P", color: "w" }

// // Get the piece on e1 (should be white king)
// console.log(chessX.getPiece('e1')); // Output: { type: "K", color: "w" }

// // Get the piece on a5 (should be empty)
// console.log(chessX.getPiece('a5')); // Output: null
