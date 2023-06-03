import {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { defaultPieces } from "../media/pieces";
import {
  convertPositionToObject,
  getPositionDifferences,
  isDifferentFromStart,
} from "../functions";
import {
  BoardPosition,
  ChessboardProps,
  CustomPieces,
  Piece,
  Square,
} from "../types";

interface ChessboardProviderProps extends ChessboardProps {
  boardWidth: number;
  children: ReactNode;
}

type Premove = {
  sourceSq: Square;
  targetSq: Square;
  piece: Piece;
};

type RequiredChessboardProps = Required<ChessboardProps>;

interface ChessboardProviderContext {
  // Props from user
  animationDuration: RequiredChessboardProps["animationDuration"];
  arePiecesDraggable: RequiredChessboardProps["arePiecesDraggable"];
  arePremovesAllowed: RequiredChessboardProps["arePremovesAllowed"];
  boardOrientation: RequiredChessboardProps["boardOrientation"];
  boardWidth: RequiredChessboardProps["boardWidth"];
  customArrowColor: RequiredChessboardProps["customArrowColor"];
  customBoardStyle: ChessboardProps["customBoardStyle"];
  customDarkSquareStyle: RequiredChessboardProps["customDarkSquareStyle"];
  customDropSquareStyle: RequiredChessboardProps["customDropSquareStyle"];
  customLightSquareStyle: RequiredChessboardProps["customLightSquareStyle"];
  customPremoveDarkSquareStyle: RequiredChessboardProps["customPremoveDarkSquareStyle"];
  customPremoveLightSquareStyle: RequiredChessboardProps["customPremoveLightSquareStyle"];
  customSquare: RequiredChessboardProps["customSquare"];
  customSquareStyles: ChessboardProps["customSquareStyles"];
  id: RequiredChessboardProps["id"];
  isDraggablePiece: RequiredChessboardProps["isDraggablePiece"];
  onDragOverSquare: RequiredChessboardProps["onDragOverSquare"];
  onMouseOutSquare: RequiredChessboardProps["onMouseOutSquare"];
  onMouseOverSquare: RequiredChessboardProps["onMouseOverSquare"];
  onPieceClick: RequiredChessboardProps["onPieceClick"];
  onPieceDragBegin: RequiredChessboardProps["onPieceDragBegin"];
  onPieceDragEnd: RequiredChessboardProps["onPieceDragEnd"];
  onPieceDrop: RequiredChessboardProps["onPieceDrop"];
  onPromotionPieceSelect: ChessboardProps["onPromotionPieceSelect"];
  onSquareClick: RequiredChessboardProps["onSquareClick"];
  promotionDialogVariant: RequiredChessboardProps["promotionDialogVariant"];
  showBoardNotation: RequiredChessboardProps["showBoardNotation"];
  snapToCursor: RequiredChessboardProps["snapToCursor"];

  // Exported by context
  arrows: Square[][];
  chessPieces: CustomPieces | Record<string, ReactNode>;
  clearArrows: () => void;
  clearCurrentRightClickDown: () => void;
  currentPosition: BoardPosition;
  handleSetPosition: (
    sourceSq: Square,
    targetSq: Square,
    piece: Piece,
    wasManualDropOverride?: boolean
  ) => void;
  isWaitingForAnimation: boolean;
  lastPieceColour: string | undefined;
  onRightClickDown: (square: Square) => void;
  onRightClickUp: (square: Square) => void;
  positionDifferences: { added: BoardPosition; removed: BoardPosition };
  premoves: Premove[];
  promoteFromSquare: Square | null;
  promoteToSquare: Square | null;
  setPromoteFromSquare: React.Dispatch<React.SetStateAction<Square | null>>;
  setPromoteToSquare: React.Dispatch<React.SetStateAction<Square | null>>;
  setShowPromoteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showPromoteDialog: boolean;
}

export const ChessboardContext = createContext({} as ChessboardProviderContext);

export const useChessboard = () => useContext(ChessboardContext);

export const ChessboardProvider = forwardRef(
  (
    {
      animationDuration = 300,
      areArrowsAllowed = true,
      arePiecesDraggable = true,
      arePremovesAllowed = false,
      boardOrientation = "white",
      boardWidth,
      children,
      clearPremovesOnRightClick = true,
      customArrows,
      customArrowColor = "rgb(255,170,0)",
      customBoardStyle,
      customDarkSquareStyle = { backgroundColor: "#B58863" },
      customDropSquareStyle = {
        boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
      },
      customLightSquareStyle = { backgroundColor: "#F0D9B5" },
      customPieces,
      customPremoveDarkSquareStyle = { backgroundColor: "#A42323" },
      customPremoveLightSquareStyle = { backgroundColor: "#BD2828" },
      customSquare = "div",
      customSquareStyles,
      dropOffBoardAction = "snapback",
      id = 0,
      isDraggablePiece = () => true,
      getPositionObject = () => {},
      onArrowsChange = () => {},
      onDragOverSquare = () => {},
      onMouseOutSquare = () => {},
      onMouseOverSquare = () => {},
      onPieceClick = () => {},
      onPieceDragBegin = () => {},
      onPieceDragEnd = () => {},
      onPieceDrop = () => true,
      onPromotionPieceSelect,
      onSquareClick = () => {},
      onSquareRightClick = () => {},
      position = "start",
      promotionDialogVariant = "default",
      promotionToSquare = null,
      showBoardNotation = true,
      showPromotionDialog = false,
      snapToCursor = true,
    }: ChessboardProviderProps,
    ref
  ) => {
    // position stored and displayed on board
    const [currentPosition, setCurrentPosition] = useState(
      convertPositionToObject(position)
    );

    // calculated differences between current and incoming positions
    const [positionDifferences, setPositionDifferences] = useState<{
      added: BoardPosition;
      removed: BoardPosition;
    }>({ removed: {}, added: {} });

    // colour of last piece moved to determine if premoving
    const [lastPieceColour, setLastPieceColour] =
      useState<string | undefined>(undefined);

    // show / hide promotion dialog
    const [showPromoteDialog, setShowPromoteDialog] =
      useState(showPromotionDialog);

    // which square a pawn is being promoted to
    const [promoteFromSquare, setPromoteFromSquare] =
      useState<Square | null>(null);
    const [promoteToSquare, setPromoteToSquare] =
      useState<Square | null>(promotionToSquare);

    // current premoves
    const [premoves, setPremoves] = useState<Premove[]>([]);

    // ref used to access current value during timeouts (closures)
    const premovesRef = useRef(premoves);

    // current right mouse down square
    const [currentRightClickDown, setCurrentRightClickDown] =
      useState<Square | undefined>();

    // current arrows
    const [arrows, setArrows] = useState<Square[][]>([]);

    // chess pieces/styling
    const [chessPieces, setChessPieces] = useState({
      ...defaultPieces,
      ...customPieces,
    });

    // whether the last move was a manual drop or not
    const [wasManualDrop, setWasManualDrop] = useState(false);

    // the most recent timeout whilst waiting for animation to complete
    const [previousTimeout, setPreviousTimeout] = useState<NodeJS.Timeout>();

    // if currently waiting for an animation to finish
    const [isWaitingForAnimation, setIsWaitingForAnimation] = useState(false);

    // open clearPremoves() to allow user to call on undo/reset/whenever
    useImperativeHandle(ref, () => ({
      clearPremoves(clearLastPieceColour = true) {
        clearPremoves(clearLastPieceColour);
      },
    }));

    // handle custom pieces change
    useEffect(() => {
      setChessPieces({ ...defaultPieces, ...customPieces });
    }, [customPieces]);

    // handle promote changes
    useEffect(() => {
      setShowPromoteDialog(showPromotionDialog);
      setPromoteToSquare(promotionToSquare);
    }, [promotionToSquare, showPromotionDialog]);

    // handle external position change
    useEffect(() => {
      // clear any open promotion dialogs
      clearPromotion();

      const newPosition = convertPositionToObject(position);
      const differences = getPositionDifferences(currentPosition, newPosition);
      const newPieceColour =
        Object.keys(differences.added)?.length <= 2
          ? Object.entries(differences.added)?.[0]?.[1][0]
          : undefined;

      // external move has come in before animation is over
      // cancel animation and immediately update position
      if (isWaitingForAnimation) {
        setCurrentPosition(newPosition);
        setIsWaitingForAnimation(false);
        arePremovesAllowed && attemptPremove(newPieceColour);
        if (previousTimeout) {
          clearTimeout(previousTimeout);
        }
      } else {
        // move was made using drag and drop
        if (wasManualDrop) {
          setCurrentPosition(newPosition);
          setIsWaitingForAnimation(false);
          arePremovesAllowed && attemptPremove(newPieceColour);
        } else {
          // move was made by external position change

          // if position === start then don't override newPieceColour
          // needs isDifferentFromStart in scenario where premoves have been cleared upon board reset but first move is made by computer, the last move colour would need to be updated
          if (
            isDifferentFromStart(newPosition) &&
            lastPieceColour !== undefined
          ) {
            setLastPieceColour(newPieceColour);
          } else {
            // position === start, likely a board reset
            setLastPieceColour(undefined);
          }
          setPositionDifferences(differences);

          // animate external move
          setIsWaitingForAnimation(true);
          const newTimeout = setTimeout(() => {
            setCurrentPosition(newPosition);
            setIsWaitingForAnimation(false);
            arePremovesAllowed && attemptPremove(newPieceColour);
          }, animationDuration);
          setPreviousTimeout(newTimeout);
        }
      }

      // reset manual drop, ready for next move to be made by user or external
      setWasManualDrop(false);
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
      if (customArrows && (customArrows.length !== 0 || arrows.length > 0)) {
        setArrows(customArrows);
      }
    }, [customArrows]);

    // callback when new arrows are set
    useEffect(() => {
      onArrowsChange(arrows);
    }, [arrows]);

    // handle drop position change
    function handleSetPosition(
      sourceSq: Square,
      targetSq: Square,
      piece: Piece,
      wasManualDropOverride?: boolean
    ) {
      // if dropped back down, don't do anything
      if (sourceSq === targetSq) {
        return;
      }

      clearArrows();

      // if second move is made for same colour, or there are still premoves queued, then this move needs to be added to premove queue instead of played
      // premoves length check for colour is added in because white could make 3 premoves, and then black responds to the first move (changing the last piece colour) and then white pre-moves again
      if (
        (arePremovesAllowed && isWaitingForAnimation) ||
        (arePremovesAllowed &&
          (lastPieceColour === piece[0] ||
            premovesRef.current.filter((p: Premove) => p.piece[0] === piece[0])
              .length > 0))
      ) {
        const oldPremoves: Premove[] = [...premovesRef.current];

        oldPremoves.push({ sourceSq, targetSq, piece });
        premovesRef.current = oldPremoves;
        setPremoves([...oldPremoves]);
        clearPromotion();
        return;
      }

      // if transitioning, don't allow new drop
      if (!arePremovesAllowed && isWaitingForAnimation) return;

      const newOnDropPosition = { ...currentPosition };

      setWasManualDrop(!!wasManualDropOverride);
      setLastPieceColour(piece[0]);

      // if onPieceDrop function provided, execute it, position must be updated externally and captured by useEffect above for this move to show on board
      if (onPieceDrop.length) {
        const isValidMove = onPieceDrop(sourceSq, targetSq, piece);
        if (!isValidMove) clearPremoves();
      } else {
        // delete if dropping off board
        if (dropOffBoardAction === "trash" && !targetSq) {
          delete newOnDropPosition[sourceSq];
        }

        // delete source piece
        delete newOnDropPosition[sourceSq];

        // add piece in new position
        newOnDropPosition[targetSq] = piece;
        setCurrentPosition(newOnDropPosition);
      }

      clearPromotion();

      // inform latest position information
      getPositionObject(newOnDropPosition);
    }

    function attemptPremove(newPieceColour?: string) {
      if (premovesRef.current.length === 0) return;

      // get current value of premove as this is called in a timeout so value may have changed since timeout was set
      const premove = premovesRef.current[0];

      // if premove is a differing colour to last move made, then this move can be made
      if (
        premove.piece[0] !== undefined &&
        premove.piece[0] !== newPieceColour &&
        onPieceDrop.length
      ) {
        setLastPieceColour(premove.piece[0]);
        setWasManualDrop(true); // pre-move doesn't need animation
        const isValidMove = onPieceDrop(
          premove.sourceSq,
          premove.targetSq,
          premove.piece
        );

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

    function clearPromotion() {
      setPromoteFromSquare(null);
      setPromoteToSquare(null);
      setShowPromoteDialog(false);
    }

    function onRightClickDown(square: Square) {
      setCurrentRightClickDown(square);
    }

    function onRightClickUp(square: Square) {
      if (!areArrowsAllowed) return;
      if (currentRightClickDown) {
        // same square, don't draw an arrow, but do clear premoves and run onSquareRightClick
        if (currentRightClickDown === square) {
          setCurrentRightClickDown(undefined);
          clearPremovesOnRightClick && clearPremoves(false);
          onSquareRightClick(square);
          return;
        }

        // if arrow already exists then it needs to be removed
        for (const [i] of arrows.entries()) {
          if (
            arrows[i][0] === currentRightClickDown &&
            arrows[i][1] === square
          ) {
            setArrows((oldArrows) => {
              const newArrows = [...oldArrows];
              newArrows.splice(i, 1);
              return newArrows;
            });
            return;
          }
        }

        // different square, draw an arrow
        setArrows((oldArrows) => [
          ...oldArrows,
          [currentRightClickDown, square],
        ]);
      } else setCurrentRightClickDown(undefined);
    }

    function clearCurrentRightClickDown() {
      setCurrentRightClickDown(undefined);
    }

    function clearArrows() {
      setArrows([]);
    }

    const ChessboardProviderContextValue: ChessboardProviderContext = {
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
      customSquare,
      customSquareStyles,
      id,
      isDraggablePiece,
      onDragOverSquare,
      onMouseOutSquare,
      onMouseOverSquare,
      onPieceClick,
      onPieceDragBegin,
      onPieceDragEnd,
      onPieceDrop,
      onPromotionPieceSelect,
      onSquareClick,
      showBoardNotation,
      snapToCursor,
      promotionDialogVariant,

      arrows,
      chessPieces,
      clearArrows,
      clearCurrentRightClickDown,
      currentPosition,
      handleSetPosition,
      isWaitingForAnimation,
      lastPieceColour,
      onRightClickDown,
      onRightClickUp,
      positionDifferences,
      promoteFromSquare,
      promoteToSquare,
      premoves,
      setPromoteFromSquare,
      setPromoteToSquare,
      setShowPromoteDialog,
      showPromoteDialog,
    };

    return (
      <ChessboardContext.Provider value={ChessboardProviderContextValue}>
        {children}
      </ChessboardContext.Provider>
    );
  }
);
