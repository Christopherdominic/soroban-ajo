import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from '../components/DashboardLayout';

const meta: Meta<typeof DashboardLayout> = {
  title: 'Components/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A layout component that provides the main dashboard structure with navigation, header, and content areas. Serves as the main container for dashboard pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content to be rendered within the dashboard layout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
        <p className="text-gray-600">This is sample content within the dashboard layout.</p>
      </div>
    ),
  },
};

export const WithCards: Story = {
  args: {
    children: (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Card 1</h3>
            <p className="text-gray-600">Sample content</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Card 2</h3>
            <p className="text-gray-600">Sample content</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Card 3</h3>
            <p className="text-gray-600">Sample content</p>
          </div>
        </div>
      </div>
    ),
  },
};