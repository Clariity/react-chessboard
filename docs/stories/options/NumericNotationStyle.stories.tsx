import type { Meta, StoryObj } from "@storybook/react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/NumericNotationStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumericNotationStyle: Story = {
  render: () => {
    const chessboardOptions = {
      numericNotationStyle: {
        color: "cyan",
        fontSize: "20px",
        fontWeight: "bold",
      },
    };

    return <Chessboard options={chessboardOptions} />;
  },
};
