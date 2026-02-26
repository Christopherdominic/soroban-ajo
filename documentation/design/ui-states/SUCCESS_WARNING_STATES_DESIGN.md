# Success, Warning & Alert States Design System

## Overview
Positive feedback, warnings, and alert designs that communicate system status and guide user actions.

---

## 1. Success States

### 1.1 Success Toast Notification

**When**: Action completes successfully (create group, contribute, etc.)

**Visual Design**:
- Position: Top-right, 16px from edge
- Background: green-50
- Border: 1px solid green-200
- Border-left: 4px solid green-600
- Icon: `validation-check` (20px, green-600)
- Duration: 4 seconds
- Animation: Slide in from right, fade out

**Content Examples**:
```
"Group created successfully! 🎉"
"Contribution sent! Your payment is being processed."
"Member added to group"
"Settings saved"
```

**Component**:
```tsx
<Toast
  variant="success"
  icon="validation-check"
  message="Group created successfully!"
  duration={4000}
/>
```

---

### 1.2 Success Page State

**When**: Major action completed (group cycle complete, payout received)

**Visual Design**:
- Icon: `status-completed` (80px, green-600)
- Background: Gradient from green-50 to white
- Confetti animation (optional, for major milestones)
- Card: Centered, max-w-lg, shadow-lg

**Content**:
```
Icon: Large checkmark in circle
Heading: "Payout Received! 🎉"
Amount: "1,250 USDC"
Description: "Your payout has been sent to your wallet. The transaction is complete."
Primary CTA: "View Transaction"
Secondary CTA: "Back to Dashboard"
```

---

### 1.3 Inline Success Indicators

**When**: Form field validated, step completed

**Visual Design**:
- Icon: `validation-check` (16px, green-600)
- Text: green-600
- Position: Right side of input or inline with text

**Examples**:
```
✓ Wallet connected
✓ Email verified
✓ Form saved
```

---

## 2. Warning States

### 2.1 Warning Banner

**When**: Important information user should know

**Visual Design**:
- Background: amber-50
- Border: 1px solid amber-200
- Border-left: 4px solid amber-600
- Icon: `status-warning` (20px, amber-600)
- Padding: 16px
- Dismissible: Optional

**Content Examples**:
```
"Your contribution is due in 2 days"
"Low balance: Add funds to avoid missing contributions"
"Group will start in 3 days"
"Network congestion may cause delays"
```

**Component**:
```tsx
<Banner
  variant="warning"
  icon="status-warning"
  message="Your contribution is due in 2 days"
  dismissible={true}
  action={{ label: "Contribute Now", onClick: contribute }}
/>
```

---

### 2.2 Inline Warning

**When**: Warning related to specific field or section

**Visual Design**:
- Icon: `status-warning` (16px, amber-600)
- Text: amber-700
- Background: amber-50 (optional)
- Padding: 8px

**Examples**:
```
⚠️ This action cannot be undone
⚠️ Minimum 2 members required to start
⚠️ Transaction fees may apply
```

---

### 2.3 Low Balance Warning

**When**: User balance below threshold

**Content**:
```
Icon: Payment coin with warning
Heading: "Low Balance"
Current Balance: "25 USDC"
Next Contribution: "100 USDC due in 3 days"
Message: "Add funds to avoid missing your contribution."
Primary Action: "Add Funds"
Secondary Action: "View Wallet"
```

---

### 2.4 Deadline Warning

**When**: Approaching deadline

**Content**:
```
Icon: Clock with warning
Heading: "Contribution Due Soon"
Deadline: "Due in 6 hours"
Amount: "100 USDC"
Message: "Don't miss your contribution deadline."
Primary Action: "Contribute Now"
```

---

## 3. Alert States

### 3.1 Info Alert

**When**: Helpful information

**Visual Design**:
- Background: blue-50
- Border: 1px solid blue-200
- Border-left: 4px solid blue-600
- Icon: `status-active` (20px, blue-600)

**Content Examples**:
```
"New feature: You can now export transaction history"
"Tip: Invite friends to earn rewards"
"Your group will start when all members join"
```

---

### 3.2 System Alert

**When**: System-wide announcement

**Visual Design**:
- Position: Top of page, full width
- Background: blue-600
- Text: white
- Icon: `status-active` (20px, white)
- Dismissible: Yes

**Content Examples**:
```
"Scheduled maintenance: Feb 25, 2:00 AM - 4:00 AM UTC"
"New version available. Refresh to update."
"Network upgrade in progress. Some features may be slow."
```

---

### 3.3 Dismissible Alert

**Component**:
```tsx
<Alert
  variant="info"
  icon="status-active"
  message="New feature available!"
  dismissible={true}
  onDismiss={handleDismiss}
  action={{ label: "Learn More", onClick: openModal }}
/>
```

---

## 4. Component Specifications

### Toast Variants

| Variant | Background | Border | Icon | Duration |
|---------|------------|--------|------|----------|
| Success | green-50 | green-200 | validation-check | 4s |
| Error | red-50 | red-200 | status-error | 6s |
| Warning | amber-50 | amber-200 | status-warning | 5s |
| Info | blue-50 | blue-200 | status-active | 4s |

### Banner Variants

| Variant | Background | Border | Icon | Dismissible |
|---------|------------|--------|------|-------------|
| Success | green-50 | green-200 | validation-check | Yes |
| Error | red-50 | red-200 | status-error | No |
| Warning | amber-50 | amber-200 | status-warning | Yes |
| Info | blue-50 | blue-200 | status-active | Yes |

### Alert Variants

| Variant | Background | Border | Icon | Position |
|---------|------------|--------|------|----------|
| Success | green-50 | green-200 | validation-check | Inline |
| Error | red-50 | red-200 | status-error | Inline |
| Warning | amber-50 | amber-200 | status-warning | Inline |
| Info | blue-50 | blue-200 | status-active | Inline |
| System | blue-600 | none | status-active | Top |

---

## 5. Animation Guidelines

### Toast Animation

**Enter**: Slide in from right (300ms)
```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

**Exit**: Fade out (200ms)
```css
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

### Success Celebration

**Confetti** (optional, for major milestones):
```tsx
import confetti from 'canvas-confetti'

confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})
```

---

## 6. Best Practices

### Success Messages

**Do's**:
- Be celebratory
- Confirm what happened
- Provide next steps
- Use positive language

**Don'ts**:
- Be overly technical
- Use passive voice
- Forget to celebrate
- Leave user wondering what's next

### Warning Messages

**Do's**:
- Be clear about the risk
- Explain consequences
- Provide action to resolve
- Use appropriate urgency

**Don'ts**:
- Overuse warnings
- Be alarmist
- Hide important info
- Use vague language

### Alert Messages

**Do's**:
- Be timely
- Be relevant
- Be actionable
- Be dismissible (when appropriate)

**Don'ts**:
- Spam users
- Block critical actions
- Use for errors (use error state)
- Forget to provide context

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
