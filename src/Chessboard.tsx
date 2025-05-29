import { Board } from './Board';
import {
  ChessboardOptions,
  ChessboardProvider,
  useChessboardContext,
} from './ChessboardProvider';

type ChessboardProps = {
  options?: ChessboardOptions;
};

export function Chessboard({ options }: ChessboardProps) {
  const { isWrapped } = useChessboardContext() ?? { isWrapped: false };

  if (isWrapped) {
    return <Board />;
  }

  return (
    <ChessboardProvider options={options}>
      <Board />
    </ChessboardProvider>
  );
}
