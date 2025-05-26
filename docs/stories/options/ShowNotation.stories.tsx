import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/ShowNotation",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowNotation: Story = {
  render: () => {
    const [showNotation, setShowNotation] = useState(true);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div>
          <label>
            <input
              type="checkbox"
              checked={showNotation}
              onChange={(e) => setShowNotation(e.target.checked)}
            />
            Show notation
          </label>
        </div>
        <Chessboard
          options={{
            showNotation,
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Toggle the checkbox to show/hide board coordinates
        </div>
      </div>
    );
  },
};
