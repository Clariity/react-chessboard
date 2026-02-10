export function defaultBoardStyle(
  chessboardColumns: number,
): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${chessboardColumns}, 1fr)`,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    position: 'relative',
  };
}

export const defaultSquareStyle: React.CSSProperties = {
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

export const defaultDarkSquareStyle: React.CSSProperties = {
  backgroundColor: '#B58863',
};

export const defaultLightSquareStyle: React.CSSProperties = {
  backgroundColor: '#F0D9B5',
};

export const defaultDropSquareStyle: React.CSSProperties = {
  boxShadow: 'inset 0px 0px 0px 1px black',
};

export const defaultDarkSquareNotationStyle: React.CSSProperties = {
  color: '#F0D9B5',
};

export const defaultLightSquareNotationStyle: React.CSSProperties = {
  color: '#B58863',
};

export const defaultAlphaNotationStyle: React.CSSProperties = {
  fontSize: '13px',
  position: 'absolute',
  bottom: 1,
  right: 4,
  userSelect: 'none',
};

export const defaultNumericNotationStyle: React.CSSProperties = {
  fontSize: '13px',
  position: 'absolute',
  top: 2,
  left: 2,
  userSelect: 'none',
};

export const defaultDraggingPieceStyle: React.CSSProperties = {
  transform: 'scale(1.2)',
};

export const defaultDraggingPieceGhostStyle: React.CSSProperties = {
  opacity: 0.5,
};

export const defaultArrowOptions = {
  color: '#ffaa00', // color if no modifiers are held down when drawing an arrow
  secondaryColor: '#4caf50', // color if shift is held down when drawing an arrow
  tertiaryColor: '#f44336', // color if control is held down when drawing an arrow
  arrowLengthReducerDenominator: 8, // the lower the denominator, the greater the arrow length reduction (e.g. 8 = 1/8 of a square width removed, 4 = 1/4 of a square width removed)
  sameTargetArrowLengthReducerDenominator: 4, // as above but for arrows targeting the same square (a greater reduction is used to avoid overlaps)
  arrowWidthDenominator: 5, // the lower the denominator, the greater the arrow width (e.g. 5 = 1/5 of a square width, 10 = 1/10 of a square width)
  activeArrowWidthMultiplier: 0.9, // the multiplier for the arrow width when it is being drawn
  opacity: 0.65, // opacity of arrow when not being drawn
  activeOpacity: 0.5, // opacity of arrow when it is being drawn
  arrowStartOffset: 0, // how far from the center of the start square the arrow begins, as a fraction of square width (0 = center, 0.5 = edge). Values between 0.3-0.4 give a chess.com-like look where the arrow starts near the base of the piece. Values above 0.5 will start outside the square.
};
