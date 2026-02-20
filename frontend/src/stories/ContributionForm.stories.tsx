import type { Meta, StoryObj } from '@storybook/react';
import { ContributionForm } from '../components/ContributionForm';

const meta: Meta<typeof ContributionForm> = {
  title: 'Components/ContributionForm',
  component: ContributionForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A form component for making contributions to Ajo groups. Shows contribution amount, fees, and total cost with wallet integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    groupId: {
      control: 'text',
      description: 'Unique identifier for the group',
    },
    contributionAmount: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Default contribution amount for the group',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: 'group-1',
    contributionAmount: 100,
  },
};

export const SmallContribution: Story = {
  args: {
    groupId: 'group-2',
    contributionAmount: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'Contribution form with a smaller default amount.',
      },
    },
  },
};

export const LargeContribution: Story = {
  args: {
    groupId: 'group-3',
    contributionAmount: 500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Contribution form with a larger default amount.',
      },
    },
  },
};

export const MinimalContribution: Story = {
  args: {
    groupId: 'group-4',
    contributionAmount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Contribution form with minimal contribution amount.',
      },
    },
  },
};