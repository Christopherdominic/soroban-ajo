import type { Meta, StoryObj } from '@storybook/react';
import { MonitoringDashboard } from '../components/MonitoringDashboard';

const meta: Meta<typeof MonitoringDashboard> = {
  title: 'Components/MonitoringDashboard',
  component: MonitoringDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A monitoring dashboard component that provides system health metrics, performance indicators, and operational insights for the Ajo platform.',
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
        story: 'Default monitoring dashboard showing system health and performance metrics.',
      },
    },
  },
};

export const HealthySystem: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Monitoring dashboard showing a healthy system with all metrics in good status.',
      },
    },
  },
};

export const SystemAlerts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Monitoring dashboard displaying system alerts and warnings.',
      },
    },
  },
};