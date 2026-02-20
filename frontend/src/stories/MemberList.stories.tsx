import type { Meta, StoryObj } from '@storybook/react';
import { MemberList } from '../components/MemberList';

// Define the Member interface locally since it's not exported from the component
interface Member {
  address: string;
  joinedDate: string;
  contributions: number;
  status: 'active' | 'inactive' | 'completed';
}

const meta: Meta<typeof MemberList> = {
  title: 'Components/MemberList',
  component: MemberList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A table component that displays group members with their addresses, join dates, contributions, and status. Supports different member statuses and shows contribution amounts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    members: {
      control: 'object',
      description: 'Array of member objects to display',
    },
    groupId: {
      control: 'text',
      description: 'Unique identifier for the group',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMembers: Member[] = [
  {
    address: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    joinedDate: '2024-01-15',
    contributions: 1500,
    status: 'active' as const,
  },
  {
    address: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    joinedDate: '2024-01-20',
    contributions: 1200,
    status: 'active' as const,
  },
  {
    address: 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    joinedDate: '2024-01-25',
    contributions: 800,
    status: 'inactive' as const,
  },
  {
    address: 'GDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    joinedDate: '2024-01-10',
    contributions: 2000,
    status: 'completed' as const,
  },
];

export const Default: Story = {
  args: {
    members: sampleMembers,
    groupId: 'group-1',
  },
};

export const EmptyList: Story = {
  args: {
    members: [],
    groupId: 'group-2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Member list when no members are provided (shows mock data).',
      },
    },
  },
};

export const SingleMember: Story = {
  args: {
    members: [sampleMembers[0]],
    groupId: 'group-3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Member list with only one member.',
      },
    },
  },
};

export const ActiveMembersOnly: Story = {
  args: {
    members: sampleMembers.filter(member => member.status === 'active'),
    groupId: 'group-4',
  },
  parameters: {
    docs: {
      description: {
        story: 'Member list showing only active members.',
      },
    },
  },
};

export const MixedStatuses: Story = {
  args: {
    members: [
      ...sampleMembers,
      {
        address: 'GEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        joinedDate: '2024-02-01',
        contributions: 500,
        status: 'active' as const,
      },
      {
        address: 'GFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        joinedDate: '2024-02-05',
        contributions: 300,
        status: 'inactive' as const,
      },
    ],
    groupId: 'group-5',
  },
  parameters: {
    docs: {
      description: {
        story: 'Member list with various member statuses and contribution amounts.',
      },
    },
  },
};