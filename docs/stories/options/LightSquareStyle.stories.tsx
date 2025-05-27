import type { Meta, StoryObj } from "@storybook/react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/LightSquareStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightSquareStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      lightSquareStyle: {
        backgroundColor: "cyan",
      },
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
