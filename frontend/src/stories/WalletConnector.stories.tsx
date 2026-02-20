import type { Meta, StoryObj } from '@storybook/react';
import { WalletConnector } from '../components/WalletConnector';

const meta: Meta<typeof WalletConnector> = {
  title: 'Components/WalletConnector',
  component: WalletConnector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A wallet connection component that allows users to connect their Stellar wallet (Freighter) to the application. Shows connection status and wallet address when connected.',
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
        story: 'Default state of the wallet connector when no wallet is connected.',
      },
    },
  },
};

export const Disconnected: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the wallet connector in disconnected state with connect button.',
      },
    },
  },
};