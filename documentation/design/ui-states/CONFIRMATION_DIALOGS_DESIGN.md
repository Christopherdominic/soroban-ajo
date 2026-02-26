# Confirmation Dialogs Design System

## Overview
Modal dialogs for confirming destructive actions, important decisions, and critical operations.

---

## Design Principles

### Confirmation Dialog Goals
- **Clear Consequences**: Explain what will happen
- **Reversibility**: Indicate if action can be undone
- **Visual Hierarchy**: Destructive actions use warning colors
- **Escape Routes**: Always provide a way to cancel

### Visual Structure
1. Backdrop: rgba(0, 0, 0, 0.5)
2. Modal: Centered, max-w-md, shadow-2xl
3. Icon: Top, centered (48px)
4. Content: Heading + description
5. Actions: Right-aligned, primary + secondary

---

## 1. Destructive Action Confirmations

### 1.1 Delete Group

**When**: User attempts to delete a savings group

**Visual Design**:
- Icon: `action-delete` (48px, red-600)
- Modal background: white
- Border-top: 4px solid red-600
- Padding: 32px
- Border radius: 16px

**Content**:
```
Icon: Trash icon in red
Heading: "Delete Group?"
Description: "This will permanently delete 'Family Savings Group' and all its data. This action cannot be undone."
Warning Badge: "⚠️ Permanent Action"
Primary Action: "Cancel" (gray, default focus)
Secondary Action: "Delete Group" (red-600, destructive)
```

**Component**:
```tsx
<ConfirmDialog
  variant="destructive"
  icon="action-delete"
  title="Delete Group?"
  message="This will permanently delete 'Family Savings Group'..."
  confirmLabel="Delete Group"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

**Accessibility**:
- `role="alertdialog"`
- `aria-labelledby="dialog-title"`
- `aria-describedby="dialog-description"`
- Focus trap within modal
- Escape key closes dialog
- Default focus on "Cancel" button

---

### 1.2 Leave Group

**When**: Member wants to leave an active group

**Visual Design**:
- Icon: `status-warning` (48px, amber-600)
- Border-top: 4px solid amber-600

**Content**:
```
Heading: "Leave Group?"
Description: "You'll lose your spot in 'Community Savings' and won't receive future payouts. Your contributions so far will remain with the group."
Consequences List:
  • You'll forfeit your position in the payout rotation
  • Your past contributions cannot be refunded
  • You'll need to be re-invited to rejoin
Primary Action: "Stay in Group"
Secondary Action: "Leave Group"
```

---

### 1.3 Cancel Contribution

**When**: User wants to cancel pending contribution

**Content**:
```
Heading: "Cancel Contribution?"
Description: "Your contribution of 100 USDC is being processed. Canceling now may result in delays or fees."
Primary Action: "Keep Processing"
Secondary Action: "Cancel Anyway"
```

---

## 2. Important Decision Confirmations

### 2.1 Create Group Confirmation

**When**: User submits group creation form (final step)

**Visual Design**:
- Icon: `social-users` (48px, blue-600)
- Border-top: 4px solid blue-600
- Background: blue-50 (light tint)

**Content**:
```
Heading: "Create This Group?"
Summary Card:
  Group Name: "Family Savings"
  Contribution: "100 USDC per cycle"
  Cycle Duration: "30 days"
  Max Members: "10 people"
  Your Role: "Group Creator & First Member"
Description: "Once created, these settings cannot be changed. Make sure everything looks correct."
Primary Action: "Create Group"
Secondary Action: "Edit Details"
```

---

### 2.2 Join Group Confirmation

**When**: User clicks to join a group

**Content**:
```
Heading: "Join This Group?"
Group Details:
  Name: "Community Savings"
  Contribution: "50 USDC every 7 days"
  Current Members: "5 of 10"
  Next Cycle: "Starts in 3 days"
Commitment:
  "By joining, you commit to contributing 50 USDC every 7 days for 10 cycles (70 days total)."
Checkbox: "☐ I understand the commitment and agree to participate"
Primary Action: "Join Group" (disabled until checkbox checked)
Secondary Action: "Cancel"
```

---

### 2.3 Execute Payout Confirmation

**When**: Eligible member triggers payout

**Content**:
```
Heading: "Execute Payout?"
Payout Details:
  Recipient: "Alice (0x1234...5678)"
  Amount: "500 USDC"
  Cycle: "3 of 10"
  Transaction Fee: "~0.5 XLM"
