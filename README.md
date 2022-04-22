<div align="center" markdown="1">

# [react-chessboard](https://react-chessboard.com)

<img src="./media/chessboard.png" alt="react chessboard" width="300">

## The React Chessboard Library used at [ChessOpenings.co.uk](https://chessopenings.co.uk)

### Inspired and adapted from the unmaintained [chessboardjsx](https://github.com/willb335/chessboardjsx)

[![Pull Requests][prs-badge]][prs] [![Version][version-badge]][version] [![MIT License][license-badge]][license]

</div>

## What is react-chessboard?

react-chessboard is a React component that provides chessboard functionality to your application. The Chess game logic that controls the board should be independent to the board, using a library such as [Chess.js](https://github.com/jhlywa/chess.js). An example of these two working together is shown [in the example below](#basic-example). For interactive examples visit [react-chessboard.com](https://react-chessboard.com).

[ChessOpenings.co.uk](https://chessopenings.co.uk) was originally built utilising the [chessboardjsx](https://github.com/willb335/chessboardjsx) library. With [chessboardjsx](https://github.com/willb335/chessboardjsx) being unmaintained, it made it difficult to add functionality or optimise performance, so react-chessboard was made.

## Installation

```
npm i react-chessboard
```

## Features

### Current

- Accessible Functions
  - `chessboardRef.current.clearPremoves();`
- Board Orientation Choice
- Custom Actions
  - getPositionObject
  - onDragOverSquare
  - onMouseOutSquare
  - onMouseOverSquare
  - onPieceClick
  - onPieceDragBegin
  - onPieceDragEnd
  - onPieceDrop
  - onSquareClick
  - onSquareRightClick
- Customisable Board Styles
- Customisable Pieces
- Customisable Square Styles
- Drag and Drop
- Draw Arrows with Drag or Props
- Mobile Compatibility
- Moving Piece Animations
- Optional Square Coordinates Notation
- Position Control
- Premoves
- Responsive Board Width
- TypeScript Support

### Planned

- Promotion Piece Select
- Spare Pieces

### Notes

- Between version 0.0.3 and 0.0.4, onPieceDrop was changed to allow you to return a value of `true` or `false` depending on whether the move was successful or not.
- If more than one board is rendered and draggable on a low end device, performance will struggle due to performance issues with react-dnd.
- In the rare case that react-chessboard component is hot swapped out for another in its place, this will cause an issue with the CustomDragLayer. To prevent this, the react-chessboard component needs to be completely unmounted before being replaced. An example of how this can be achieved is shown in [`example/src/index.js`](https://github.com/Clariity/react-chessboard/blob/main/example/src/index.js).

## Usage

### Bare Minimum

```jsx
import { Chessboard } from "react-chessboard";

export default function App() {
  return (
    <div>
      <Chessboard id="BasicBoard" />
    </div>
  );
}
```

### Basic Example

```jsx
import { useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
    });
    if (move === null) return false; // illegal move
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
```

### Advanced Examples

For more advanced code usage examples, please see example boards shown in [`example/src/boards`](https://github.com/Clariity/react-chessboard/tree/main/example/src/boards).

### Props

| Prop                          | Default Value                                                     | Options                                            | Description                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| animationDuration             | number: 300                                                       |                                                    | Time in milliseconds for piece to slide to target square. Only used when the position is programmatically changed. If a new position is set before the animation is complete, the board will cancel the current animation and snap to the new position.                                                                                                                              |
| areArrowsAllowed              | boolean: true                                                     | [true, false]                                      | Whether or not arrows can be drawn with right click and dragging.                                                                                                                                                                                                                                                                                                                    |
| arePiecesDraggable            | boolean: true                                                     | [true, false]                                      | Whether or not all pieces are draggable.                                                                                                                                                                                                                                                                                                                                             |
| arePremovesAllowed            | boolean: false                                                    | [true, false]                                      | Whether or not premoves are allowed.                                                                                                                                                                                                                                                                                                                                                 |
| boardOrientation              | string: 'white'                                                   | ['white', 'black']                                 | The orientation of the board, the chosen colour will be at the bottom of the board.                                                                                                                                                                                                                                                                                                  |
| boardWidth                    | number: 560                                                       |                                                    | The width of the board in pixels.                                                                                                                                                                                                                                                                                                                                                    |
| clearPremovesOnRightClick     | boolean: true                                                     | [true, false]                                      | If premoves are allowed, whether or not to clear the premove queue on right click.                                                                                                                                                                                                                                                                                                   |
| customArrowColor              | string: 'rgb(255,170,0)'                                          | rgb or hex string                                  | String with rgb or hex value to colour drawn arrows.                                                                                                                                                                                                                                                                                                                                 |
| customArrows                  | string[][]: []                                                    | array of string arrays                             | Array of custom arrows to draw on the board. Each arrow within the array must be an array of length 2 with strings denoting the from and to square to draw the arrow e.g. [ ['a3', 'a5'], ['g1', 'f3'] ].                                                                                                                                                                            |
| customBoardStyle              | object: {}                                                        | inline CSS styling                                 | Custom board style object e.g. { borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 '}.                                                                                                                                                                                                                                                                                   |
| customDarkSquareStyle         | object: { backgroundColor: '#B58863' }                            | inline CSS styling                                 | Custom dark square style object.                                                                                                                                                                                                                                                                                                                                                     |
| customDndBackend              | BackendFactory: undefined                                         |                                                    | Custom react-dnd backend to use instead of the one provided by react-chessboard.                                                                                                                                                                                                                                                                                                     |
| customDndBackendOptions       | any: undefined                                                    |                                                    | Options to use for the given custom react-dnd backend. See customDndBackend.                                                                                                                                                                                                                                                                                                         |
| customDropSquareStyle         | object: { boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)' } | inline CSS styling                                 | Custom drop square style object (Square being hovered over with dragged piece).                                                                                                                                                                                                                                                                                                      |
| customLightSquareStyle        | object: { backgroundColor: '#F0D9B5' }                            | inline CSS styling                                 | Custom light square style object.                                                                                                                                                                                                                                                                                                                                                    |
| customPieces                  | object: {}                                                        |                                                    | Custom pieces object where each key must match a corresponding chess piece (wP, wB, wN, wR, wQ, wK, bP, bB, bN, bR, bQ, bK). The value of each piece is a function that takes in some optional arguments to use and must return JSX to render. e.g. { wK: ({ isDragging: boolean, squareWidth: number, droppedPiece: string, targetSquare: string, sourceSquare: string }) => jsx }. |
| customPremoveDarkSquareStyle  | object: { backgroundColor: '#A42323' }                            | inline CSS styling                                 | Custom premove dark square style object.                                                                                                                                                                                                                                                                                                                                             |
| customPremoveLightSquareStyle | object: { backgroundColor: '#BD2828' }                            | inline CSS styling                                 | Custom premove light square style object.                                                                                                                                                                                                                                                                                                                                            |
| customSquareStyles            | object: {}                                                        | inline CSS styling                                 | Custom styles for all squares.                                                                                                                                                                                                                                                                                                                                                       |
| id                            | number: 0                                                         | [string, number]                                   | Board identifier, necessary if more than one board is mounted for drag and drop.                                                                                                                                                                                                                                                                                                     |
| isDraggablePiece              | function: ({ piece, sourceSquare }) => true                       | returns [true, false]                              | Function called when a piece drag is attempted. Returns if piece is draggable.                                                                                                                                                                                                                                                                                                       |
| getPositionObject             | function: (currentPosition) => {}                                 |                                                    | User function that receives current position object when position changes.                                                                                                                                                                                                                                                                                                           |
| onDragOverSquare              | function: (square) => {}                                          |                                                    | User function that is run when piece is dragged over a square.                                                                                                                                                                                                                                                                                                                       |
| onMouseOutSquare              | function: (square) => {}                                          |                                                    | User function that is run when mouse leaves a square.                                                                                                                                                                                                                                                                                                                                |
| onMouseOverSquare             | function: (square) => {}                                          |                                                    | User function that is run when mouse is over a square.                                                                                                                                                                                                                                                                                                                               |
| onPieceClick                  | function: (piece) => {}                                           |                                                    | User function that is run when piece is clicked.                                                                                                                                                                                                                                                                                                                                     |
| onPieceDragBegin              | function: (piece, sourceSquare) => {}                             |                                                    | User function that is run when piece is grabbed to start dragging.                                                                                                                                                                                                                                                                                                                   |
| onPieceDragEnd                | function: (piece, sourceSquare) => {}                             |                                                    | User function that is run when piece is let go after dragging.                                                                                                                                                                                                                                                                                                                       |
| onPieceDrop                   | function: (sourceSquare, targetSquare, piece) => true             | returns [true, false]                              | User function that is run when piece is dropped on a square. Must return whether the move was successful or not. This return value does not control whether or not the piece was placed (as that is controlled by the `position` prop) but instead controls premove logic.                                                                                                                                                                                                                                                                     |
| onSquareClick                 | function: (square) => {}                                          |                                                    | User function that is run when a square is clicked.                                                                                                                                                                                                                                                                                                                                  |
| onSquareRightClick            | function: (square) => {}                                          |                                                    | User function that is run when a square is right clicked.                                                                                                                                                                                                                                                                                                                            |
| position                      | string: 'start'                                                   | ['start', FEN string, { e5: 'wK', e4: 'wP', ... }] | FEN string or position object notating where the chess pieces are on the board. Start position can also be notated with the string: 'start'.                                                                                                                                                                                                                                         |
| showBoardNotation             | boolean: true                                                     | [true, false]                                      | Whether or not to show the file and rank co-ordinates (a..h, 1..8).                                                                                                                                                                                                                                                                                                                  |
| snapToCursor                  | boolean: true                                                     | [true, false]                                      | Whether or not to center dragged pieces on the mouse cursor.                                                                                                                                                                                                                                                                                                                         |

## Contributing

1. Fork this repository
2. Clone your forked repository onto your development machine
   `git clone https://github.com/yourUsernameHere/react-chessboard.git`
   `cd react-chessboard`
3. Create a branch for your PR
   `git checkout -b your-branch-name`
4. Set upstream remote
   `git remote add upstream https://github.com/Clariity/react-chessboard.git`
5. Make your changes
6. Test your changes using the example folder
   `npm run build`
   `cd example`
   `npm start`
7. Push your changes
   `git add .`
   `git commit -m "feature/cool-new-feature"`
   `git push --set-upstream origin your-branch-name`
8. Create pull request on GitHub
9. Contribute again
   `git checkout main`
   `git pull upstream main`
   `git checkout -b your-new-branch-name`

## LICENSE

MIT

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[version-badge]: https://img.shields.io/npm/v/react-chessboard.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-chessboard.svg?style=flat-square
[prs]: https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
[version]: https://www.npmjs.com/package/react-chessboard
[license]: https://github.com/Clariity/react-chessboard/blob/main/LICENSE
