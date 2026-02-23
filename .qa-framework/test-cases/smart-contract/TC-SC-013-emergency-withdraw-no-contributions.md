# Test Case: TC-SC-013 - Emergency Withdrawal (No Contributions Made)

## Test Information
- **Test ID**: TC-SC-013
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: Medium
- **Test Type**: Edge Case
- **Created**: 2024-02-23

## Description
Verify that members who joined but never contributed can still perform emergency withdrawal (receiving zero refund).

## Preconditions
- Smart contract is deployed
- Member has joined a group
- Member has NOT made any contributions
- At least one cycle duration has passed

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3
- **Contributions Made**: 0
- **Expected Penalty**: 0 stroops
- **Expected Refund**: 0 stroops

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have one additional member join the group
3. Do NOT make any contributions
4. Advance ledger time past cycle duration
5. Member2 performs `emergency_withdraw`
6. Verify the returned refund and penalty amounts

## Expected Results
- Emergency withdrawal succeeds
- Refund amount equals 0 stroops
- Penalty amount equals 0 stroops
- Withdrawal event is emitted with zero amounts
- Member is marked as withdrawn
- No funds are transferred

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test validates edge case handling for members who joined but never participated
- Members can still formally exit the group even without contributions
- Ensures the withdrawal mechanism doesn't fail on zero amounts
