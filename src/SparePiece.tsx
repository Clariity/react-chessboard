import { Draggable } from './Draggable';
import { Piece } from './Piece';
import { PieceType } from './types';

type SparePieceProps = {
  pieceType: PieceType;
};

export function SparePiece({ pieceType }: SparePieceProps) {
  return (
    <Draggable isSparePiece position={pieceType} pieceType={pieceType}>
      <Piece isSparePiece pieceType={pieceType} position={pieceType} />
    </Draggable>
  );
}
