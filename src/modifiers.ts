import { Modifier } from '@dnd-kit/core';

export const preventDragOffBoard = (
  boardId: string,
  draggingPiecePosition: string,
): Modifier => {
  return ({ transform }) => {
    const boardElement =
      typeof document !== 'undefined'
        ? document.getElementById(`${boardId}-board`)
        : null;

    if (!boardElement) {
      return transform;
    }

    // Get the a1 square to determine square size using data attributes
    const boardRect = boardElement.getBoundingClientRect();
    const a1Square = boardElement.querySelector(
      '[data-column="a"][data-row="1"]',
    );

    if (!a1Square) {
      return transform;
    }

    const squareWidth = a1Square.getBoundingClientRect().width;
    const halfSquareWidth = squareWidth / 2;

    // Extract column and row from position (supports multi-char columns/rows)
    const match = draggingPiecePosition.match(/^([a-zA-Z]+)(\d+)$/);
    if (!match) {
      return transform;
    }
    const [, col, row] = match;

    // Get the starting position of the piece
    const startSquare = boardElement.querySelector(
      `[data-column="${col}"][data-row="${row}"]`,
    );

    if (!startSquare) {
      return transform;
    }

    const startSquareRect = startSquare.getBoundingClientRect();
    const startX = startSquareRect.left + halfSquareWidth - boardRect.left;
    const startY = startSquareRect.top + halfSquareWidth - boardRect.top;

    // Clamp so the center of the piece can go exactly half a square width outside the board
    const minX = -startX;
    const maxX = boardRect.width - startX;
    const minY = -startY;
    const maxY = boardRect.height - startY;

    const clampedX = Math.min(Math.max(transform.x, minX), maxX);
    const clampedY = Math.min(Math.max(transform.y, minY), maxY);

    return {
      ...transform,
      x: clampedX,
      y: clampedY,
    };
  };
};