Description: "This will send 500 USDC to Alice's wallet. All members have contributed for this cycle."
Primary Action: "Execute Payout"
Secondary Action: "Cancel"
```

---

## 3. Information Confirmations

### 3.1 Wallet Connection

**When**: User connects wallet for first time

**Visual Design**:
- Icon: `payment-wallet` (48px, blue-600)
- Border-top: 4px solid blue-600

**Content**:
```
Heading: "Connect Your Wallet"
Description: "Ajo Finance will be able to:"
Permissions List:
  ✓ View your wallet address
  ✓ View your token balances
  ✓ Request transaction approvals
Description: "We will never:"
Restrictions List:
  ✗ Access your private keys
  ✗ Make transactions without your approval
  ✗ Share your data with third parties
Primary Action: "Connect Wallet"
Secondary Action: "Learn More"
```

---

### 3.2 Network Switch Required

**When**: User on wrong network (mainnet vs testnet)

**Content**:
```
Heading: "Switch Network?"
Description: "This group is on Stellar Testnet, but your wallet is connected to Mainnet."
Current Network: "Stellar Mainnet"
Required Network: "Stellar Testnet"
Primary Action: "Switch to Testnet"
Secondary Action: "Cancel"
```

---

## 4. Confirmation Dialog Variants

### Variant Specifications

| Variant | Border Color | Icon Color | Primary Button | Use Case |
|---------|--------------|------------|----------------|----------|
| `destructive` | red-600 | red-600 | gray (cancel) | Delete, remove, leave |
| `warning` | amber-600 | amber-600 | gray (cancel) | Risky actions |
| `info` | blue-600 | blue-600 | blue (confirm) | Important decisions |
| `success` | green-600 | green-600 | green (confirm) | Positive confirmations |

---

## 5. Component API

### ConfirmDialog Component

```tsx
interface ConfirmDialogProps {
  // Variant
  variant: 'destructive' | 'warning' | 'info' | 'success'
  
  // Content
  icon: IconName
  title: string
  message: string
  details?: React.ReactNode // Optional details card
  
  // Actions
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  
  // State
  isOpen: boolean
  isLoading?: boolean // Show loading on confirm button
  
  // Accessibility
  ariaLabel?: string
}
```

### Usage Example

```tsx
const [isOpen, setIsOpen] = useState(false)

<ConfirmDialog
  variant="destructive"
  icon="action-delete"
  title="Delete Group?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  isOpen={isOpen}
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

---

## 6. Interaction Patterns

### Opening Dialog
- Triggered by user action (button click)
- Backdrop fades in (200ms)
- Modal scales in from 95% to 100% (200ms)
- Focus moves to first focusable element (usually Cancel)

### Closing Dialog
- Click Cancel button
- Click backdrop (optional, configurable)
- Press Escape key
- After successful confirmation
- Modal scales out, backdrop fades out (150ms)

### Loading State
- Confirm button shows spinner
- Confirm button disabled
- Cancel button disabled
- Backdrop click disabled
- Escape key disabled

---

## 7. Accessibility Requirements

### Keyboard Navigation
- Tab: Move between buttons
- Shift+Tab: Move backwards
- Enter: Activate focused button
- Escape: Close dialog (cancel action)
- Focus trap: Can't tab outside dialog

### Screen Reader
- Dialog announced when opened
- Title and description read automatically
- Button labels clear and descriptive
- Loading state announced

### ARIA Attributes
```tsx
<div
  role="alertdialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <h2 id="dialog-title">{title}</h2>
  <p id="dialog-description">{message}</p>
  <button aria-label="Cancel action">Cancel</button>
  <button aria-label="Confirm delete group">Delete</button>
</div>
```

---

## 8. Best Practices

### Do's
✓ Use clear, specific titles ("Delete Group?" not "Are you sure?")
✓ Explain consequences clearly
✓ Default focus on safe action (Cancel for destructive)
✓ Provide escape routes (Cancel, Escape key, backdrop click)
✓ Show loading state during async operations
✓ Use appropriate variant for action type

### Don'ts
✗ Don't use vague language ("Proceed?" "OK?")
✗ Don't hide consequences
✗ Don't make destructive action the default
✗ Don't prevent closing dialog
✗ Don't use for non-critical actions (use toast instead)
✗ Don't nest dialogs

---

## 9. Testing Checklist

- [ ] Dialog opens on trigger
- [ ] Backdrop visible and semi-transparent
- [ ] Content renders correctly
- [ ] Buttons work as expected
- [ ] Cancel closes dialog
- [ ] Confirm executes action
- [ ] Escape key closes dialog
- [ ] Backdrop click closes dialog (if enabled)
- [ ] Focus trap works
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Loading state displays
- [ ] Mobile responsive
- [ ] Animation smooth

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
