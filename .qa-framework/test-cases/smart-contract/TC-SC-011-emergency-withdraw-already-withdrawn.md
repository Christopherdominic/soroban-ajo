# Test Case: TC-SC-011 - Emergency Withdrawal (Already Withdrawn)

## Test Information
- **Test ID**: TC-SC-011
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Negative
- **Created**: 2024-02-23

## Description
Verify that members cannot perform emergency withdrawal more than once from the same group.

## Preconditions
- Smart contract is deployed
- Member has joined a group
- Member has made contributions
- Member has already performed an emergency withdrawal

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have two additional members join the group
3. All members contribute for cycle 1
4. Advance ledger time past cycle duration
5. Member2 performs successful `emergency_withdraw`
6. Member2 attempts `emergency_withdraw` again
7. Verify the second operation fails with appropriate error

## Expected Results
- First emergency withdrawal succeeds
- Second emergency withdrawal fails with `AlreadyWithdrawn` error
- No additional funds are transferred on second attempt
- No additional withdrawal event is emitted
- Member remains marked as withdrawn

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test prevents members from withdrawing multiple times
- The withdrawal status is permanently recorded in storage
- Critical for preventing fund drainage attacks
