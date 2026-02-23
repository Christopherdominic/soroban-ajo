# Test Case: TC-SC-009 - Emergency Withdrawal (Not Eligible - Too Early)

## Test Information
- **Test ID**: TC-SC-009
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Negative
- **Created**: 2024-02-23

## Description
Verify that emergency withdrawal is rejected when attempted before the eligibility conditions are met (before cycle duration has passed).

## Preconditions
- Smart contract is deployed
- Member has joined a group
- Member has made contributions
- Cycle duration has NOT yet passed since cycle start

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3
- **Time Elapsed**: Less than cycle duration

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have one additional member join the group
3. Both members contribute for cycle 1
4. Immediately attempt `emergency_withdraw` for member2 (without advancing time)
5. Verify the operation fails with appropriate error

## Expected Results
- Emergency withdrawal fails with `NotEligibleForWithdrawal` error
- No funds are transferred
- No withdrawal event is emitted
- Member's status remains unchanged
- Group state is not modified

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test ensures the emergency withdrawal mechanism cannot be abused
- Members must wait for at least one cycle duration to pass, indicating a stalled group
- Prevents premature withdrawals from active groups
