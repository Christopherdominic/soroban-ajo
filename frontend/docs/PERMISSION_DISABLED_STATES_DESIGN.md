# Permission Denied & Disabled States Design System

## Overview
Design specifications for permission-restricted features, disabled UI elements, and access control states.

---

## 1. Permission Denied States

### 1.1 Wallet Not Connected

**When**: User tries to access feature requiring wallet connection

**Visual Design**:
- Icon: `payment-wallet` with lock badge (64px, gray-400)
- Background: gray-50
- Border: 2px dashed gray-300
- Padding: 48px
- Border radius: 12px

**Content**:
```
Icon: Wallet with lock
Heading: "Wallet Connection Required"
Description: "Connect your wallet to create groups, join groups, and make contributions."
Primary CTA: "Connect Wallet"
Secondary Link: "Learn About Wallets →"
```

**Component**:
```tsx
<PermissionState
  icon="payment-wallet"
  variant="locked"
  heading="Wallet Connection Required"
  message="Connect your wallet to access this feature"
  action={{ label: "Connect Wallet", onClick: connectWallet }}
/>
```

---

### 1.2 Insufficient Balance

**When**: User doesn't have enough tokens for action

**Visual Design**:
- Icon: `payment-coin` with warning (64px, amber-600)
- Background: amber-50
- Border: 1px solid amber-200

**Content**:
```
Heading: "Insufficient Balance"
Current Balance: "25 USDC"
Required Amount: "100 USDC"
Shortfall: "You need 75 USDC more"
Description: "Add funds to your wallet to make this contribution."
Primary CTA: "Add Funds"
Secondary Link: "View Wallet"
```

---

### 1.3 Not Group Member

**When**: User tries to access member-only features

**Content**:
```
Heading: "Members Only"
Description: "Only group members can view contribution history and make payments."
Group Info: "Family Savings Group"
Primary CTA: "Join This Group"
Secondary Link: "Browse Other Groups"
```

---

### 1.4 Wrong Network

**When**: User on incorrect blockchain network

**Content**:
```
Heading: "Wrong Network"
Current: "Stellar Mainnet"
Required: "Stellar Testnet"
Description: "This group operates on Stellar Testnet. Please switch networks to continue."
Primary CTA: "Switch Network"
Secondary Link: "Learn About Networks"
```

---

### 1.5 Group Full

**When**: Group reached max members

**Content**:
```
Heading: "Group is Full"
Description: "This group has reached its maximum of 10 members and is no longer accepting new participants."
Current Members: "10 of 10"
Primary CTA: "Browse Other Groups"
Secondary Link: "Create Your Own Group"
```

---

## 2. Disabled State Styling

### 2.1 Disabled Buttons

**Visual Design**:
- Background: gray-200
- Text color: gray-400
- Border: 1px solid gray-300
- Cursor: not-allowed
- Opacity: 0.6
- No hover effects
- No shadow

**Variants**:

