import type { Meta, StoryObj } from '@storybook/react';
import { GroupCard } from '../components/GroupCard';

const meta: Meta<typeof GroupCard> = {
  title: 'Components/GroupCard',
  component: GroupCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component that displays group information including member count, contributions, and status. Supports multiple variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['active', 'completed', 'paused'],
      description: 'Current status of the group',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'interactive', 'compact', 'spacious'],
      description: 'Visual variant of the card',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function when card is clicked',
    },
    memberCount: {
      control: { type: 'number', min: 0 },
      description: 'Current number of members in the group',
    },
    maxMembers: {
      control: { type: 'number', min: 1 },
      description: 'Maximum number of members allowed',
    },
    totalContributions: {
      control: { type: 'number', min: 0 },
      description: 'Total amount contributed to the group',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: '1',
    groupName: 'Market Women Ajo',
    memberCount: 8,
    maxMembers: 12,
    nextPayout: 'Dec 15, 2024',
    totalContributions: 2400,
    status: 'active',
    variant: 'default',
  },
};

export const Interactive: Story = {
  args: {
    groupId: '2',
    groupName: 'Tech Professionals Group',
    memberCount: 15,
    maxMembers: 20,
    nextPayout: 'Jan 1, 2025',
    totalContributions: 7500,
    status: 'active',
    variant: 'interactive',
    onClick: () => console.log('Card clicked'),
  },
};

export const Completed: Story = {
  args: {
    groupId: '3',
    groupName: 'Small Business Owners',
    memberCount: 10,
    maxMembers: 10,
    nextPayout: 'Completed',
    totalContributions: 5000,
    status: 'completed',
    variant: 'elevated',
  },
};

export const Paused: Story = {
  args: {
    groupId: '4',
    groupName: 'Community Development',
    memberCount: 5,
    maxMembers: 15,
    nextPayout: 'Paused',
    totalContributions: 1250,
    status: 'paused',
    variant: 'outlined',
  },
};

export const Compact: Story = {
  args: {
    groupId: '5',
    groupName: 'Quick Save Group',
    memberCount: 3,
    maxMembers: 8,
    nextPayout: 'Dec 20, 2024',
    totalContributions: 600,
    status: 'active',
    variant: 'compact',
  },
};

export const Spacious: Story = {
  args: {
    groupId: '6',
    groupName: 'Premium Investment Circle',
    memberCount: 12,
    maxMembers: 15,
    nextPayout: 'Jan 15, 2025',
    totalContributions: 18000,
    status: 'active',
    variant: 'spacious',
  },
};

export const LowMembership: Story = {
  args: {
    groupId: '7',
    groupName: 'New Startup Group',
    memberCount: 2,
    maxMembers: 20,
    nextPayout: 'Feb 1, 2025',
    totalContributions: 200,
    status: 'active',
    variant: 'interactive',
  },
};

export const FullMembership: Story = {
  args: {
    groupId: '8',
    groupName: 'Full Capacity Group',
    memberCount: 25,
    maxMembers: 25,
    nextPayout: 'Dec 25, 2024',
    totalContributions: 12500,
    status: 'active',
    variant: 'elevated',
  },
};