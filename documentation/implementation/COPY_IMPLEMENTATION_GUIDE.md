# Copy Implementation Guide for Developers

## Quick Reference

### Using Copy in Code

#### React/TypeScript Example

```typescript
// copy.ts - Centralized copy constants
export const COPY = {
  buttons: {
    createGroup: 'Create Group',
    joinGroup: 'Join This Group',
    contribute: 'Contribute Now',
    claimPayout: 'Claim Payout',
  },
  
  success: {
    groupCreated: 'Group created successfully! Your Ajo group is ready. Share the group ID with members to invite them.',
    joined: (date: string) => `You've joined the group! Welcome! Your first contribution is due on ${date}.`,
    contributed: (current: number, total: number) => 
      `Contribution received! Thank you! ${current} of ${total} members have contributed this cycle.`,
  },
  
  errors: {
    contributionAmountZero: 'Contribution amount must be greater than zero. Please enter a positive amount for members to contribute.',
    contributionAmountNegative: 'Contribution amount cannot be negative. Please enter a valid positive amount.',
    cycleDurationZero: 'Cycle duration must be at least 1 day. Groups need time between contributions. Try 7 days for weekly cycles.',
    maxMembersBelowMinimum: 'Groups need at least 2 members. Ajo works by rotating savings between members. Add at least one more person.',
    maxMembersAboveLimit: 'Maximum 100 members allowed. Large groups can be hard to coordinate. Consider creating multiple smaller groups.',
    maxMembersExceeded: 'This group is full. All spots are taken. Try creating your own group or find another one.',
    insufficientBalance: (required: number, balance: number) =>
      `Insufficient balance. You need ${required} XLM to contribute. Your balance: ${balance} XLM.`,
  },
  
  emptyStates: {
    noGroups: {
      headline: 'Start Your First Ajo',
      body: 'Ajo is a traditional savings method where groups save together and take turns receiving payouts. Ready to begin your savings journey?',
      primaryCta: 'Create Your First Group',
      secondaryCta: 'Learn How It Works',
    },
  },
  
  loading: {
    general: 'Loading...',
    creatingGroup: 'Creating your group...',
    processing: 'Processing contribution...',
    claiming: 'Claiming payout...',
  },
};

// Usage in components
import { COPY } from './copy';

function CreateGroupButton() {
  return (
    <button aria-label="Create new Ajo savings group">
      {COPY.buttons.createGroup}
    </button>
  );
}

function SuccessMessage({ current, total }: { current: number; total: number }) {
  return (
    <Alert type="success">
      {COPY.success.contributed(current, total)}
    </Alert>
  );
}
```

#### Error Handling Example

```typescript
// errorHandler.ts
import { COPY } from './copy';

export function getErrorMessage(errorCode: number): string {
  const errorMap: Record<number, string> = {
    9: COPY.errors.contributionAmountZero,
    17: COPY.errors.contributionAmountNegative,
    10: COPY.errors.cycleDurationZero,
    11: COPY.errors.maxMembersBelowMinimum,
    18: COPY.errors.maxMembersAboveLimit,
    2: COPY.errors.maxMembersExceeded,
  };
  
  return errorMap[errorCode] || 'An unexpected error occurred. Please try again.';
}

// Usage
try {
  await createGroup(amount, duration, maxMembers);
} catch (error) {
  const message = getErrorMessage(error.code);
  showError(message);
}
```

---

## Copy Integration Checklist

### For Each UI Element

- [ ] Import copy from centralized constants
- [ ] Use appropriate copy for context
- [ ] Add ARIA labels for accessibility
- [ ] Include alt text for icons
- [ ] Handle dynamic values (dates, amounts, names)
- [ ] Test with screen readers
- [ ] Verify character limits
- [ ] Check mobile display

### For Forms

```typescript
// Form field example
<FormField
  label={COPY.forms.contributionAmount.label}
  placeholder={COPY.forms.contributionAmount.placeholder}
  helperText={COPY.forms.contributionAmount.helperText}
  error={errors.amount && getErrorMessage(errors.amount.code)}
  aria-describedby="amount-helper-text"
  aria-required="true"
/>
```

### For Notifications

```typescript
// Toast notification example
function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 5000,
    dismissible: true,
    icon: '✓',
    ariaLive: 'polite',
  });
}

// Usage
showSuccessToast(COPY.success.groupCreated);
```

---

## Accessibility Implementation

### Screen Reader Announcements

```typescript
// Announce status changes
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => announcement.remove(), 1000);
}

// Usage
announceToScreenReader('Group created successfully. You are now the first member.');
```

### ARIA Labels

```typescript
// Button with descriptive label
<button
  onClick={handleCreateGroup}
  aria-label="Create new Ajo savings group"
  aria-describedby="create-group-help"
>
  {COPY.buttons.createGroup}
</button>

<span id="create-group-help" className="sr-only">
  Start a new savings group with custom contribution amount and cycle duration
</span>
```

---

## Dynamic Copy Examples

### Dates

```typescript
import { formatDistanceToNow, format } from 'date-fns';

function formatDueDate(date: Date): string {
  const now = new Date();
  const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `Due: ${formatDistanceToNow(date, { addSuffix: true })}`;
  }
  
  return `Due: ${format(date, 'MMM d, yyyy')}`;
}

