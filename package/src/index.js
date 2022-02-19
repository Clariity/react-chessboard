import React, { forwardRef } from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import { Board } from './components/Board';
import { CustomDragLayer } from './components/CustomDragLayer';
import { ErrorBoundary } from './components/ErrorBoundary';
// import SparePieces from './components/SparePieces';

import { chessboardDefaultProps } from './consts';
import { ChessboardProvider } from './context/chessboard-context';

export const Chessboard = forwardRef((props, ref) => {
  return (
    <ErrorBoundary>
      <DndProvider options={HTML5toTouch}>
        <ChessboardProvider ref={ref} {...props}>
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
