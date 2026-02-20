import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import React from 'react';

// Component that throws an error for demonstration
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for demonstration purposes');
  }
  return <div className="p-4 bg-green-100 text-green-800 rounded">Everything is working fine!</div>;
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the entire application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Child components to be wrapped by the error boundary',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutError: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={false} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary with child components that are working normally.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary catching an error and displaying the fallback UI.',
      },
    },
  },
};

export const WithMultipleChildren: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 text-blue-800 rounded">Component 1</div>
        <div className="p-4 bg-purple-100 text-purple-800 rounded">Component 2</div>
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Component 3</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary wrapping multiple child components.',
      },
    },
  },
};