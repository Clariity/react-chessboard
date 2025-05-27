import type { Meta, StoryObj } from "@storybook/react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/AlphaNotationStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlphaNotationStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      alphaNotationStyle: {
        color: "cyan",
        fontSize: "20px",
        fontWeight: "bold",
      },
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
