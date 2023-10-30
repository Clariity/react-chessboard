import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { Board } from "./components/Board";
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
    const { customDndBackend, customDndBackendOptions, ...otherProps } = props;
    const [clientWindow, setClientWindow] = useState<Window>();
    const [backendSet, setBackendSet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [boardWidth, setBoardWidth] = useState(props.boardWidth);

    const boardRef = useRef<HTMLObjectElement>(null);
    const boardContainerRef = useRef<HTMLDivElement>(null);

    const [boardContainerPos, setBoardContainerPos] = useState({
      left: 0,
      top: 0,
    });

    const metrics = useMemo(
      () => boardRef.current?.getBoundingClientRect(),
      [boardRef.current]
    );

    useEffect(() => {
      setBoardContainerPos({
        left: metrics?.left ? metrics?.left : 0,
        top: metrics?.top ? metrics?.top : 0,
      });
    }, [metrics]);

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
          ref={boardContainerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
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
                <CustomDragLayer boardContainer={boardContainerPos} />
                <Board />
              </ChessboardProvider>
            )}
          </DndProvider>
        </div>
      </ErrorBoundary>
    ) : null;
  }
);
