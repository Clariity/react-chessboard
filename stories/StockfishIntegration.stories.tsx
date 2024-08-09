import React from "react";
import type { Meta, StoryObj } from '@storybook/react';

import { Chessboard } from "../src";

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};

const meta: Meta<typeof Chessboard> = {
  component: Chessboard,
  decorators: [
    (Story) => (
      <div style={boardWrapper}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Chessboard>;
 
export const Default: Story = {
  args: {
    id: 'Default',
  },
};
