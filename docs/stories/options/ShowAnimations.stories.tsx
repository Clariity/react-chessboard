import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/ShowAnimations",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowAnimations: Story = {
  render: () => {
    const [showAnimations, setShowAnimations] = useState(true);

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
              checked={showAnimations}
              onChange={(e) => setShowAnimations(e.target.checked)}
            />
            Show animations
          </label>
        </div>
        <Chessboard
          options={{
            showAnimations,
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Toggle the checkbox to enable/disable piece movement animations
        </div>
      </div>
    );
  },
};
