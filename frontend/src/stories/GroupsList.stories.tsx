import type { Meta, StoryObj } from '@storybook/react';
import { GroupsList } from '../components/GroupsList';

const meta: Meta<typeof GroupsList> = {
  title: 'Components/GroupsList',
  component: GroupsList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A component that displays a list of Ajo groups. Shows group cards in a responsive grid layout with filtering and search capabilities.',
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
        story: 'Default groups list showing available Ajo groups.',
      },
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Groups list in empty state when no groups are available.',
      },
    },
  },
};