// Usage
<span>{formatDueDate(contributionDueDate)}</span>
// Output: "Due: in 3 hours" or "Due: Mar 15, 2026"
```

### Amounts

```typescript
function formatAmount(amount: number, currency: string = 'XLM'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

function formatAmountWithUSD(xlm: number, rate: number): string {
  const usd = xlm * rate;
  return `${formatAmount(xlm)} (≈ $${usd.toFixed(2)} USD)`;
}

// Usage
<span>{formatAmount(1000)}</span>
// Output: "1,000 XLM"

<span>{formatAmountWithUSD(1000, 0.25)}</span>
// Output: "1,000 XLM (≈ $250.00 USD)"
```

### Counts

```typescript
function formatContributionStatus(current: number, total: number): string {
  return `${current} of ${total} contributed`;
}

function formatCycleProgress(current: number, total: number): string {
  return `Cycle ${current} of ${total}`;
}

// Usage
<span>{formatContributionStatus(3, 5)}</span>
// Output: "3 of 5 contributed"
```

---

## Testing Copy

### Unit Tests

```typescript
import { COPY } from './copy';

describe('Copy constants', () => {
  it('should have all required button labels', () => {
    expect(COPY.buttons.createGroup).toBeDefined();
    expect(COPY.buttons.joinGroup).toBeDefined();
    expect(COPY.buttons.contribute).toBeDefined();
  });
  
  it('should format dynamic messages correctly', () => {
    const message = COPY.success.contributed(3, 5);
    expect(message).toContain('3 of 5');
  });
  
  it('should handle error messages', () => {
    const message = COPY.errors.insufficientBalance(1000, 500);
    expect(message).toContain('1000 XLM');
    expect(message).toContain('500 XLM');
  });
});
```

### Accessibility Tests

```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  it('should have accessible button labels', () => {
    render(<CreateGroupButton />);
    const button = screen.getByRole('button', { name: /create new ajo savings group/i });
    expect(button).toBeInTheDocument();
  });
  
  it('should have no accessibility violations', async () => {
    const { container } = render(<CreateGroupForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Copy Updates Workflow

### 1. Update Copy Constants
```typescript
// copy.ts
export const COPY = {
  // ... existing copy
  newFeature: {
    headline: 'New Feature',
    description: 'Description here',
  },
};
```

### 2. Update Components
```typescript
// Component.tsx
import { COPY } from './copy';

function NewFeature() {
  return (
    <div>
      <h2>{COPY.newFeature.headline}</h2>
      <p>{COPY.newFeature.description}</p>
    </div>
  );
}
```

### 3. Update Tests
```typescript
// Component.test.tsx
it('should display new feature copy', () => {
  render(<NewFeature />);
  expect(screen.getByText(COPY.newFeature.headline)).toBeInTheDocument();
});
```

### 4. Update Documentation
- Add to IN_APP_COPY_GUIDE.md
- Update IN_APP_COPY_SPREADSHEET.md
- Note in CHANGELOG.md

---

## Localization Setup

### i18n Structure

```typescript
// locales/en.json
{
  "buttons": {
    "createGroup": "Create Group",
    "joinGroup": "Join This Group"
  },
  "success": {
    "groupCreated": "Group created successfully!"
  },
  "errors": {
    "contributionAmountZero": "Contribution amount must be greater than zero."
  }
}

// locales/es.json
{
  "buttons": {
    "createGroup": "Crear Grupo",
    "joinGroup": "Unirse a Este Grupo"
  },
  "success": {
    "groupCreated": "¡Grupo creado exitosamente!"
  },
  "errors": {
    "contributionAmountZero": "El monto de contribución debe ser mayor que cero."
  }
}
```

### Usage with i18n

```typescript
import { useTranslation } from 'react-i18next';

function CreateGroupButton() {
  const { t } = useTranslation();
  
  return (
    <button aria-label={t('buttons.createGroup.ariaLabel')}>
      {t('buttons.createGroup')}
    </button>
  );
}
```

---

## Performance Considerations

### Lazy Load Copy

```typescript
// For large copy files
const COPY = {
  // Critical copy loaded immediately
  buttons: { /* ... */ },
  
  // Non-critical copy loaded on demand
  get help() {
    return import('./copy/help').then(m => m.HELP_COPY);
  },
};
```

### Memoize Dynamic Copy

```typescript
import { useMemo } from 'react';

function ContributionStatus({ current, total }: Props) {
  const message = useMemo(
    () => COPY.success.contributed(current, total),
    [current, total]
  );
  
  return <span>{message}</span>;
}
```

---

## Common Pitfalls

### ❌ Don't Hardcode Copy
```typescript
// Bad
<button>Create Group</button>

// Good
<button>{COPY.buttons.createGroup}</button>
```

### ❌ Don't Concatenate Strings
```typescript
// Bad - doesn't work for all languages
const message = 'You have ' + count + ' groups';

// Good - uses template or function
const message = COPY.messages.groupCount(count);
```

### ❌ Don't Forget Accessibility
```typescript
// Bad
<button onClick={handleClick}>X</button>

// Good
<button onClick={handleClick} aria-label="Close dialog">
  X
</button>
```

### ❌ Don't Use Technical Terms
```typescript
// Bad
'Smart contract execution failed'

// Good
'Transaction didn't go through. Please try again.'
```

---

## Resources

### Copy Files
- `docs/IN_APP_COPY_GUIDE.md` - Complete copy reference
- `docs/IN_APP_COPY_SPREADSHEET.md` - Structured copy data
- `docs/TONE_AND_VOICE_GUIDE.md` - Writing guidelines

### Tools
- [Hemingway Editor](http://hemingwayapp.com/) - Check readability
- [Grammarly](https://grammarly.com/) - Grammar and tone
- [axe DevTools](https://www.deque.com/axe/) - Accessibility testing

### Testing
- Screen readers: NVDA (Windows), VoiceOver (Mac), TalkBack (Android)
- Browser extensions: WAVE, Lighthouse
- User testing: Test with real users regularly

---

**Document Version**: 1.0  
**Last Updated**: February 20, 2026  
**For Questions**: Contact UX/Product team
