import type { Meta, StoryObj } from '@storybook/react';
import { WalletConnect } from '../components/WalletConnect';
import { fn } from '@storybook/test';

const meta = {
    title: 'Components/WalletConnect',
    component: WalletConnect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        showNetworkSelector: {
            control: 'boolean',
            description: 'Show network selection dropdown',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
    args: {
        onConnect: fn(),
        onDisconnect: fn(),
        onError: fn(),
    },
} satisfies Meta<typeof WalletConnect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithNetworkSelector: Story = {
    args: {
        showNetworkSelector: true,
    },
};

export const CustomStyling: Story = {
    args: {
        className: 'max-w-md',
    },
};

export const WithCallbacks: Story = {
    args: {
        onConnect: (address: string) => {
            console.log('Connected:', address);
            alert(`Connected to wallet: ${address}`);
        },
        onDisconnect: () => {
            console.log('Disconnected');
            alert('Wallet disconnected');
        },
        onError: (error: string) => {
            console.error('Error:', error);
            alert(`Error: ${error}`);
        },
    },
};
