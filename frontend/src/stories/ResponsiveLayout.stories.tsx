import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveLayout } from '../components/ResponsiveLayout';

const meta: Meta<typeof ResponsiveLayout> = {
  title: 'Components/ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive layout component that adapts to different screen sizes and provides consistent spacing and structure across the application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content to be rendered within the responsive layout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Responsive Content</h1>
        <p className="text-gray-600">This content adapts to different screen sizes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-green-100 p-4 rounded">Item 2</div>
          <div className="bg-yellow-100 p-4 rounded">Item 3</div>
        </div>
      </div>
    ),
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive layout optimized for mobile devices.',
      },
    },
  },
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Mobile Layout</h1>
        <p className="text-gray-600">Optimized for mobile screens.</p>
      </div>
    ),
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Responsive layout optimized for tablet devices.',
      },
    },
  },
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tablet Layout</h1>
        <p className="text-gray-600">Optimized for tablet screens.</p>
      </div>
    ),
  },
};