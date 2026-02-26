import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'
import '../src/styles/index.css'

/**
 * Storybook preview setup (#75)
 * Global decorators, parameters, and Tailwind are applied here.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },
  },
}

export default preview
