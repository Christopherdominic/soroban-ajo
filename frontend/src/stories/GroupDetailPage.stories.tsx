import type { Meta, StoryObj } from '@storybook/react';
import { GroupDetailPage } from '../components/GroupDetailPage';

const meta: Meta<typeof GroupDetailPage> = {
  title: 'Components/GroupDetailPage',
  component: GroupDetailPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A detailed view component for individual Ajo groups. Displays comprehensive group information, member details, contribution history, and management options.',
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
        story: 'Default group detail page showing comprehensive group information.',
      },
    },
  },
};

export const ActiveGroup: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Group detail page for an active group with ongoing contributions.',
      },
    },
  },
};

export const CompletedGroup: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Group detail page for a completed group showing final statistics.',
      },
    },
  },
};