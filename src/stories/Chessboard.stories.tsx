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
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: {
      chessboardSize: 8,
    },
  },
};

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
