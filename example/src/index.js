import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import PlayVsPlay from './PlayVsPlay';
import PlayVsRandom from './PlayVsRandom';
import RandomVsRandom from './RandomVsRandom';
import SquareStyles from './SquareStyles';
import StyledBoard from './StyledBoard';

import './index.css';

function App() {
  const [chessboardSize, setChessboardSize] = useState(undefined);

  useEffect(() => {
    function handleResize() {
      const display = document.getElementsByClassName('container')[0];
      setChessboardSize(display.offsetWidth - 20);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">
      <h1>react-chessboard examples</h1>
      <h2>Play vs Random Moves</h2>
      <PlayVsRandom boardWidth={chessboardSize} />
      <br />
      <h2>Random vs Random</h2>
      <RandomVsRandom boardWidth={chessboardSize} />
      <br />
      <h2>Play vs Play</h2>
      <PlayVsPlay boardWidth={chessboardSize} />
      <br />
      <h2>Move Options, Highlight Moves, and Right Click</h2>
      <SquareStyles boardWidth={chessboardSize} />
      <br />
      <h2>Styled Board</h2>
      <StyledBoard boardWidth={chessboardSize} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
