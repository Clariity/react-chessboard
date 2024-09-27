import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import { Meta } from '@storybook/react';
import { ChessX } from '../src/ChessX';

import { Chessboard, SparePiece, ChessboardDnDProvider } from '../src';
import { Piece, Square } from '../src/chessboard/types';

const buttonStyle = {
    cursor: 'pointer',
    padding: '10px 20px',
    margin: '10px 10px 0px 0px',
    borderRadius: '6px',
    backgroundColor: '#f0d9b5',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
};

const inputStyle = {
    padding: '10px 20px',
    margin: '10px 0 10px 0',
    borderRadius: '6px',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
    width: '100%',
};

const boardWrapper = {
    width: `70vw`,
    maxWidth: '70vh',
    margin: '3rem auto',
};

const meta: Meta<typeof Chessboard> = {
    title: 'Chessboard',
    component: Chessboard,
    decorators: [
        (Story) => (
            <div style={boardWrapper}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

export const ChessMyPieces = () => {
    const game = useMemo(
        //4k3/8/1P1K2P1/2R5/8/4P3/b7/8
        () => new ChessX('4x3/8/1X1X2X1/2X5/8/4X3/x7/8'),
        []
    ); // empty board
    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
        'white'
    );
    const [boardWidth, setBoardWidth] = useState(360);
    const [fenPosition, setFenPosition] = useState(game.fen());

    const handleSparePieceDrop = (piece: Piece, targetSquare: Square) => {
        const color = piece[0];
        const type = piece[1].toLowerCase();

        const currentPiece = game.getPiece(targetSquare);
        if (!currentPiece || currentPiece.color !== color) {
            return false;
        }

        game.put({ type, color }, targetSquare);

        setFenPosition(game.fen());
        return true;
    };

    const handlePieceDrop = (
        sourceSquare: Square,
        targetSquare: Square,
        piece: Piece
    ) => {
        const color = piece[0];
        const type = piece[1].toLowerCase();

        const targetPiece = game.getPiece(targetSquare);
        if (!targetPiece || targetPiece.color !== color) {
            return false;
        }

        //game.remove(sourceSquare);
        game.put({ type: 'X', color }, sourceSquare);
        game.put({ type, color }, targetSquare);

        setFenPosition(game.fen());

        return true;
    };

    const handlePieceDropOffBoard = (sourceSquare: Square, piece: Piece) => {
        game.remove(sourceSquare);
        game.put({ type: 'X', color: piece[0] }, sourceSquare);
        setFenPosition(game.fen());
    };

    const handleFenInputChange = (e) => {
        const fen = e.target.value;
        setFenPosition(fen);
        game.load(fen);
    };

    const isDraggablePiece = ({ piece, sourceSquare }): boolean => {
        return piece[1] !== 'x' && piece[1] !== 'X';
    };

    const pieces = [
        'wP',
        'wN',
        'wB',
        'wR',
        'wQ',
        'wK',
        'bP',
        'bN',
        'bB',
        'bR',
        'bQ',
        'bK',
    ];

    return (
        <div
            style={{
                ...boardWrapper,
                margin: '0 auto',
                maxWidth: '60vh',
            }}
        >
            <ChessboardDnDProvider>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            margin: `${boardWidth / 32}px ${boardWidth / 8}px`,
                        }}
                    >
                        {pieces.slice(6, 12).map((piece) => (
                            <SparePiece
                                key={piece}
                                piece={piece as Piece}
                                width={boardWidth / 8}
                                dndId="ManualBoardEditor"
                            />
                        ))}
                    </div>
                    <Chessboard
                        onBoardWidthChange={setBoardWidth}
                        id="ManualBoardEditor"
                        boardOrientation={boardOrientation}
                        position={game.fen()}
                        isDraggablePiece={isDraggablePiece}
                        onSparePieceDrop={handleSparePieceDrop}
                        onPieceDrop={handlePieceDrop}
                        onPieceDropOffBoard={handlePieceDropOffBoard}
                        dropOffBoardAction="trash"
                        customBoardStyle={{
                            borderRadius: '4px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            margin: `${boardWidth / 32}px ${boardWidth / 8}px`,
                        }}
                    >
                        {pieces.slice(0, 6).map((piece) => (
                            <SparePiece
                                key={piece}
                                piece={piece as Piece}
                                width={boardWidth / 8}
                                dndId="ManualBoardEditor"
                            />
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            //game.reset();
                            //setFenPosition(game.fen());
                        }}
                    >
                        Start position ♟️
                    </button>
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            setBoardOrientation(
                                boardOrientation === 'white' ? 'black' : 'white'
                            );
                        }}
                    >
                        Flip board 🔁
                    </button>
                </div>
                <input
                    value={fenPosition}
                    style={inputStyle}
                    onChange={handleFenInputChange}
                    placeholder="Paste FEN position to start editing"
                />
            </ChessboardDnDProvider>
        </div>
    );
};
