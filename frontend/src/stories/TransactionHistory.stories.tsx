import type { Meta, StoryObj } from '@storybook/react';
import { TransactionHistory } from '../components/TransactionHistory';

// Define the Transaction interface locally since it's not exported from the component
interface Transaction {
  id: string;
  type: 'contribution' | 'payout' | 'refund';
  amount: number;
  date: string;
  member: string;
  status: 'completed' | 'pending' | 'failed';
}

const meta: Meta<typeof TransactionHistory> = {
  title: 'Components/TransactionHistory',
  component: TransactionHistory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive transaction history component with filtering, sorting, and search capabilities. Displays contributions, payouts, and refunds with status indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    groupId: {
      control: 'text',
      description: 'Unique identifier for the group',
    },
    transactions: {
      control: 'object',
      description: 'Array of transaction objects to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'contribution' as const,
    amount: 500,
    date: '2026-02-10',
    member: 'GAAAA...AAAA',
    status: 'completed' as const,
  },
  {
    id: 'tx-2',
    type: 'contribution' as const,
    amount: 500,
    date: '2026-02-11',
    member: 'GBBBB...BBBB',
    status: 'completed' as const,
  },
  {
    id: 'tx-3',
    type: 'payout' as const,
    amount: 4000,
    date: '2026-02-12',
    member: 'GCCCC...CCCC',
    status: 'completed' as const,
  },
  {
    id: 'tx-4',
    type: 'contribution' as const,
    amount: 500,
    date: '2026-02-13',
    member: 'GDDDD...DDDD',
    status: 'pending' as const,
  },
  {
    id: 'tx-5',
    type: 'refund' as const,
    amount: 250,
    date: '2026-02-14',
    member: 'GEEEE...EEEE',
    status: 'failed' as const,
  },
];

export const Default: Story = {
  args: {
    groupId: 'group-1',
    transactions: sampleTransactions,
  },
};

export const EmptyTransactions: Story = {
  args: {
    groupId: 'group-2',
    transactions: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction history when no transactions are provided (shows mock data).',
      },
    },
  },
};

export const ContributionsOnly: Story = {
  args: {
    groupId: 'group-3',
    transactions: sampleTransactions.filter(tx => tx.type === 'contribution'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction history showing only contribution transactions.',
      },
    },
  },
};

export const PayoutsOnly: Story = {
  args: {
    groupId: 'group-4',
    transactions: sampleTransactions.filter(tx => tx.type === 'payout'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction history showing only payout transactions.',
      },
    },
  },
};

export const MixedStatuses: Story = {
  args: {
    groupId: 'group-5',
    transactions: [
      ...sampleTransactions,
      {
        id: 'tx-6',
        type: 'contribution' as const,
        amount: 750,
        date: '2026-02-15',
        member: 'GFFFF...FFFF',
        status: 'completed' as const,
      },
      {
        id: 'tx-7',
        type: 'payout' as const,
        amount: 3500,
        date: '2026-02-16',
        member: 'GGGGG...GGGG',
        status: 'pending' as const,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction history with various transaction types and statuses.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    groupId: 'group-6',
    transactions: Array.from({ length: 50 }, (_, i) => ({
      id: `tx-${i + 1}`,
      type: ['contribution', 'payout', 'refund'][i % 3] as 'contribution' | 'payout' | 'refund',
      amount: Math.floor(Math.random() * 1000) + 100,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
      member: `G${String(i).padStart(4, '0')}...${String(i).padStart(4, '0')}`,
      status: ['completed', 'pending', 'failed'][i % 3] as 'completed' | 'pending' | 'failed',
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction history with a large dataset to demonstrate filtering and sorting capabilities.',
      },
    },
  },
};