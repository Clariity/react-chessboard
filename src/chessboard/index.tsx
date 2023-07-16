import { forwardRef, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { Board } from "./components/Board";
import { SparePiece } from "./components/SparePiece";
import { ChessboardProps } from "./types";
import { ChessboardProvider } from "./context/chessboard-context";
import { CustomDragLayer } from "./components/CustomDragLayer";
import { ErrorBoundary } from "./components/ErrorBoundary";

// spare pieces component
// semantic release with github actions
// improved arrows

// npm publish --tag alpha
// npm publish --dry-run

// rewrite readme, add link to react-chessboard-svg for simply showing a chess position
// add other things from chessground
// change board orientation to 'w' or 'b'? like used in chess.js?
// Animation on premove? - only set manual drop to false in useEffect if not attempting successful premove

export type ClearPremoves = {
  clearPremoves: (clearLastPieceColour?: boolean) => void;
};

export const Chessboard = forwardRef<ClearPremoves, ChessboardProps>(
  (props, ref) => {
    const {
      customDndBackend,
      customDndBackendOptions,
      showSparePiecesPanel,
      ...otherProps
    } = props;
    const [clientWindow, setClientWindow] = useState<Window>();
    const [backendSet, setBackendSet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [boardWidth, setBoardWidth] = useState(props.boardWidth);

    const boardRef = useRef<HTMLObjectElement>(null);

    useEffect(() => {
      setIsMobile("ontouchstart" in window);
      setBackendSet(true);
      setClientWindow(window);
    }, []);

    useEffect(() => {
      if (props.boardWidth === undefined && boardRef.current?.offsetWidth) {
        const resizeObserver = new ResizeObserver(() => {
          setBoardWidth(boardRef.current?.offsetWidth as number);
        });
        resizeObserver.observe(boardRef.current);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }, [boardRef.current, clientWindow]);

    const backend =
      customDndBackend || (isMobile ? TouchBackend : HTML5Backend);

    return backendSet && clientWindow ? (
      <ErrorBoundary>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div ref={boardRef} style={{ width: "100%" }} />
          <DndProvider
            backend={backend}
            context={clientWindow}
            options={customDndBackend ? customDndBackendOptions : undefined}
          >
            {boardWidth && (
              <ChessboardProvider
                boardWidth={boardWidth}
                {...otherProps}
                ref={ref}
              >
                <CustomDragLayer />
                {/* TODO manage spare piece components in a normal way */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {showSparePiecesPanel && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        marginRight: "24px",
                      }}
                    >
                      <SparePiece piece="bK" />
                      <SparePiece piece="bP" />
                      <SparePiece piece="bN" />
                      <SparePiece piece="bR" />
                      <SparePiece piece="bQ" />
                      <SparePiece piece="bB" />
                    </div>
                  )}
                  <Board />
                  {showSparePiecesPanel && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        marginLeft: "24px",
                      }}
                    >
                      <SparePiece piece="wK" />
                      <SparePiece piece="wP" />
                      <SparePiece piece="wN" />
                      <SparePiece piece="wR" />
                      <SparePiece piece="wQ" />
                      <SparePiece piece="wB" />
                    </div>
                  )}
                </div>
              </ChessboardProvider>
            )}
          </DndProvider>
        </div>
      </ErrorBoundary>
    ) : null;
  }
);
