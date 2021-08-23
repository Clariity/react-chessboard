import { useState } from 'react';

import PlayRandomMoveEngine from './boards/PlayRandomMoveEngine';
import RandomVsRandomGame from './boards/RandomVsRandomGame';

function Demo() {
  const [boardSize, setBoardSize] = useState(500);
  return (
    <div>
      <div style={boardsContainer}>
        <button onClick={() => setBoardSize(300)}>Test</button>
        <PlayRandomMoveEngine boardSize={boardSize} />
        <RandomVsRandomGame boardSize={boardSize} />
      </div>
    </div>
  );
}

export default Demo;

const boardsContainer = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100vw',
  height: '100vh',
  marginTop: 30,
  marginBottom: 50
};
