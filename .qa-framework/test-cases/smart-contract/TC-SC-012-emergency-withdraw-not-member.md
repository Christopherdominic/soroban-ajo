# Test Case: TC-SC-012 - Emergency Withdrawal (Not a Member)

## Test Information
- **Test ID**: TC-SC-012
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Negative
- **Created**: 2024-02-23

## Description
Verify that non-members cannot perform emergency withdrawal from a group.

## Preconditions
- Smart contract is deployed
- A group exists with active members
- Test address is NOT a member of the group

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3

## Test Steps
1. Create a new Ajo group with 3 max members
2. Advance ledger time past cycle duration
3. Generate a new address that is not a member
4. Non-member attempts `emergency_withdraw`
5. Verify the operation fails with appropriate error

## Expected Results
- Emergency withdrawal fails with `NotMember` error
- No funds are transferred
- No withdrawal event is emitted
- Group state is not modified
- Non-member cannot access group funds

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test validates basic access control for emergency withdrawals
- Only group members should be able to withdraw their contributions
- Critical security check to prevent unauthorized fund access
