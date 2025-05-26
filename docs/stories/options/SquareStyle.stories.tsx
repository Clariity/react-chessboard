import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import defaultMeta from "../Default.stories";
import { Chessboard } from "../../../src";

const meta: Meta<typeof Chessboard> = {
  ...defaultMeta,
  title: "stories/Options/SquareStyle",
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareStyle: Story = {
  render: () => {
    const [aspectRatio, setAspectRatio] = useState("1/1");
    const [justifyContent, setJustifyContent] = useState("center");
    const [alignItems, setAlignItems] = useState("center");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            Aspect ratio:
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              <option value="1/1">1:1 (Square)</option>
              <option value="4/3">4:3</option>
              <option value="3/4">3:4</option>
              <option value="16/9">16:9</option>
              <option value="9/16">9:16</option>
            </select>
          </label>
          <label>
            Justify content:
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value)}
            >
              <option value="center">Center</option>
              <option value="flex-start">Start</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </label>
          <label>
            Align items:
            <select value={alignItems} onChange={(e) => setAlignItems(e.target.value)}>
              <option value="center">Center</option>
              <option value="flex-start">Start</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </label>
        </div>
        <Chessboard
          options={{
            squareStyle: {
              aspectRatio,
              justifyContent,
              alignItems,
              display: "flex",
              position: "relative",
            },
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Customize the appearance of all squares on the board
        </div>
      </div>
    );
  },
};
