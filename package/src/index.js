import React, { forwardRef, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { Board } from './components/Board';
import { CustomDragLayer } from './components/CustomDragLayer';
import { ErrorBoundary } from './components/ErrorBoundary';
// import SparePieces from './components/SparePieces';

import { chessboardDefaultProps } from './consts';
import { ChessboardProvider } from './context/chessboard-context';

export const Chessboard = forwardRef((props, ref) => {
  const [clientWindow, setClientWindow] = useState();
  const [backendSet, setBackendSet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { customDndBackend, customDndBackendOptions, ...otherProps } = props;

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
    setBackendSet(true);
    setClientWindow(window);
  }, []);

  const backend = customDndBackend || (isMobile ? TouchBackend : HTML5Backend);

  return (
    backendSet &&
    clientWindow && (
      <ErrorBoundary>
        <DndProvider backend={backend} context={clientWindow}>
          <ChessboardProvider ref={ref} {...otherProps}>
            <CustomDragLayer />
            <Board />
          </ChessboardProvider>
        </DndProvider>
      </ErrorBoundary>
    )
  );
});

Chessboard.defaultProps = chessboardDefaultProps;
