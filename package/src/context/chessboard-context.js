import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { defaultPieces } from '../media/pieces';
import { convertPositionToObject, getPositionDifferences, isDifferentFromStart } from '../functions';

// add arrows - https://stackoverflow.com/questions/25527902/drawing-arrows-on-a-chess-board-in-javascript
// add other things from chessground
// change board orientation to 'w' or 'b'? like used in chess.js?

// keep onSquareClick, but add onPieceClick to send both square and piece
// this is because in the current ClickToMove example, if blacks turn to move, you can click on a White piece and then on a black piece thats out of reach, and it will try to make the move and then reset firstClick

// Animation on premove? - only set manual drop to false in useEffect if not attempting successful premove

// try DisplayBoard again

export const ChessboardContext = React.createContext();

export const useChessboard = () => useContext(ChessboardContext);

export const ChessboardProvider = forwardRef(
  (
    {
      animationDuration,
      areArrowsAllowed,
      arePiecesDraggable,
      arePremovesAllowed,
      boardOrientation,
      boardWidth,
      clearPremovesOnRightClick,
      customArrows,
      customArrowColor,
      customBoardStyle,
      customDarkSquareStyle,
      customDropSquareStyle,
      customLightSquareStyle,
      customPieces,
      customPremoveDarkSquareStyle,
      customPremoveLightSquareStyle,
      customSquareStyles,
      dropOffBoardAction,
      id,
      isDraggablePiece,
      getPositionObject,
      onDragOverSquare,
      onMouseOutSquare,
      onMouseOverSquare,
      onPieceClick,
      onPieceDragBegin,
      onPieceDragEnd,
      onPieceDrop,
      onSquareClick,
      onSquareRightClick,
      position,
      showBoardNotation,
      showSparePieces,
      snapToCursor,
      children
    },
    ref
  ) => {
    // position stored and displayed on board
    const [currentPosition, setCurrentPosition] = useState(convertPositionToObject(position));

    // calculated differences between current and incoming positions
    const [positionDifferences, setPositionDifferences] = useState({});

    // colour of last piece moved to determine if premoving
    const [lastPieceColour, setLastPieceColour] = useState(undefined);
    // current premoves
    const [premoves, setPremoves] = useState([]);
    // ref used to access current value during timeouts (closures)
    const premovesRef = useRef(premoves);

    // current right mouse down square
    const [currentRightClickDown, setCurrentRightClickDown] = useState();
    // current arrows
    const [arrows, setArrows] = useState([]);

    // chess pieces/styling
    const [chessPieces, setChessPieces] = useState({ ...defaultPieces, ...customPieces });

    // whether the last move was a manual drop or not
    const [manualDrop, setManualDrop] = useState(false);

    // the most recent timeout whilst waiting for animation to complete
    const [previousTimeout, setPreviousTimeout] = useState(undefined);

    // if currently waiting for an animation to finish
    const [waitingForAnimation, setWaitingForAnimation] = useState(false);

    // open clearPremoves() to allow user to call on undo/reset/whenever
    useImperativeHandle(ref, () => ({
      clearPremoves() {
        clearPremoves();
      }
    }));

    // handle custom pieces change
    useEffect(() => {
      setChessPieces({ ...defaultPieces, ...customPieces });
    }, [customPieces]);

    // handle external position change
    useEffect(() => {
      const newPosition = convertPositionToObject(position);
      const differences = getPositionDifferences(currentPosition, newPosition);
      const newPieceColour =
        Object.keys(differences.added)?.length <= 2 ? Object.entries(differences.added)?.[0]?.[1][0] : undefined;

      // external move has come in before animation is over
      // cancel animation and immediately update position
      if (waitingForAnimation) {
        setCurrentPosition(newPosition);
        setWaitingForAnimation(false);
        arePremovesAllowed && attemptPremove(newPieceColour);
        if (previousTimeout) {
          clearTimeout(previousTimeout);
        }
      } else {
        // move was made using drag and drop
        if (manualDrop) {
          setCurrentPosition(newPosition);
          setWaitingForAnimation(false);
          arePremovesAllowed && attemptPremove(newPieceColour);
        } else {
          // move was made by external position change

          // if position === start then don't override newPieceColour
          // needs isDifferentFromStart in scenario where premoves have been cleared upon board reset but first move is made by computer, the last move colour would need to be updated
          if (isDifferentFromStart(newPosition) && lastPieceColour !== undefined) {
            setLastPieceColour(newPieceColour);
          } else {
            // position === start, likely a board reset
            setLastPieceColour(undefined);
          }
          setPositionDifferences(differences);

          // animate external move
          setWaitingForAnimation(true);
          const newTimeout = setTimeout(() => {
            setCurrentPosition(newPosition);
            setWaitingForAnimation(false);
            arePremovesAllowed && attemptPremove(newPieceColour);
          }, animationDuration);
          setPreviousTimeout(newTimeout);
        }
      }

      // reset manual drop, ready for next move to be made by user or external
      setManualDrop(false);
      // inform latest position information
      getPositionObject(newPosition);
      // clear arrows
      clearArrows();

      // clear timeout on unmount
      return () => {
        clearTimeout(previousTimeout);
      };
    }, [position]);

    // handle external arrows change
    useEffect(() => {
      setArrows(customArrows);
    }, [customArrows]);

    // handle drop position change
    function handleSetPosition(sourceSq, targetSq, piece) {
      // if dropped back down, don't do anything
      if (sourceSq === targetSq) {
        return;
      }

      clearArrows();

      // if second move is made for same colour, or there are still premoves queued, then this move needs to be added to premove queue instead of played
      // premoves length check for colour is added in because white could make 3 premoves, and then black responds to the first move (changing the last piece colour) and then white pre-moves again
      if (
        (arePremovesAllowed && waitingForAnimation) ||
        (arePremovesAllowed &&
          (lastPieceColour === piece[0] || premovesRef.current.filter((p) => p.piece[0] === piece[0]).length > 0))
      ) {
        const oldPremoves = [...premovesRef.current];
        oldPremoves.push({ sourceSq, targetSq, piece });
        premovesRef.current = oldPremoves;
        setPremoves([...oldPremoves]);
        return;
      }

      // if transitioning, don't allow new drop
      if (!arePremovesAllowed && waitingForAnimation) return;

      const newOnDropPosition = { ...currentPosition };

      setManualDrop(true);
      setLastPieceColour(piece[0]);

      // if onPieceDrop function provided, execute it, position must be updated externally and captured by useEffect above for this move to show on board
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

      // inform latest position information
      getPositionObject(newOnDropPosition);
    }

    function attemptPremove(newPieceColour) {
      if (premovesRef.current.length === 0) return;

      // get current value of premove as this is called in a timeout so value may have changed since timeout was set
      const premove = premovesRef.current[0];

      // if premove is a differing colour to last move made, then this move can be made
      if (premove.piece[0] !== undefined && premove.piece[0] !== newPieceColour && onPieceDrop.length) {
        setLastPieceColour(premove.piece[0]);
        setManualDrop(true); // pre-move doesn't need animation
        const isValidMove = onPieceDrop(premove.sourceSq, premove.targetSq, premove.piece);

        // premove was successful and can be removed from queue
        if (isValidMove) {
          const oldPremoves = [...premovesRef.current];
          oldPremoves.shift();
          premovesRef.current = oldPremoves;
          setPremoves([...oldPremoves]);
        } else {
          // premove wasn't successful, clear premove queue
          clearPremoves();
        }
      }
    }

    function clearPremoves(clearLastPieceColour = true) {
      // don't clear when right clicking to clear, otherwise you won't be able to premove again before next go
      if (clearLastPieceColour) setLastPieceColour(undefined);
      premovesRef.current = [];
      setPremoves([]);
    }

    function onRightClickDown(square) {
      setCurrentRightClickDown(square);
    }

    function onRightClickUp(square) {
      if (!areArrowsAllowed) return;
      if (currentRightClickDown) {
        // same square, don't draw an arrow, but do clear premoves and run onSquareRightClick
        if (currentRightClickDown === square) {
          setCurrentRightClickDown(null);
          clearPremovesOnRightClick && clearPremoves(false);
          onSquareRightClick(square);
          return;
        }

        // if arrow already exists then it needs to be removed
        for (const i in arrows) {
          if (arrows[i][0] === currentRightClickDown && arrows[i][1] === square) {
            setArrows((oldArrows) => {
              const newArrows = [...oldArrows];
              newArrows.splice(i, 1);
              return newArrows;
            });
            return;
          }
        }

        // different square, draw an arrow
        setArrows((oldArrows) => [...oldArrows, [currentRightClickDown, square]]);
      } else setCurrentRightClickDown(null);
    }

    function clearCurrentRightClickDown() {
      setCurrentRightClickDown(null);
    }

    function clearArrows() {
      setArrows([]);
    }

    return (
      <ChessboardContext.Provider
        value={{
          animationDuration,
          arePiecesDraggable,
          arePremovesAllowed,
          boardOrientation,
          boardWidth,
          customArrowColor,
          customBoardStyle,
          customDarkSquareStyle,
          customDropSquareStyle,
          customLightSquareStyle,
          customPremoveDarkSquareStyle,
          customPremoveLightSquareStyle,
          customSquareStyles,
          dropOffBoardAction,
          id,
          isDraggablePiece,
          getPositionObject,
          onDragOverSquare,
          onMouseOutSquare,
          onMouseOverSquare,
          onPieceClick,
          onPieceDragBegin,
          onPieceDragEnd,
          onPieceDrop,
          onSquareClick,
          onSquareRightClick,
          showBoardNotation,
          showSparePieces,
          snapToCursor,

          arrows,
          chessPieces,
          clearArrows,
          clearCurrentRightClickDown,
          clearPremoves,
          currentPosition,
          handleSetPosition,
          lastPieceColour,
          manualDrop,
          onRightClickDown,
          onRightClickUp,
          positionDifferences,
          premoves,
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
);
