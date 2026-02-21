# ContributionForm Usage Guide

## Basic Usage

```tsx
import { ContributionForm } from './components/ContributionForm'

function MyGroupPage() {
  return (
    <ContributionForm
      groupId="group-123"
      contributionAmount={100}
      userBalance={500}
      userAddress="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    />
  )
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `groupId` | `string` | Yes | - | Unique identifier for the group |
| `contributionAmount` | `number` | Yes | - | Required contribution amount for the group |
| `userBalance` | `number` | No | `1000` | User's current wallet balance |
| `userAddress` | `string` | No | - | User's wallet address |
| `existingContributions` | `Array<{date: string, amount: number}>` | No | `[]` | Array of previous contributions |

## Features

### 1. Amount Validation
- Validates that the entered amount matches the required contribution
- Ensures minimum amount of $0.01
- Limits to 2 decimal places
- Real-time validation feedback

### 2. Balance Checking
- Displays user's current balance
- Validates sufficient funds (including network fee)
- Shows total cost breakdown

### 3. Cooldown Period
- Prevents duplicate contributions within 24 hours
- Shows remaining time until next contribution allowed

### 4. Transaction Handling
- Loading state during submission
- Success message with transaction hash
- Error handling with user-friendly messages
- Automatic cache invalidation

### 5. Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Error announcements
- Focus management

## Example with Existing Contributions

```tsx
<ContributionForm
  groupId="group-456"
  contributionAmount={50}
  userBalance={200}
  existingContributions={[
    { date: '2026-02-19T10:00:00Z', amount: 50 },
    { date: '2026-01-20T10:00:00Z', amount: 50 },
  ]}
/>
```

This will show the contribution history and enforce the 24-hour cooldown.

## Integration with useContribute Hook

The form automatically uses the `useContribute` hook which:
- Submits contributions to the Soroban smart contract
- Tracks analytics events
- Shows notifications
- Invalidates relevant queries for fresh data

## Error Scenarios

The form handles these error cases:
- **Insufficient Balance**: Shows error when balance < (amount + fee)
- **Invalid Amount**: Shows error for non-numeric or incorrect amounts
- **Cooldown Active**: Prevents contribution if made within 24 hours
- **Network Errors**: Shows user-friendly error messages
- **Contract Errors**: Displays specific error from smart contract

## Styling

The form uses Tailwind CSS classes and includes:
- Responsive design
- Loading animations
- Success/error states with colors
- Hover and focus states
- Smooth transitions

## Testing in Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to: `Components > ContributionForm`

Available stories:
- Default
- Small Contribution
- Large Contribution
- Minimal Contribution
