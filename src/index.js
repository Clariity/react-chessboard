import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import Board from './components/Board';
import ErrorBoundary from './components/ErrorBoundary';
// import SparePieces from './components/SparePieces';

import { chessboardDefaultProps, chessboardPropTypes } from './consts';
import { ChessboardProvider } from './context/chessboard-context';

function Chessboard(props) {
  return (
    <ErrorBoundary>
      <DndProvider options={HTML5toTouch}>
        <ChessboardProvider {...props}>
          <div>
            {/* {props.showSparePieces && <SparePieces.Top />} */}
            <Board />
            {/* {props.showSparePieces && <SparePieces.Bottom />} */}
          </div>
        </ChessboardProvider>
      </DndProvider>
    </ErrorBoundary>
  );
}

Chessboard.propTypes = chessboardPropTypes;
Chessboard.defaultProps = chessboardDefaultProps;

export default Chessboard;
