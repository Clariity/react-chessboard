import type { Meta, StoryObj } from "@storybook/react";

import { Chessboard } from "..";

const meta = {
  title: "Chessboard",
  component: Chessboard,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "70vh" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      chessboardRows: 8,
      chessboardColumns: 8,
      darkSquareStyle: {
        backgroundColor: "#B58863",
      },
      lightSquareStyle: {
        backgroundColor: "#F0D9B5",
      },
      darkSquareNotationStyle: {
        color: "#F0D9B5",
      },
      lightSquareNotationStyle: {
        color: "#B58863",
      },
      alphaNotationStyle: {
        fontSize: "13px",
        position: "absolute",
        top: 2,
        left: 2,
      },
      numericNotationStyle: {
        fontSize: "13px",
        position: "absolute",
        bottom: 1,
        right: 4,
      },
      showNotation: true,
    },
  },
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export { BoardOrientation } from "./BoardOrientation";
export { ExtendedBoard } from "./ExtendedBoard";
export { PlayVsRandom } from "./PlayVsRandom";
export { Position } from "./Position";
export { SparePieces } from "./SparePieces";
