import type { Meta, StoryObj } from '@storybook/react';
import { GroupCreationForm } from '../components/GroupCreationForm';

const meta: Meta<typeof GroupCreationForm> = {
  title: 'Components/GroupCreationForm',
  component: GroupCreationForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A form component for creating new Ajo groups. Allows users to specify group details including name, description, cycle length, contribution amount, and maximum members.',
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
        story: 'Default state of the group creation form with empty fields and default values.',
      },
    },
  },
};

export const WithSampleData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Group creation form pre-filled with sample data to demonstrate typical usage.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // This would be used for interaction testing
    // For now, we'll just show the form as-is
  },
};