# ♟️ React Chessboard

<div align="center">

![npm version](https://img.shields.io/npm/v/react-chessboard)
![npm downloads](https://img.shields.io/npm/dm/react-chessboard)
![license](https://img.shields.io/npm/l/react-chessboard)

A modern, responsive chessboard component for React applications.

![chessboard](./docs/assets/chessboard.png)

</div>

## ✨ Features

- 🎯 Drag and drop
- 🎨 Custom pieces
- ♟️ Spare pieces
- 🎭 Custom styling
- ✨ Animation
- 📐 Custom board dimensions
- 🔄 Event handling
- 📱 Mobile support
- 📱 Responsive
- ⌨️ Accessible
- 🔷 TypeScript support
- ✨ And more!

## 📦 Installation

```bash
pnpm add react-chessboard
# or
yarn add react-chessboard
# or
npm install react-chessboard
```

## 🚀 Quick Start

```tsx
import { Chessboard } from 'react-chessboard';

function App() {
  const chessboardOptions = {
    // your config options here
  };

  return <Chessboard options={chessboardOptions} />;
}
```

## 📚 Documentation

For detailed documentation, examples, and API reference, visit our documentation site:

[📖 View Documentation](https://react-chessboard.vercel.app/)

## 🤝 Contributing

Contributions are welcome! Please read our [contribution guide](https://react-chessboard.vercel.app/?path=/docs/developers-contributing-to-react-chessboard--docs) before submitting a Pull Request.

Keen to contribute? Here is the current list of things we want to get done:

### Features

- **Drag and Drop Enhancements**
  - Add `allowDragOffBoard` prop to allow consumers to prevent users from dragging the pieces outside of the board area.
  - Implement custom drag layer using dndkit modifiers - https://docs.dndkit.com/api-documentation/modifiers#building-custom-modifiers
- **Accessibility Improvements**
  - Review and enhance sensor implementations and accessibility for screen readers
  - Allow users to drag and drop using keyboard. This is native to dndkit however something is currently preventing us from dropping pieces.
  - Improve overall accessibility features.
- **UI Customization**
  - Add `squareRenderer` prop for custom square rendering. Add 3D board and pieces example once implemented.
  - Improve arrows so that for all Knight moves it is a right angled arrow instead of a straight one.

### Documentation

- **Additional advanced examples**
  - **Multiplayer Support**
    - Example of 2 chessboards next to each other (or on top if on mobile), one from white's perspective, the other from black's.
    - Only one player can move at a time when it's their turn.
    - Utilising a single centralised game logic.
    - Consider promisifying `onPieceDrop` for better async handling, perhaps mocking a network delay of .1 seconds to ensure it works.
  - **4-Player Chess**
    - Not necessarily adding the game logic, but instead adding the chessboard with 4 different coloured pieces.
    - May have to consider changes to `boardOrientation` prop to allow for more than 2 orientations, perhaps a degree of rotation?
  - **Mini Puzzles**
    - Small mate-in-two puzzle example on a small board, similar to the Pocket Chess phone application.
- **Full Example Documentation**
  - Build step-by-step tutorial
  - Cover custom board implementation
  - Include premoves and promotion
  - Add right-click square functionality
  - Implement move sounds
  - and more...
- **Utils and Types Documentation**
  - Document utility functions
  - Add type definitions documentation
- **Framework Integrations**
  - Add framework specific documentation, Next.js, Vite, Remix
  - Include `use client` directive examples

### Infrastructure

- **Testing**
  - Add test suite full of unit test and visual tests
- **Storybook**
  - Upgrade to Storybook 9

## 📄 License

MIT © [Ryan Gregory](https://github.com/Clariity)
