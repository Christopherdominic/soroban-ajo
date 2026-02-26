import type { Meta, StoryObj } from '@storybook/react'
import { GroupCard } from '@/components/GroupCard'

const meta: Meta<typeof GroupCard> = {
  title: 'Components/GroupCard',
  component: GroupCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'completed', 'paused'],
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'interactive', 'compact', 'spacious'],
    },
    onClick: { action: 'clicked' },
  },
}
export default meta

type Story = StoryObj<typeof GroupCard>

export const Default: Story = {
  args: {
    groupName: 'Savings Circle Alpha',
    memberCount: 5,
    maxMembers: 10,
    nextPayout: 'Mar 15, 2026',
    totalContributions: 1250,
    status: 'active',
    variant: 'interactive',
  },
}

export const Completed: Story = {
  args: {
    ...Default.args,
    groupName: 'Completed Group',
    memberCount: 10,
    maxMembers: 10,
    totalContributions: 5000,
    status: 'completed',
  },
}

export const Paused: Story = {
  args: {
    ...Default.args,
    groupName: 'Paused Group',
    status: 'paused',
  },
}

export const Compact: Story = {
  args: {
    ...Default.args,
    groupName: 'Compact Card',
    variant: 'compact',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    variant: 'interactive',
  },
}
