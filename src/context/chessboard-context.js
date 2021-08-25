import React, { useContext, useEffect, useState } from 'react';

import { defaultPieces } from '../media/pieces';
import { convertPositionToObject, getPositionDifferences } from '../functions';

// add arrows - https://stackoverflow.com/questions/25527902/drawing-arrows-on-a-chess-board-in-javascript
// add other things from chessground
// change board orientation to 'w' or 'b'? like used in chess.js?

// npm adduser
// npm login
// npm publish

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

  // chess pieces
  const [chessPieces, setChessPieces] = useState({ ...defaultPieces, ...customPieces });

  // whether the last move was a manual drop or not
  const [manualDrop, setManualDrop] = useState(false);

  // the most recent timeout whilst waiting for animation to complete
  const [previousTimeout, setPreviousTimeout] = useState();

  // screen size
  const [screenSize, setScreenSize] = useState();

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

    // external move has come in before animation is over
    if (waitingForAnimation) {
      setCurrentPosition(newPosition);
      setWaitingForAnimation(false);
      if (previousTimeout) clearTimeout(previousTimeout);
    } else {
      // update source and target attributes
      if (manualDrop) {
        setCurrentPosition(newPosition);
        setWaitingForAnimation(false);
      } else {
        setWaitingForAnimation(true);
        setPositionDifferences(getPositionDifferences(currentPosition, newPosition));
        const newTimeout = setTimeout(() => {
          setCurrentPosition(newPosition);
          setWaitingForAnimation(false);
        }, animationDuration);
        setPreviousTimeout(newTimeout);
      }
    }

    // reset manual drop, ready for next move to be made by user or computer
    setManualDrop(false);

    return () => {
      clearTimeout(previousTimeout);
    };
  }, [position]);

  // handle drop position change
  function handleSetPosition(sourceSq, targetSq, piece) {
    // if dropped back down, don't do anything. if transitioning, don't allow new drop
    if (sourceSq === targetSq || waitingForAnimation) return;

    const newOnDropPosition = { ...currentPosition };

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

    setManualDrop(true);
    getPositionObject(newOnDropPosition);

    if (onPieceDrop.length) onPieceDrop(sourceSq, targetSq, piece);
    else setCurrentPosition(newOnDropPosition);
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
