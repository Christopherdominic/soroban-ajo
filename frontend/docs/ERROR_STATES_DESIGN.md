# Error States Design System

## Overview
Comprehensive error state designs for the Soroban Ajo application, covering network errors, validation errors, timeouts, and system failures.

---

## Design Principles

### Core Values
- **Clear Communication**: Users understand what happened
- **Empathy**: Helpful, not blaming
- **Actionable**: Clear next steps provided
- **Accessible**: WCAG 2.1 AA compliant
- **Consistent**: Unified visual language

### Visual Hierarchy
1. Icon/Illustration (48px-64px)
2. Heading (text-xl font-bold)
3. Body Text (text-base text-gray-600)
4. Primary Action Button
5. Secondary Link/Action

---

## 1. Network Error States

### 1.1 Connection Lost

**When**: Network connection drops during operation

**Visual Design**:
- Icon: `status-error` (64px, red-600)
- Background: Light red tint (red-50)
- Border: 1px solid red-200
- Padding: 32px
- Border radius: 12px

**Content**:
```
Heading: "Connection Lost"
Body: "We're having trouble connecting to the network. Please check your internet connection and try again."
Primary Action: "Retry Connection"
Secondary Action: "View Offline Data"
```

**Component Structure**:
```tsx
<ErrorState
  icon="status-error"
  variant="error"
  heading="Connection Lost"
  message="We're having trouble connecting to the network..."
  primaryAction={{ label: "Retry Connection", onClick: handleRetry }}
  secondaryAction={{ label: "View Offline Data", onClick: showOffline }}
/>
```

**Accessibility**:
- `role="alert"`
- `aria-live="assertive"`
- `aria-label="Network connection error"`

---

### 1.2 Request Timeout

**When**: API request exceeds timeout threshold (30s)

**Visual Design**:
- Icon: `status-warning` (64px, amber-600)
- Background: amber-50
- Border: 1px solid amber-200

**Content**:
```
Heading: "Request Timed Out"
Body: "This is taking longer than expected. The network might be slow or the server is busy."
Primary Action: "Try Again"
Secondary Action: "Cancel"
```

---

### 1.3 Server Error (500)

**When**: Backend returns 500-level error

**Visual Design**:
- Icon: `status-error` (64px, red-600)
- Background: red-50

**Content**:
```
Heading: "Something Went Wrong"
Body: "We encountered an unexpected error on our end. Our team has been notified and is working on it."
Primary Action: "Go to Dashboard"
Secondary Action: "Contact Support"
Error Code: "Error Code: 500-{timestamp}"
```

---

### 1.4 Blockchain Network Error

**When**: Stellar/Soroban network unavailable

**Visual Design**:
- Icon: `payment-wallet` with error badge (64px, red-600)
- Background: red-50

**Content**:
```
Heading: "Blockchain Network Unavailable"
Body: "We can't connect to the Stellar network right now. This might be temporary."
Primary Action: "Check Network Status"
Secondary Action: "Try Again"
Status Link: "View Stellar Status →"
```

---

## 2. Validation Error Messages

### 2.1 Form Field Errors

**Design Pattern**: Inline validation with icon + message

**Visual Design**:
- Icon: `validation-cross` (16px, red-600)
- Text color: red-600
- Border: 2px solid red-500
- Background: white (no tint for input fields)

**Error Messages**:



**Contribution Amount**:
- Empty: "Contribution amount is required"
- Too low: "Minimum contribution is 1 USDC"
- Too high: "Maximum contribution is 1,000,000 USDC"
- Invalid format: "Enter a valid number"

**Cycle Duration**:
- Empty: "Cycle duration is required"
- Too short: "Minimum cycle duration is 1 day"
- Too long: "Maximum cycle duration is 365 days"

**Max Members**:
- Empty: "Maximum members is required"
- Too few: "Minimum 2 members required"
- Too many: "Maximum 100 members allowed"

**Group Name**:
- Empty: "Group name is required"
- Too short: "Name must be at least 3 characters"
- Too long: "Name must be less than 50 characters"
- Invalid characters: "Use only letters, numbers, and spaces"

---

### 2.2 Form Summary Errors

**Design Pattern**: Banner at top of form

**Visual Design**:
- Background: red-50
- Border: 1px solid red-200
- Border-left: 4px solid red-600
- Icon: `status-error` (20px, red-600)
- Padding: 16px

**Content**:
```
Icon: Error icon
Heading: "Please fix the following errors:"
Error List:
  • Group name is required
  • Contribution amount must be at least 1 USDC
  • Cycle duration is required
```

---

## 3. Blockchain Transaction Errors

### 3.1 Transaction Failed

**When**: Blockchain transaction rejected or failed

**Content**:
```
Heading: "Transaction Failed"
Message: "Your transaction couldn't be completed. This might be due to network congestion or insufficient gas fees."
Transaction Hash: "0x1234...5678"
Primary Action: "Try Again"
Secondary Action: "View on Explorer"
```

### 3.2 Insufficient Gas

**Content**:
```
Heading: "Insufficient Gas Fees"
Message: "You don't have enough XLM to cover the transaction fee."
Required: "0.5 XLM"
Your Balance: "0.2 XLM"
Primary Action: "Add XLM"
Secondary Action: "Cancel"
```

### 3.3 Transaction Rejected

**Content**:
```
Heading: "Transaction Rejected"
Message: "You rejected the transaction in your wallet."
Primary Action: "Try Again"
Secondary Action: "Cancel"
```

---

## 4. Best Practices

### Error Message Writing

**Do's**:
- Use plain language
- Explain what happened
- Suggest how to fix it
- Be empathetic
- Provide next steps

**Don'ts**:
- Use technical jargon
- Blame the user
- Be vague
- Show stack traces
- Use error codes alone

### Error Recovery

**Always provide**:
- Retry button for transient errors
- Alternative actions
- Help/support link
- Error code for support reference

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
