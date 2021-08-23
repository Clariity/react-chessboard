import errorImage from '../media/error';

export default function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    return (
      <div style={container}>
        <div style={whiteKingStyle}>{errorImage.whiteKing}</div>
        <h1>Something went wrong</h1>
      </div>
    );
  }
}

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};

const whiteKingStyle = {
  width: 250,
  height: 250,
  transform: 'rotate(90deg)'
};
