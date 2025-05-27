import type { Meta, StoryObj } from "@storybook/react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/LightSquareNotationStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightSquareNotationStyle: Story = {
  render: () => {
    // chessboard options
    const chessboardOptions = {
      lightSquareNotationStyle: {
        color: "blue",
        fontWeight: "bold",
      },
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  },
};
