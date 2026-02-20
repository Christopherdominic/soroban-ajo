# Contribution Form Architecture

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ContributionForm.tsx                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  User Interface                                        │ │
│  │  • Amount input field                                  │ │
│  │  • Balance display                                     │ │
│  │  • Transaction summary                                 │ │
│  │  • Submit button                                       │ │
│  │  • Success/Error messages                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Local Validation                                      │ │
│  │  • Amount validation                                   │ │
│  │  • Balance checking                                    │ │
│  │  • Cooldown enforcement                                │ │
│  │  • Decimal validation                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    useContribute.ts                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Query Mutation                                  │ │
│  │  • mutationFn: calls sorobanService.contribute()       │ │
│  │  • onSuccess: invalidate queries, track analytics      │ │
│  │  • onError: track error                                │ │
│  │  • Returns: { transactionHash, timestamp }             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    soroban.ts (Service)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Smart Contract Integration                            │ │
│  │  • Retry logic with exponential backoff                │ │
│  │  • Error classification                                │ │
│  │  • Analytics tracking                                  │ │
│  │  • Notification system                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Soroban Smart Contract                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Blockchain Transaction                                │ │
│  │  • Validate contribution                               │ │
│  │  • Update group state                                  │ │
│  │  • Record transaction                                  │ │
│  │  • Return transaction hash                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input → Validation → Hook → Service → Contract → Response
    ↓           ↓          ↓        ↓         ↓          ↓
  amount    errors?    mutate   retry?   execute   success?
                                           ↓
                                      Analytics
                                      Notifications
                                      Cache Update
```

## State Management

```
┌──────────────────────────────────────────────────────────┐
│  Component State (ContributionForm)                      │
├──────────────────────────────────────────────────────────┤
│  • amount: number                                        │
│  • errors: ValidationError[]                             │
│  • touched: boolean                                      │
│  • successMessage: string                                │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│  Mutation State (useContribute)                          │
├──────────────────────────────────────────────────────────┤
│  • isPending: boolean                                    │
│  • error: Error | null                                   │
│  • data: ContributeResult | undefined                    │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│  Query Cache (React Query)                               │
├──────────────────────────────────────────────────────────┤
│  • ['group', groupId] → invalidated on success           │
│  • ['groups'] → invalidated on success                   │
│  • ['transactions'] → invalidated on success             │
└──────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    ↓
┌─────────────────────┐
│ Is Retryable?       │
├─────────────────────┤
│ • Network error     │
│ • Timeout           │
│ • Rate limit (429)  │
│ • Server error (5xx)│
└─────────────────────┘
    ↓
  Yes → Retry with backoff (max 3 times)
    ↓
   No → Classify error
    ↓
┌─────────────────────────────────────┐
│ Error Classification                │
├─────────────────────────────────────┤
│ • Insufficient balance → medium     │
│ • Invalid parameters → medium       │
│ • Network error → high              │
│ • Contract error → high             │
│ • Unknown → critical                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ User Notification                   │
├─────────────────────────────────────┤
│ • Toast notification (error)        │
│ • Form error message                │
│ • Analytics tracking                │
└─────────────────────────────────────┘
```

## Success Flow

```
Contribution Submitted
    ↓
Contract Execution
    ↓
Transaction Hash Generated
    ↓
┌─────────────────────────────────────┐
│ Success Actions                     │
├─────────────────────────────────────┤
│ 1. Invalidate queries               │
│ 2. Track analytics event            │
│ 3. Show success message             │
│ 4. Display transaction hash         │
│ 5. Reset form state                 │
│ 6. Auto-dismiss after 5s            │
└─────────────────────────────────────┘
```

## Integration Points

```
┌──────────────────────┐
│  ContributionForm    │
└──────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │                                │
    ↓                                ↓
┌─────────────┐              ┌──────────────┐
│ useContribute│              │ Validation   │
└─────────────┘              └──────────────┘
    ↓                                ↓
┌─────────────┐              ┌──────────────┐
│ Soroban     │              │ Types        │
│ Service     │              │ (index.ts)   │
└─────────────┘              └──────────────┘
    ↓
┌─────────────┐
│ Analytics   │
│ Notifications│
└─────────────┘
```

## Key Interfaces

```typescript
// Input
interface ContributeParams {
  groupId: string
  amount: number
}

// Output
interface ContributeResult {
  transactionHash: string
  timestamp: string
}

// Validation
interface ValidationError {
  field: string
  message: string
}

interface ContributionValidation {
  isValid: boolean
  errors: ValidationError[]
}
```

## Validation Rules

```
Amount Input
    ↓
┌─────────────────────────────────┐
│ Is numeric?                     │ → No → Error: "Enter valid amount"
└─────────────────────────────────┘
    ↓ Yes
┌─────────────────────────────────┐
│ >= $0.01?                       │ → No → Error: "Min $0.01"
└─────────────────────────────────┘
    ↓ Yes
┌─────────────────────────────────┐
│ <= 2 decimal places?            │ → No → Error: "Max 2 decimals"
└─────────────────────────────────┘
    ↓ Yes
┌─────────────────────────────────┐
│ Matches required amount?        │ → No → Error: "Must match $X"
└─────────────────────────────────┘
    ↓ Yes
┌─────────────────────────────────┐
│ Balance >= amount + fee?        │ → No → Error: "Insufficient balance"
└─────────────────────────────────┘
    ↓ Yes
┌─────────────────────────────────┐
│ Last contribution > 24h ago?    │ → No → Error: "Wait X hours"
└─────────────────────────────────┘
    ↓ Yes
    ✅ Valid
```
