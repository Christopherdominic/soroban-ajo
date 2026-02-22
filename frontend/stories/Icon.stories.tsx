import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '@/components/Icon'
import { IconSprite } from '@/components/IconSprite'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'action-add',
        'action-edit',
        'status-active',
        'status-completed',
        'payment-wallet',
        'nav-home',
        'validation-check',
      ],
    },
    size: {
      control: 'select',
      options: [16, 20, 24, 32, 48],
    },
    variant: {
      control: 'select',
      options: ['default', 'active', 'disabled', 'error', 'success', 'warning', 'info'],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <IconSprite />
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'action-add',
    size: 24,
    variant: 'default',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Icon name="action-add" size={16} />
      <Icon name="action-add" size={20} />
      <Icon name="action-add" size={24} />
      <Icon name="action-add" size={32} />
      <Icon name="action-add" size={48} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Icon name="validation-check" variant="default" />
      <Icon name="validation-check" variant="active" />
      <Icon name="validation-check" variant="disabled" />
      <Icon name="validation-check" variant="error" />
      <Icon name="validation-check" variant="success" />
      <Icon name="validation-check" variant="warning" />
      <Icon name="validation-check" variant="info" />
    </div>
  ),
}
