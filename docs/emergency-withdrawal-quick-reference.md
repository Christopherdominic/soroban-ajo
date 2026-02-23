# Emergency Withdrawal - Quick Reference

## Function Signature
```rust
pub fn emergency_withdraw(
    env: Env,
    member: Address,
    group_id: u64,
) -> Result<(i128, i128), AjoError>
```

## Returns
- `(refund_amount, penalty_amount)` on success
- Error on failure

## Eligibility Checklist
- [ ] Member of the group
- [ ] Has NOT withdrawn before
- [ ] Has NOT received payout
- [ ] Cycle duration has passed since cycle start

## Penalty Calculation
```
Total Contributed = contribution_amount × number_of_contributions
Penalty = Total Contributed × 10%
Refund = Total Contributed - Penalty
```

## Error Codes
| Code | Error | Meaning |
|------|-------|---------|
| 1 | GroupNotFound | Invalid group ID |
| 4 | NotMember | Not a member |
| 17 | WithdrawalAfterPayout | Already got payout |
| 18 | NotEligibleForWithdrawal | Too early |
| 19 | AlreadyWithdrawn | Already withdrew |

## Usage Example
```rust
// Perform emergency withdrawal
let (refund, penalty) = contract.emergency_withdraw(
    &member_address,
    &group_id
)?;

println!("Refund: {} stroops", refund);
println!("Penalty: {} stroops", penalty);
```

## Testing
```bash
# Run all emergency withdrawal tests
cargo test emergency_withdraw

# Run specific test
cargo test test_emergency_withdraw_eligible
```

## Key Points
✓ 10% penalty applied to all contributions
✓ One-time operation per member per group
✓ Requires cycle duration to pass (stalled group)
✓ Cannot withdraw after receiving payout
✓ Penalty stays in contract pool