**Primary Button Disabled**:
```css
.btn-primary:disabled {
  background-color: #E5E7EB; /* gray-200 */
  color: #9CA3AF; /* gray-400 */
  border: 1px solid #D1D5DB; /* gray-300 */
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Secondary Button Disabled**:
```css
.btn-secondary:disabled {
  background-color: transparent;
  color: #9CA3AF;
  border: 1px solid #D1D5DB;
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Icon Button Disabled**:
```css
.btn-icon:disabled {
  color: #D1D5DB;
  cursor: not-allowed;
  opacity: 0.5;
}
```

---

### 2.2 Disabled Form Inputs

**Visual Design**:
- Background: gray-100
- Text color: gray-500
- Border: 1px solid gray-300
- Cursor: not-allowed
- No focus ring

**Input Field**:
```css
input:disabled,
textarea:disabled,
select:disabled {
  background-color: #F3F4F6; /* gray-100 */
  color: #6B7280; /* gray-500 */
  border: 1px solid #D1D5DB; /* gray-300 */
  cursor: not-allowed;
}
```

**With Label**:
```tsx
<div className="form-field">
  <label className="text-gray-400">
    Contribution Amount
  </label>
  <input
    type="number"
    disabled
    value="100"
    className="input-disabled"
  />
  <p className="text-sm text-gray-400 mt-1">
    This value cannot be changed after group creation
  </p>
</div>
```

---

### 2.3 Disabled Cards

**Visual Design**:
- Opacity: 0.6
- Grayscale filter (optional)
- No hover effects
- Cursor: not-allowed
- Lock icon overlay (optional)

**Group Card Disabled**:
```tsx
<div className="group-card disabled">
  <div className="card-overlay">
    <Icon name="status-locked" size={32} />
    <p className="text-sm font-medium">Group Full</p>
  </div>
  {/* Card content with reduced opacity */}
</div>
```

**CSS**:
```css
.group-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}

.group-card.disabled .card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: inherit;
}
```

---

### 2.4 Disabled Navigation Items

**Visual Design**:
- Text color: gray-400
- No hover effects
- Cursor: not-allowed
- Icon: gray-400

**Example**:
```tsx
<nav>
  <NavItem href="/dashboard" active>
    <Icon name="nav-home" />
    Dashboard
  </NavItem>
  <NavItem disabled tooltip="Connect wallet to access">
    <Icon name="social-users" />
    My Groups
  </NavItem>
</nav>
```

---

### 2.5 Disabled Tabs

**Visual Design**:
- Text color: gray-400
- No underline
- No hover effects
- Cursor: not-allowed

**Example**:
```tsx
<Tabs>
  <Tab active>Overview</Tab>
  <Tab>Members</Tab>
  <Tab disabled tooltip="No contributions yet">
    History
  </Tab>
</Tabs>
```

---

## 3. Tooltips for Disabled Elements

### Why Disabled

**Always explain why element is disabled**:

```tsx
<Button
  disabled
  tooltip="Connect your wallet to create a group"
>
  Create Group
</Button>
```

**Tooltip Design**:
- Background: gray-900
- Text: white
- Padding: 8px 12px
- Border radius: 6px
- Font size: 14px
- Max width: 200px
- Arrow pointing to element

---

## 4. Progressive Disclosure

### Show What's Possible

**Instead of hiding features, show them disabled with explanation**:

```tsx
<FeatureCard disabled>
  <Icon name="payment-card" />
  <h3>Fiat On-Ramp</h3>
  <p>Buy crypto with credit card</p>
  <Badge variant="info">Coming Soon</Badge>
</FeatureCard>
```

---

## 5. Accessibility Requirements

### Disabled Elements

**ARIA Attributes**:
```tsx
<button
  disabled
  aria-disabled="true"
  aria-label="Create group (wallet connection required)"
>
  Create Group
</button>
```

**Screen Reader Announcement**:
- "Create group button, disabled, wallet connection required"

**Keyboard Navigation**:
- Disabled elements should not receive focus
- Use `tabindex="-1"` if needed
- Provide alternative keyboard navigation

---

## 6. State Indicators

### Visual Indicators for Disabled State

**Badge Indicators**:
```tsx
<Card>
  <Badge variant="gray">Locked</Badge>
  <Badge variant="amber">Requires Wallet</Badge>
  <Badge variant="blue">Coming Soon</Badge>
  <Badge variant="red">Unavailable</Badge>
</Card>
```

**Icon Overlays**:
- Lock icon: Permission required
- Warning icon: Condition not met
- Info icon: Feature not available yet

---

## 7. Component Examples

### Permission Gate Component

```tsx
interface PermissionGateProps {
  condition: boolean
  fallback: React.ReactNode
  children: React.ReactNode
}

function PermissionGate({ condition, fallback, children }: PermissionGateProps) {
  if (!condition) {
    return <>{fallback}</>
  }
  return <>{children}</>
}

// Usage
<PermissionGate
  condition={isWalletConnected}
  fallback={
    <PermissionState
      heading="Wallet Required"
      message="Connect your wallet to continue"
      action={{ label: "Connect", onClick: connect }}
    />
  }
>
  <GroupCreationForm />
</PermissionGate>
```

---

## 8. Best Practices

### Do's
✓ Always explain why something is disabled
✓ Provide clear path to enable feature
✓ Use consistent disabled styling
✓ Show disabled features (don't hide them)
✓ Use tooltips for additional context
✓ Maintain visual hierarchy even when disabled

### Don'ts
✗ Don't hide features without explanation
✗ Don't use disabled state for loading
✗ Don't make disabled elements focusable
✗ Don't use only color to indicate disabled state
✗ Don't disable without providing alternative

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
