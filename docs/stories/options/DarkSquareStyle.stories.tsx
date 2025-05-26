import type { Meta, StoryObj } from "@storybook/react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/DropSquareStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkSquareStyle: Story = {
  render: () => {
    const chessboardOptions = {
      darkSquareStyle: {
        backgroundColor: "cyan",
      },
    };

    return <Chessboard options={chessboardOptions} />;
  },
};
