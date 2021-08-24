import ReactDOM from 'react-dom';

import PlayRandomMoveEngine from './PlayRandomMoveEngine';
import RandomVsRandomGame from './RandomVsRandomGame';

const boardsContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  height: '100vh',
  marginTop: 30,
  marginBottom: 50
};

function App() {
  return (
    <div>
      <div style={boardsContainer}>
        <h1>react-chessboard</h1>
        <PlayRandomMoveEngine />
        <RandomVsRandomGame />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
