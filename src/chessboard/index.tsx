import { forwardRef, useEffect, useRef, useState } from "react";
import { Board } from "./components/Board";
import { ChessboardProps } from "./types";
import { ChessboardProvider } from "./context/chessboard-context";
import { CustomDragLayer } from "./components/CustomDragLayer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ChessboardDnDRoot } from "./components/DnDRoot";

// spare pieces component
// semantic release with github actions
// improved arrows

// npm publish --tag alpha
// npm publish --dry-run

// rewrite readme, add link to react-chessboard-svg for simply showing a chess position
// add other things from chessground
// change board orientation to 'w' or 'b'? like used in chess.js?
// Animation on premove? - only set manual drop to false in useEffect if not attempting successful premove

export { SparePiece } from "./components/SparePiece";
export { ChessboardDnDProvider } from "./components/DnDRoot";

export type ClearPremoves = {
  clearPremoves: (clearLastPieceColour?: boolean) => void;
};

export const Chessboard = forwardRef<ClearPremoves, ChessboardProps>(
  (props, ref) => {
    const {
      customDndBackend,
      customDndBackendOptions,
      useCustomDnDProvider = false,
      onBoardWidthChange,
      ...otherProps
    } = props;
    const [boardWidth, setBoardWidth] = useState(props.boardWidth);

    const boardRef = useRef<HTMLObjectElement>(null);

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
    }, [boardRef.current]);

    useEffect(() => {
      boardWidth && onBoardWidthChange?.(boardWidth);
    }, [boardWidth]);

    return true ? (
      <ErrorBoundary>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div ref={boardRef} style={{ width: "100%" }} />
          <ChessboardDnDRoot
            customDndBackend={customDndBackend}
            customDndBackendOptions={customDndBackendOptions}
          >
            {boardWidth && (
              <ChessboardProvider
                boardWidth={boardWidth}
                {...otherProps}
                ref={ref}
              >
                <CustomDragLayer />
                <Board />
              </ChessboardProvider>
            )}
          </ChessboardDnDRoot>
        </div>
      </ErrorBoundary>
    ) : null;
  }
);
