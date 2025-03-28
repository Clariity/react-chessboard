import type { Meta, StoryObj } from "@storybook/react";

import { Chessboard } from "..";
import { SparePiece } from "../Piece";
import { ChessboardProvider } from "../ChessboardProvider";
import { PieceType } from "../types";

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
      chessboardRows: 8,
      chessboardColumns: 8,
      darkSquareColor: "#B58863",
      lightSquareColor: "#F0D9B5",
      darkSquareNotationColor: "#F0D9B5",
      lightSquareNotationColor: "#B58863",
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

export const SparePieces: Story = {
  render: () => (
    <ChessboardProvider>
      <Chessboard />
      <div style={{ width: "100px", height: "100px" }}>
        <SparePiece type={PieceType.wP} />
      </div>
      <div style={{ width: "100px", height: "100px" }}>
        <SparePiece type={PieceType.bB} />
      </div>
    </ChessboardProvider>
  ),
};
