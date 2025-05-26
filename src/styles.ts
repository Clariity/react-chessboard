export const defaultBoardStyle = (chessboardColumns: number): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(${chessboardColumns}, 1fr`,
  overflow: "hidden",
});

export const defaultSquareStyle: React.CSSProperties = {
  aspectRatio: "1/1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
};

export const defaultDarkSquareStyle: React.CSSProperties = {
  backgroundColor: "#B58863",
};

export const defaultLightSquareStyle: React.CSSProperties = {
  backgroundColor: "#F0D9B5",
};

export const defaultDropSquareStyle: React.CSSProperties = {
  border: "1px solid black",
};

export const defaultDarkSquareNotationStyle: React.CSSProperties = {
  color: "#F0D9B5",
};

export const defaultLightSquareNotationStyle: React.CSSProperties = {
  color: "#B58863",
};

export const defaultAlphaNotationStyle: React.CSSProperties = {
  fontSize: "13px",
  position: "absolute",
  bottom: 1,
  right: 4,
};

export const defaultNumericNotationStyle: React.CSSProperties = {
  fontSize: "13px",
  position: "absolute",
  top: 2,
  left: 2,
};
