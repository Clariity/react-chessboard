import React, { forwardRef } from 'react';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import { Board } from './components/Board';
import { CustomDragLayer } from './components/CustomDragLayer';
import { ErrorBoundary } from './components/ErrorBoundary';
// import SparePieces from './components/SparePieces';

import { chessboardDefaultProps } from './consts';
import { ChessboardProvider } from './context/chessboard-context';

export const Chessboard = forwardRef((props, ref) => {
  const { customDndBackend, customDndBackendOptions, ...otherProps } = props;

  return (
    <ErrorBoundary>
      <DndProvider
        backend={customDndBackend || MultiBackend}
        options={customDndBackend ? customDndBackendOptions : HTML5toTouch}
      >
        <ChessboardProvider ref={ref} {...otherProps}>
          <CustomDragLayer />
          <div>
            {/* {props.showSparePieces && <SparePieces.Top />} */}
            <Board />
            {/* {props.showSparePieces && <SparePieces.Bottom />} */}
          </div>
        </ChessboardProvider>
      </DndProvider>
    </ErrorBoundary>
  );
});

Chessboard.defaultProps = chessboardDefaultProps;
