import type { Meta, StoryObj } from '@storybook/react';
import { GroupAnalytics } from '../components/GroupAnalytics';

const meta: Meta<typeof GroupAnalytics> = {
  title: 'Components/GroupAnalytics',
  component: GroupAnalytics,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive analytics dashboard component that displays group performance metrics, contribution trends, payout timelines, and top contributors. Features metric cards with trend indicators and placeholder areas for charts.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default analytics dashboard showing various group performance metrics and placeholders for charts.',
      },
    },
  },
};

export const FullScreen: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Analytics dashboard in full screen layout to show how it adapts to larger viewports.',
      },
    },
  },
};