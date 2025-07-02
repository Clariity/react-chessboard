import type { Meta, StoryObj } from '@storybook/react';

import { Chessboard } from '../../../src';

const meta: Meta<typeof Chessboard> = {
  title: 'stories/Default',
  component: Chessboard,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chessboard>;

export default meta;

type Story = StoryObj<typeof Chessboard>;

export const Default: Story = {
  render: () => <Chessboard />,
};
