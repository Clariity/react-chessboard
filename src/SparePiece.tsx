import { Draggable } from './Draggable.js';
import { Piece } from './Piece.js';

type SparePieceProps = {
  pieceType: string;
};

export function SparePiece({ pieceType }: SparePieceProps) {
  return (
    <Draggable isSparePiece position={pieceType} pieceType={pieceType}>
      <Piece isSparePiece pieceType={pieceType} position={pieceType} />
    </Draggable>
  );
}
