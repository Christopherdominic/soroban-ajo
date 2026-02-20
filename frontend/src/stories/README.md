# Soroban Ajo Frontend - Storybook Documentation

This directory contains Storybook stories for all components in the Soroban Ajo frontend application. Storybook provides an isolated environment for developing and testing UI components.

## Overview

Storybook helps us:
- Develop components in isolation
- Document component APIs and usage patterns
- Test different component states and props
- Ensure consistent design across the application
- Provide examples for other developers

## Available Components

### Core Components

- **GroupCard** - Displays group information with various visual variants
- **GroupCreationForm** - Form for creating new Ajo groups
- **ContributionForm** - Form for making contributions to groups
- **MemberList** - Table displaying group members and their details
- **TransactionHistory** - Comprehensive transaction history with filtering
- **WalletConnector** - Wallet connection interface

### Layout Components

- **DashboardLayout** - Main dashboard layout structure
- **ResponsiveLayout** - Responsive layout wrapper
- **GroupDetailPage** - Detailed group view page
- **GroupsList** - List view of all groups

### Analytics & Monitoring

- **GroupAnalytics** - Analytics dashboard with metrics and charts
- **MonitoringDashboard** - System monitoring and health metrics

### Utility Components

- **ErrorBoundary** - Error handling and fallback UI

## Running Storybook

To start the Storybook development server:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

To build Storybook for production:

```bash
npm run build-storybook
```

## Story Structure

Each story file follows this pattern:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../components/ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'fullscreen'
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for component props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

## Features

### Automatic Documentation
- All components use the `autodocs` tag for automatic documentation generation
- Props are documented with descriptions and controls
- Usage examples are provided for different scenarios

### Interactive Controls
- Most stories include interactive controls (knobs) for testing different prop values
- Controls are configured in the `argTypes` section of each story

### Responsive Testing
- Layout components include viewport controls for testing different screen sizes
- Mobile, tablet, and desktop viewports are available

### Accessibility Testing
- Storybook includes accessibility addon for testing a11y compliance
- Components are tested for keyboard navigation and screen reader compatibility

## Best Practices

1. **Comprehensive Coverage**: Each component should have stories covering:
   - Default state
   - Different prop variations
   - Edge cases (empty states, error states)
   - Interactive states

2. **Meaningful Names**: Story names should clearly describe what they demonstrate

3. **Documentation**: Include descriptions for both the component and individual stories

4. **Real Data**: Use realistic sample data that represents actual usage

5. **Accessibility**: Ensure all interactive elements are keyboard accessible

## Contributing

When adding new components:

1. Create a corresponding `.stories.tsx` file
2. Include comprehensive examples and documentation
3. Add interactive controls for all relevant props
4. Test different states and edge cases
5. Update this README if needed

## Troubleshooting

### Common Issues

1. **Missing Styles**: Ensure Tailwind CSS is imported in `.storybook/preview.ts`
2. **Component Not Found**: Check import paths in story files
3. **Build Errors**: Verify all dependencies are installed and TypeScript types are correct

### Getting Help

- Check the [Storybook documentation](https://storybook.js.org/docs)
- Review existing stories for patterns and examples
- Ask the team for guidance on component documentation standards