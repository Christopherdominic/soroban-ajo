# Test Case: TC-SC-010 - Emergency Withdrawal (After Payout Received)

## Test Information
- **Test ID**: TC-SC-010
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Negative
- **Created**: 2024-02-23

## Description
Verify that members who have already received their payout cannot perform an emergency withdrawal.

## Preconditions
- Smart contract is deployed
- Member has joined a group
- Member has made contributions
- Member has already received their payout from the group

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3
- **Member Position**: First in payout order (creator)

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have two additional members join the group
3. All members contribute for cycle 1
4. Execute payout for cycle 1 (creator receives payout)
5. Advance ledger time past cycle duration
6. Creator attempts `emergency_withdraw`
7. Verify the operation fails with appropriate error

## Expected Results
- Emergency withdrawal fails with `WithdrawalAfterPayout` error
- No funds are transferred
- No withdrawal event is emitted
- Member's status remains unchanged
- Group state is not modified

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test prevents double-dipping: members cannot receive payout and then withdraw
- Once a member receives their payout, they have already benefited from the group
- This is a critical security check to prevent fund drainage
