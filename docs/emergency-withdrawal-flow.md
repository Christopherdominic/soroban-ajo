# Emergency Withdrawal Flow

## Overview
This document describes the emergency withdrawal mechanism that allows members to safely exit stalled Ajo groups.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Emergency Withdrawal Flow                     │
└─────────────────────────────────────────────────────────────────┘

    Member Requests Withdrawal
            │
            ▼
    ┌───────────────────┐
    │ Authenticate      │
    │ Member            │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Check Eligibility │◄──────────┐
    └─────────┬─────────┘           │
              │                     │
              ▼                     │
    ┌─────────────────────────┐    │
    │ Is Member?              │────NO──► Return NotMember Error
    └─────────┬───────────────┘    │
              │ YES                │
              ▼                     │
    ┌─────────────────────────┐    │
    │ Already Withdrawn?      │────YES─► Return AlreadyWithdrawn Error
    └─────────┬───────────────┘    │
              │ NO                 │
              ▼                     │
    ┌─────────────────────────┐    │
    │ Received Payout?        │────YES─► Return WithdrawalAfterPayout Error
    └─────────┬───────────────┘    │
              │ NO                 │
              ▼                     │
    ┌─────────────────────────┐    │
    │ Cycle Duration Passed?  │────NO──► Return NotEligibleForWithdrawal Error
    └─────────┬───────────────┘
              │ YES
              ▼
    ┌───────────────────────────┐
    │ Calculate Withdrawal      │
    │ Amounts                   │
    │                           │
    │ 1. Count contributions    │
    │ 2. Total = count × amount │
    │ 3. Penalty = total × 10%  │
    │ 4. Refund = total - penalty│
    └─────────┬─────────────────┘
              │
              ▼
    ┌───────────────────┐
    │ Mark as Withdrawn │
    │ in Storage        │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Transfer Refund   │
    │ to Member         │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Emit Withdrawal   │
    │ Event             │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Return (refund,   │
    │        penalty)   │
    └───────────────────┘
```

## Eligibility Conditions

### ✅ Eligible for Withdrawal
A member can withdraw if ALL of the following are true:
1. ✓ Is a member of the group
2. ✓ Has NOT already withdrawn
3. ✓ Has NOT received payout yet
4. ✓ At least one cycle duration has passed since cycle start

### ❌ Not Eligible for Withdrawal
Withdrawal is rejected if ANY of the following are true:
- ✗ Not a member of the group → `NotMember` error
- ✗ Already withdrawn → `AlreadyWithdrawn` error
- ✗ Already received payout → `WithdrawalAfterPayout` error
- ✗ Cycle duration has not passed → `NotEligibleForWithdrawal` error

## Calculation Examples

### Example 1: Single Contribution
```
Contribution Amount: 100,000,000 stroops (10 XLM)
Contributions Made: 1
Total Contributed: 100,000,000 stroops

Penalty (10%): 10,000,000 stroops
Refund (90%): 90,000,000 stroops
```

### Example 2: Multiple Contributions
```
Contribution Amount: 100,000,000 stroops (10 XLM)
Contributions Made: 3
Total Contributed: 300,000,000 stroops

Penalty (10%): 30,000,000 stroops
Refund (90%): 270,000,000 stroops
```

### Example 3: No Contributions
```
Contribution Amount: 100,000,000 stroops (10 XLM)
Contributions Made: 0
Total Contributed: 0 stroops

Penalty (10%): 0 stroops
Refund (90%): 0 stroops
```

## Timeline Example

```
Group Created
│
├─ Cycle 1 Starts (t=0)
│  │
│  ├─ All members contribute
│  │
│  ├─ Cycle Duration: 7 days
│  │
│  └─ Expected Payout: Day 7
│
├─ Day 7: No payout executed (GROUP STALLS)
│  │
│  └─ Members now eligible for emergency withdrawal
│
├─ Day 8: Member performs emergency withdrawal
│  │
│  ├─ Eligibility check: ✓ (>7 days passed)
│  ├─ Calculate: 1 contribution × 10 XLM = 10 XLM
│  ├─ Penalty: 1 XLM (10%)
│  ├─ Refund: 9 XLM (90%)
│  └─ Transfer 9 XLM to member
│
└─ Member successfully exited
```

## State Transitions

```
┌─────────────┐
│   Joined    │
│   Group     │
└──────┬──────┘
       │
       │ contribute()
       ▼
┌─────────────┐
│ Contributed │
│  (Active)   │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       │ execute_payout() │ emergency_withdraw()
       │                  │ (after cycle duration)
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Received   │    │  Withdrawn  │
│   Payout    │    │  (Exited)   │
└─────────────┘    └─────────────┘
       │                  │
       │                  │
       └──────────┬───────┘
                  │
                  ▼
          Cannot Withdraw
```

## Security Features

### 1. Time-Based Eligibility
- Prevents premature withdrawals from active groups
- Requires at least one full cycle duration to pass
- Indicates genuine group stall

### 2. Single Withdrawal Limit
- Members can only withdraw once per group
- Prevents repeated withdrawal attacks
- Enforced through storage tracking

### 3. Payout Prevention
- Members who received payout cannot withdraw
- Prevents double-dipping
- Protects group funds

### 4. Penalty Mechanism
- 10% penalty on all contributions
- Discourages abuse of emergency exit
- Penalty remains in contract pool

### 5. Authentication Required
- Member must authenticate to withdraw
- Prevents unauthorized withdrawals
- Standard Soroban security

## Integration Points

### Smart Contract Events
```rust
emit_emergency_withdrawal(
    env: &Env,
    group_id: u64,
    member: &Address,
    refund_amount: i128,
    penalty_amount: i128
)
```

### Frontend Integration
```typescript
// Check eligibility
const isEligible = await checkWithdrawalEligibility(groupId, memberAddress);

// Calculate estimated amounts
const { refund, penalty } = await estimateWithdrawal(groupId, memberAddress);

// Perform withdrawal
const result = await contract.emergency_withdraw({
    member: memberAddress,
    group_id: groupId
});

// Handle result
console.log(`Refunded: ${result.refund}`);
console.log(`Penalty: ${result.penalty}`);
```

## Error Handling

| Error Code | Error Name | Description | User Action |
|------------|------------|-------------|-------------|
| 1 | GroupNotFound | Group doesn't exist | Verify group ID |
| 4 | NotMember | Not a group member | Join group first |
| 17 | WithdrawalAfterPayout | Already received payout | Cannot withdraw |
| 18 | NotEligibleForWithdrawal | Too early to withdraw | Wait for cycle duration |
| 19 | AlreadyWithdrawn | Already withdrawn | Cannot withdraw again |

## Best Practices

### For Members
1. Wait for at least one cycle duration after the expected payout time
2. Check eligibility before attempting withdrawal
3. Understand that 10% penalty will be applied
4. Withdrawal is permanent - cannot rejoin and withdraw again

### For Group Creators
1. Set reasonable cycle durations
2. Communicate with members about group status
3. Execute payouts on time to prevent stalls
4. Monitor for withdrawal events

### For Developers
1. Display clear eligibility status in UI
2. Show estimated refund and penalty before withdrawal
3. Handle all error cases gracefully
4. Update UI immediately after withdrawal events
5. Provide clear messaging about withdrawal consequences

## Related Documentation
- [Smart Contract API](./architecture.md)
- [Test Cases](./.qa-framework/test-cases/smart-contract/)
- [Implementation Summary](../EMERGENCY_WITHDRAWAL_IMPLEMENTATION.md)
