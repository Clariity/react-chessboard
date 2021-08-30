import React, { useContext, useEffect, useRef, useState } from 'react';

import { defaultPieces } from '../media/pieces';
import { convertPositionToObject, getPositionDifferences } from '../functions';

// add arrows - https://stackoverflow.com/questions/25527902/drawing-arrows-on-a-chess-board-in-javascript
// add other things from chessground
// change board orientation to 'w' or 'b'? like used in chess.js?

const ChessboardContext = React.createContext();

export function ChessboardProvider({
  animationDuration,
  arePiecesDraggable,
  boardOrientation,
  boardWidth,
  customBoardStyle,
  customDarkSquareStyle,
  customDropSquareStyle,
  customLightSquareStyle,
  customPieces,
  customSquareStyles,
  dropOffBoardAction,
  id,
  isDraggablePiece,
  getPositionObject,
  onDragOverSquare,
  onMouseOutSquare,
  onMouseOverSquare,
  onPieceClick,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  position,
  showBoardNotation,
  showSparePieces,
  children
}) {
  // position stored and displayed on board
  const [currentPosition, setCurrentPosition] = useState(convertPositionToObject(position));
  const [positionDifferences, setPositionDifferences] = useState({});

  // premove logic
  const [lastPieceColour, setLastPieceColour] = useState(undefined);
  const premovesRef = useRef([]);

  // chess pieces
  const [chessPieces, setChessPieces] = useState({ ...defaultPieces, ...customPieces });

  // whether the last move was a manual drop or not
  const [manualDrop, setManualDrop] = useState(false);

  // the most recent timeout whilst waiting for animation to complete
  const [previousTimeout, setPreviousTimeout] = useState(undefined);

  // screen size
  const [screenSize, setScreenSize] = useState(undefined);

  // if currently waiting for an animation to finish
  const [waitingForAnimation, setWaitingForAnimation] = useState(false);

  // init screen size listener
  useEffect(() => {
    function handleResize() {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // handle external position change
  useEffect(() => {
    const newPosition = convertPositionToObject(position);
    const differences = getPositionDifferences(currentPosition, newPosition);
    const newPieceColour =
      Object.keys(differences.added)?.length <= 2 ? Object.entries(differences.added)?.[0]?.[1][0] : undefined;

    // external move has come in before animation is over
    if (waitingForAnimation) {
      setCurrentPosition(newPosition);
      setWaitingForAnimation(false);
      if (previousTimeout) clearTimeout(previousTimeout);
    } else {
      if (manualDrop) {
        setCurrentPosition(newPosition);
        setWaitingForAnimation(false);
      } else {
        // if more than 2 added, then multiple pieces have moved so we don't care about last piece colour for animation
        setLastPieceColour(newPieceColour);
        setPositionDifferences(differences);
        setWaitingForAnimation(true);
        const newTimeout = setTimeout(() => {
          setCurrentPosition(newPosition);
          setWaitingForAnimation(false);
          attemptPremove(newPieceColour);
        }, animationDuration);
        setPreviousTimeout(newTimeout);
      }
    }

    // reset manual drop, ready for next move to be made by user or computer
    setManualDrop(false);
    // inform latest position information
    getPositionObject(newPosition);

    return () => {
      clearTimeout(previousTimeout);
    };
  }, [position]);

  // handle drop position change
  function handleSetPosition(sourceSq, targetSq, piece) {
    // if dropped back down, don't do anything
    if (sourceSq === targetSq) return;

    // w0, premove w1, b0, premove w2, w1 (no animation as manual drop set)
    // need to keep track of length of premoves here
    // store and place phantom pieces on drop so they can be moved again for premoves ( this will get hard af )

    // if second move is made for same colour, or there are still premoves queued, then this move needs to be added to premove queue instead of played
    if (lastPieceColour === piece[0] || premovesRef.current.length > 0) {
      const oldPremoves = premovesRef.current;
      oldPremoves.push({ sourceSq, targetSq, piece });
      premovesRef.current = oldPremoves;
      return;
    }

    // if transitioning, don't allow new drop
    if (waitingForAnimation) return;

    const newOnDropPosition = { ...currentPosition };

    setManualDrop(true);
    setLastPieceColour(piece[0]);

    if (onPieceDrop.length) {
      const isValidMove = onPieceDrop(sourceSq, targetSq, piece);
      if (!isValidMove) clearPremoves();
    } else {
      // delete if dropping off board
      if (dropOffBoardAction === 'trash' && !targetSq) {
        delete newOnDropPosition[sourceSq];
      }

      // delete source piece if not dropping from spare piece
      if (sourceSq !== 'spare') {
        delete newOnDropPosition[sourceSq];
      }

      // add piece in new position
      newOnDropPosition[targetSq] = piece;
      setCurrentPosition(newOnDropPosition);
    }

    getPositionObject(newOnDropPosition);
  }

  function attemptPremove(newPieceColour) {
    if (premovesRef.current.length === 0) return;
    const premove = premovesRef.current[0];

    // if premove is a differing colour to last move made
    if (premove.piece[0] !== undefined && premove.piece[0] !== newPieceColour && onPieceDrop.length) {
      setLastPieceColour(premove.piece[0]);
      const isValidMove = onPieceDrop(premove.sourceSq, premove.targetSq, premove.piece);
      if (isValidMove) {
        const oldPremoves = premovesRef.current;
        oldPremoves.shift();
        premovesRef.current = oldPremoves;
      } else clearPremoves();
    }

    // need to clear premove on undo, and on reset
    // for reset just check if equal to start
    // for undo, check if equal to currentPosition? (doubt this will be effective as user could double undo in 1 game state change)
  }

  function clearPremoves() {
    premovesRef.current = [];
  }

  return (
    <ChessboardContext.Provider
      value={{
        animationDuration,
        arePiecesDraggable,
        boardOrientation,
        boardWidth,
        customBoardStyle,
        customDarkSquareStyle,
        customDropSquareStyle,
        customLightSquareStyle,
        customSquareStyles,
        dropOffBoardAction,
        id,
        isDraggablePiece,
        getPositionObject,
        onDragOverSquare,
        onMouseOutSquare,
        onMouseOverSquare,
        onPieceClick,
        onPieceDrop,
        onSquareClick,
        onSquareRightClick,
        showBoardNotation,
        showSparePieces,

        chessPieces,
        currentPosition,
        handleSetPosition,
        manualDrop,
        positionDifferences,
        screenSize,
        setChessPieces,
        setCurrentPosition,
        setManualDrop,
        waitingForAnimation
      }}
    >
      {children}
    </ChessboardContext.Provider>
  );
}

export const useChessboard = () => useContext(ChessboardContext);

export default ChessboardContext;
