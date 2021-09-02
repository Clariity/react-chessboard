import { Chessboard } from 'react-chessboard';

export default function BasicBoard({ boardWidth }) {
  return (
    <div>
      <Chessboard id="BasicBoard" boardWidth={boardWidth} expectingAlternateMoves={false} />
    </div>
  );
}
